"use client";

import { useEffect, useState, useCallback } from 'react';
import CancelAppointmentModal from '@/components/CancelAppointmentModal';
import Link from "next/link";
import {getAppointments, updateAppointment, cancelAppointment} from "@/lib/services/appointments";
import {PaginationMeta} from "@/lib/types";
import Pagination from "@/components/common/Pagination";
import {Appointment, AppointmentSearchParams, AppointmentUpdateRequest,} from "@/lib/types/appointments";
import {useTranslation} from "react-i18next";
import {formatAppointmentTime} from "@/lib/utils";
import {addDays, isAfter, isBefore, isEqual, subDays} from "date-fns";
import {getAppointmentTitle} from "@/lib/utils/appointments";
import {useAuthStore} from "@/store/auth-store";
import LoadingSpinner from "@/components/appointments/list-and-detail/LoadingSpinner";
import StatusBadge from "@/components/appointments/list-and-detail/StatusBadge";
import StatusSelector from "@/components/appointments/list-and-detail/StatusSelector";
import ChatToggle from "@/components/appointments/list-and-detail/ChatToggle";
import {AppointmentStatus} from "@/lib/enums/appointment-status.enum";
import {useToast} from "@/components/common/Toast";
import { Button } from "@/components/ui/button";

export default function AppointmentsTab() {
  const {t, i18n} = useTranslation();
  const [activeFilter, setActiveFilter] = useState<AppointmentStatus | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
  const [updatingChatId, setUpdatingChatId] = useState<number | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useState<AppointmentSearchParams>({
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    page_size: 10,
    total_items: 0,
    total_pages: 0,
  });

  const {user} = useAuthStore();
  const {error: toastError, success: toastSuccess} = useToast()
  const isLawyer = user?.role === "lawyer";
  
  const availableStatuses: AppointmentStatus[] = isLawyer
    ? [
        AppointmentStatus.Pending,
        AppointmentStatus.Confirmed,
        AppointmentStatus.Completed,
      ]
    : [
        AppointmentStatus.Pending,
        AppointmentStatus.Confirmed,
        AppointmentStatus.Completed,
        AppointmentStatus.Cancelled,
      ];

  const fetchAppointments = useCallback(async (filterStatus: string | null) => {
    setLoading(true);
    setError(null);
    const params: AppointmentSearchParams = {
      page: searchParams.page,
      limit: searchParams.limit
    };
    if (user?.role === 'admin') {
      params.client_id = user.id
    }
    if (filterStatus !== null) {
      params.status = filterStatus;
    }
    try {
      const response = await getAppointments(params);
      if (response?.data && Array.isArray(response.data)) {
        setAppointments(response.data);
        setPagination(
          response.pagination || {
            page: 1,
            page_size: 10,
            total_items: 0,
            total_pages: 0,
          }
        );
      } else {
        setAppointments([]);
        setPagination({
          page: 1,
          page_size: 10,
          total_items: 0,
          total_pages: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments. Please try again.");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams, user]);

  useEffect(() => {
    fetchAppointments(activeFilter);
  }, [activeFilter, fetchAppointments]);

  const filterAppointments = (status: AppointmentStatus | null) => {
    setActiveFilter(status);
    setSearchParams({ ...searchParams, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ ...searchParams, page: newPage });
  };

  const handleStatusChange = async (appointmentId: number, newStatus: AppointmentStatus) => {
    const appointmentToUpdate = appointments.find((app) => app.id === appointmentId);
    if (!appointmentToUpdate) {
      console.error("Appointment not found in state:", appointmentId);
      toastError(t("appointments.errorUpdatingStatus"));
      return;
    }

    if (appointmentToUpdate.status === newStatus) return;

    if (newStatus === AppointmentStatus.Cancelled && !isLawyer) {
      const appointmentDate = new Date(appointmentToUpdate.start_time);
      const deadlineCancelDate = subDays(appointmentDate, 2);
      const now = new Date();

      if (isAfter(now, deadlineCancelDate) || isEqual(now, deadlineCancelDate)) {
        // Show toast error message using the translation key
        toastError(t("appointments.cancelRestriction"));
        return;
      }
    }

    if (
      !window.confirm(
        t("appointments.confirmStatusChange", {newStatus: t(`appointments.status.${newStatus}`)})
      )
    ) {
      return;
    }

    setUpdatingStatusId(appointmentId);
    try {
      const payload: AppointmentUpdateRequest = {status: newStatus};
      const response = await updateAppointment(appointmentId, payload);
      setAppointments((currentAppointments) =>
        currentAppointments.map((app) =>
          app.id === appointmentId ? {...app, status: response.data.status} : app
        )
      );
      await fetchAppointments(activeFilter);
    } catch (err: any) {
      console.error("Error updating appointment status:", err);
      toastError(t("appointments.errorUpdatingStatus"));

      setAppointments((currentAppointments) =>
        currentAppointments.map((app) =>
          app.id === appointmentId ? {...app, status: appointmentToUpdate.status} : app
        )
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleChatToggle = async (appointmentId: number, currentChatEnabled: boolean) => {
    setUpdatingChatId(appointmentId);
    try {
      const currentAppointment = appointments.find((a) => a.id === appointmentId);
      if (!currentAppointment) {
        toastError(t("appointments.appointmentNotFound"));
        return;
      }

      // Create the update request
      const updateRequest: AppointmentUpdateRequest = {
        chat_enabled: !currentChatEnabled,
      };

      const response = await updateAppointment(appointmentId, updateRequest);

      if (response) {
        // Update local appointment status
        const updatedAppointments = appointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, chat_enabled: !currentChatEnabled }
            : appointment
        );
        setAppointments(updatedAppointments);
      }
    } catch (err) {
      console.error("Error toggling chat:", err);
      toastError(t("appointments.chatToggleError"));
    } finally {
      setUpdatingChatId(null);
    }
  };

  // Handle opening the cancel modal
  const handleOpenCancelModal = (appointmentId: number) => {
    const appointmentToUpdate = appointments.find((app) => app.id === appointmentId);
    if (!appointmentToUpdate) {
      console.error("Appointment not found in state:", appointmentId);
      toastError(t("appointments.errorUpdatingStatus"));
      return;
    }

    // Check if cancellation is allowed (2 days before appointment)
    if (!isLawyer) {
      const appointmentDate = new Date(appointmentToUpdate.start_time);
      const deadlineCancelDate = subDays(appointmentDate, 2);
      const now = new Date();

      if (isAfter(now, deadlineCancelDate) || isEqual(now, deadlineCancelDate)) {
        toastError(t("appointments.cancelRestriction"));
        return;
      }
    }

    setAppointmentToCancel(appointmentId);
    setIsCancelModalOpen(true);
  };

  // Handle confirming cancellation with reason
  const handleConfirmCancel = async (reason: string) => {
    if (!appointmentToCancel) return;

    try {
      const response = await cancelAppointment(appointmentToCancel, reason);

      // Update appointments list
      setAppointments((currentAppointments) =>
        currentAppointments.map((app) =>
          app.id === appointmentToCancel ?
            {...app, status: AppointmentStatus.Cancelled, cancel_reason: reason} :
            app
        )
      );

      toastSuccess(t("appointments.cancelSuccess"));
      await fetchAppointments(activeFilter);
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      toastError(t("appointments.cancelError"));
    } finally {
      setAppointmentToCancel(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col space-y-4">
        <CancelAppointmentModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirm={handleConfirmCancel}
        />

        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant="ghost"
            className={`px-3 py-1 text-sm ${activeFilter === null ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            onClick={() => filterAppointments(null)}
          >
            {t("appointments.all")}
          </Button>
          <Button
            variant="ghost"
            className={`px-3 py-1 text-sm ${activeFilter === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            onClick={() => filterAppointments(AppointmentStatus.Pending)}
          >
            {t("appointments.pending")}
          </Button>
          <Button
            variant="ghost"
            className={`px-3 py-1 text-sm ${activeFilter === "confirmed" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            onClick={() => filterAppointments(AppointmentStatus.Confirmed)}
          >
            {t("appointments.confirmed")}
          </Button>
          <Button
            variant="ghost"
            className={`px-3 py-1 text-sm ${activeFilter === "completed" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            onClick={() => filterAppointments(AppointmentStatus.Completed)}
          >
            {t("appointments.completed")}
          </Button>
          <Button
            variant="ghost"
            className={`px-3 py-1 text-sm ${activeFilter === "cancelled" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            onClick={() => filterAppointments(AppointmentStatus.Cancelled)}
          >
            {t("appointments.cancelled")}
          </Button>
          <Button
            variant="ghost"
            className={`px-3 py-1 text-sm ${activeFilter === "rejected" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            onClick={() => filterAppointments(AppointmentStatus.Rejected)}
          >
            {t("appointments.rejected")}
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center my-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
            <p className="text-red-700 mb-2">{error}</p>
            <Button 
              variant="danger"
              onClick={() => fetchAppointments(activeFilter)}
            >
              {t("common.tryAgain")}
            </Button>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
            <p className="text-gray-500 mb-4">{t("appointments.noAppointmentsFound")}</p>
            <Link href="/lawyers">
              <Button variant="primary">
                {t("appointments.findLawyer")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  {/* Left side: Appointment information */}
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium relative">
                        {getAppointmentTitle(appointment, isLawyer)}
                        {isLawyer && !appointment.is_lawyer_viewed && (
                          <span className="absolute -top-1 -right-3 h-2 w-2 bg-red-600 rounded-full"></span>
                        )}
                        {! isLawyer && !appointment.is_client_viewed && (
                          <span className="absolute -top-1 -right-3 h-2 w-2 bg-red-600 rounded-full"></span>
                        )}
                      </h3>
                      <StatusBadge status={appointment.status}/>
                    </div>
                    
                    <p className="text-gray-600 flex items-center gap-1 mt-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatAppointmentTime(appointment.start_time, appointment.end_time)}
                    </p>
                    {appointment.notes && (
                      <div className="mt-2 text-gray-600">
                        <span className="font-medium">{t("appointments.notes")}:</span>
                        <p className="break-words">  {appointment.notes.length > 50
                          ? `${appointment.notes.substring(0, 50)}...`
                          : appointment.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Right side: Action buttons */}
                  <div className="flex-shrink-0 self-start">
                    <div className="flex items-center space-x-2">
                      <Link href={`/appointments/${appointment.id}`}>
                        <Button 
                          variant="secondary"
                          className="px-3 py-1 text-sm"
                        >
                          {t("appointments.viewDetails")}
                        </Button>
                      </Link>
                      {isLawyer ? (
                        appointment.status !== "completed" &&
                        appointment.status !== "cancelled" &&
                        appointment.status !== "rejected" && (
                          <StatusSelector
                            value={appointment.status}
                            availableStatuses={availableStatuses}
                            onChange={(newStatus) => handleStatusChange(appointment.id, newStatus)}
                            disabled={updatingStatusId === appointment.id}
                          />
                        )
                      ) : (
                        (appointment.status === "pending" || appointment.status === "confirmed") && (
                          <Button
                            variant="danger"
                            onClick={() => handleOpenCancelModal(appointment.id)}
                            disabled={updatingStatusId === appointment.id}
                            isLoading={updatingStatusId === appointment.id}
                            className="px-3 py-1 text-sm whitespace-nowrap"
                          >
                            {updatingStatusId === appointment.id
                              ? t("appointments.cancelling")
                              : t("appointments.cancel")}
                          </Button>
                        )
                      )}
                    </div>
                    {isLawyer && appointment.status !== "cancelled" && (
                      <div className="mt-2 flex items-center">
                        <ChatToggle
                          checked={appointment.chat_enabled}
                          onChange={() => handleChatToggle(appointment.id, appointment.chat_enabled)}
                          disabled={updatingChatId === appointment.id}
                          updating={updatingChatId === appointment.id}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && appointments.length > 0 && pagination.total_pages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={pagination.page}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
