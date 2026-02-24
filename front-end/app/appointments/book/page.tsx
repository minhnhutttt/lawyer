"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BookingStep, BookingFormState } from "@/lib/types/appointments";
import { getPublicLawyerById } from "@/lib/services/lawyers";
import { createAppointment } from "@/lib/services/appointments";
import { addHours, addDays, format, isBefore } from "date-fns";
import { parse } from 'date-fns';
import { PublicLawyer } from "@/lib/types/lawyers";

import StepIndicator from "@/components/appointments/StepIndicator";
import FindLawyerStep from "@/components/appointments/FindLawyerStep";
import SelectDateTimeStep from "@/components/appointments/SelectDateTimeStep";
import CompleteBookingStep from "@/components/appointments/CompleteBookingStep";
import { useToast } from "@/components/common/Toast";
import {japanLocalToUtc, formatDateInJapan} from "@/lib/utils";

export default function BookAppointmentPage() {
  const { t } = useTranslation();
  const { error: toastError } = useToast()
  const router = useRouter();
  const searchParams = useSearchParams();

  const lawyerIdParam = searchParams.get("lawyer");

  const initialStep = lawyerIdParam
    ? BookingStep.SelectDateTime
    : BookingStep.FindLawyer;
  const [currentStep, setCurrentStep] = useState<BookingStep>(initialStep);

  const [formData, setFormData] = useState<BookingFormState>({
    lawyerId: lawyerIdParam ? parseInt(lawyerIdParam, 10) : null,
    lawyer: null,
    date: null,
    time: null,
    description: "",
  });

  const [isInitialLawyerLoading, setIsInitialLawyerLoading] = useState(
    !!lawyerIdParam
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lawyerIdParam) {
      const fetchLawyer = async () => {
        setIsInitialLawyerLoading(true);
        setError(null);
        try {
          const id = parseInt(lawyerIdParam, 10);
          if (isNaN(id)) {
            throw new Error("Invalid lawyer ID provided.");
          }
          const response = await getPublicLawyerById(id);
          setFormData((prev) => ({
            ...prev,
            lawyer: response.data,
            lawyerId: response.data.id,
          }));
        } catch (fetchError: any) {
          console.error("Error fetching initial lawyer:", fetchError);
          setError(t("errors.failedToLoadLawyerDetails"));

          setCurrentStep(BookingStep.FindLawyer);
          setFormData((prev) => ({
            ...prev,
            lawyer: null,
            lawyerId: null,
          }));
        } finally {
          setIsInitialLawyerLoading(false);
        }
      };
      fetchLawyer();
    }
  }, [lawyerIdParam, t, router]);

  const handleLawyerSelect = useCallback((lawyer: PublicLawyer) => {
    setFormData((prev) => ({
      ...prev,
      lawyerId: lawyer.id,
      lawyer: lawyer,
    }));
    setCurrentStep(BookingStep.SelectDateTime);
  }, []);

  const handleDateSelect = useCallback((date: string) => {
    setFormData((prev) => ({ ...prev, date, time: null }));
  }, []);

  const handleTimeSelect = useCallback((time: string) => {
    setFormData((prev) => ({ ...prev, time }));
  }, []);

  const handleDescriptionChange = useCallback((description: string) => {
    setFormData((prev) => ({ ...prev, description }));
  }, []);

  const handleNextStep = useCallback(() => {
    if (currentStep === BookingStep.FindLawyer && !formData.lawyer) {
      console.warn("Attempted to proceed without selecting a lawyer.");
      return;
    }
    if (
      currentStep === BookingStep.SelectDateTime &&
      (!formData.date || !formData.time)
    ) {
      toastError(t("appointments.selectDateTimeFirst"));
      return;
    }
    
    // Check if selected date is at least 2 days in advance when moving from date selection step
    if (currentStep === BookingStep.SelectDateTime && formData.date) {
      const today = new Date(formatDateInJapan(new Date()));
      const minBookableDate = addDays(today, 2);
      const selectedDate = new Date(formData.date);
      
      if (isBefore(selectedDate, minBookableDate)) {
        toastError(t("appointments.bookRestriction"));
        return;
      }
    }
    
    setCurrentStep((prev) => Math.min(prev + 1, BookingStep.CompleteBooking));
  }, [currentStep, formData, toastError]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep === BookingStep.SelectDateTime && lawyerIdParam) {
      setCurrentStep(BookingStep.FindLawyer);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, BookingStep.FindLawyer));
    }
  }, [currentStep, lawyerIdParam]);

  const handleSubmit = async () => {
    if (
      !formData.lawyerId ||
      !formData.date ||
      !formData.time ||
      !formData.description
    ) {
      toastError("appointments.fillAllFields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let startTime = parse(`${formData.date} ${formData.time}`, 'yyyy-MM-dd HH:mm', new Date());
      startTime = japanLocalToUtc(startTime)

      if (isNaN(startTime.getTime())) {
        throw new Error("Invalid date or time selected.");
      }
      const endTime = addHours(startTime, 1);

      const appointmentData = {
        lawyer_id: formData.lawyerId,
        description: formData.description,
        notes: formData.description,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
      };

      await createAppointment(appointmentData);

      router.push("/profile?tab=appointments");
    } catch (err: any) {
      console.error("Error creating appointment:", err);
      setError(
        t("appointments.bookingError") + (err.message ? `: ${err.message}` : "")
      );
      toastError("appointments.bookingError");
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    if (isInitialLawyerLoading) {
      return <div className="text-center p-10">{t("common.loading")}...</div>;
    }

    if (currentStep === BookingStep.SelectDateTime && lawyerIdParam && error) {
      return <div className="text-center p-10 text-red-600">{error}</div>;
    }

    switch (currentStep) {
      case BookingStep.FindLawyer:
        return <FindLawyerStep onLawyerSelect={handleLawyerSelect} />;

      case BookingStep.SelectDateTime:
        if (!formData.lawyer && lawyerIdParam) {
          return (
            <div className="text-center p-10">{t("common.loading")}...</div>
          );
        }
        if (!formData.lawyer) {
          console.error("Lawyer data missing in SelectDateTime step");
          setCurrentStep(BookingStep.FindLawyer);
          return null;
        }
        return (
          <SelectDateTimeStep
            lawyer={formData.lawyer}
            selectedDate={formData.date}
            selectedTime={formData.time}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            onNextStep={handleNextStep}
            onPreviousStep={handlePreviousStep}
          />
        );

      case BookingStep.CompleteBooking:
        return (
          <CompleteBookingStep
            formData={formData}
            onDescriptionChange={handleDescriptionChange}
            onSubmit={handleSubmit}
            onPreviousStep={handlePreviousStep}
            isSubmitting={isSubmitting}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-indigo-800">
        {t("appointments.bookAppointment")}
      </h1>

      {error &&
        !isInitialLawyerLoading &&
        currentStep === BookingStep.CompleteBooking && (
          <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
            {error}
          </div>
        )}

      <StepIndicator currentStep={currentStep} />

      <div className="mt-8">{renderStepContent()}</div>
    </div>
  );
}
