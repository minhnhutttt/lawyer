"use client";

import { useTranslation } from "react-i18next";
import { BookingFormState } from "@/lib/types/appointments";
import AppointmentForm from "@/components/appointments/childs/AppointmentForm";
import AppointmentSummary from "@/components/appointments/childs/AppointmentSummary";
import { Button } from "@/components/ui/button";

interface CompleteBookingStepProps {
  formData: BookingFormState;
  onDescriptionChange: (description: string) => void;
  onSubmit: () => Promise<void>;
  onPreviousStep: () => void;
  isSubmitting: boolean;
}

export default function CompleteBookingStep({
  formData,
  onDescriptionChange,
  onSubmit,
  onPreviousStep,
  isSubmitting,
}: CompleteBookingStepProps) {
  const { t } = useTranslation();

  const canSubmit = !!formData.description && !isSubmitting;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <AppointmentForm
          formData={formData}
          onDescriptionChange={onDescriptionChange}
          maxLength={500}
        />

        <div className="mt-6 flex justify-between pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            type="button"
            onClick={onPreviousStep}
            disabled={isSubmitting}
          >
            {t("common.back")}
          </Button>
          <Button
            variant="primary"
            type="button"
            disabled={!canSubmit}
            isLoading={isSubmitting}
            onClick={onSubmit}
          >
            {t("appointments.scheduleNow")}
          </Button>
        </div>
      </div>

      {}
      <AppointmentSummary formData={formData} />
    </div>
  );
}
