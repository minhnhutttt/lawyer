"use client";

import {useEffect, useState, useRef} from "react";
import {useParams, useRouter} from "next/navigation";
import Link from "next/link";
import {useTranslation} from "react-i18next";
import {getAppointmentById, updateAppointment, rejectAppointment, cancelAppointment} from "@/lib/services/appointments";
import {Appointment, AppointmentUpdateRequest, getFullName} from "@/lib/types";
import {formatAppointmentTime, formatDate} from "@/lib/utils";
import {getAppointmentTitle} from "@/lib/utils/appointments";
import {useAuthStore} from "@/store/auth-store";
import {addDays, isBefore} from "date-fns";
import LoadingSpinner from "@/components/appointments/list-and-detail/LoadingSpinner";
import StatusBadge from "@/components/appointments/list-and-detail/StatusBadge";
import StatusSelector from "@/components/appointments/list-and-detail/StatusSelector";
import ChatToggle from "@/components/appointments/list-and-detail/ChatToggle";
// Import the separated ChatSection component
import ChatSection from "@/components/appointments/list-and-detail/ChatSection";
import {AppointmentStatus} from "@/lib/enums/appointment-status.enum";
import ReviewModal from "@/components/reviews/ReviewModal";
import RejectModal from "@/components/appointments/list-and-detail/RejectModal";
import UserAvatarIcon from "@/components/UserAvatarIcon";
import CancelAppointmentModal from "@/components/CancelAppointmentModal";
import { getChatMessages } from "@/lib/services/chat";
import {useToast} from "@/components/common/Toast";
import { Button } from "@/components/ui/button";

export default function AppointmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const {t, i18n} = useTranslation();
  const {user} = useAuthStore();
  const {error: toastError} = useToast();
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingChat, setUpdatingChat] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [rejectingAppointment, setRejectingAppointment] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [loadingChatMessages, setLoadingChatMessages] = useState(false);

  const isLawyer = user?.role === "lawyer";
  const appointmentId = params.id ? Number(params.id) : null;
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

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!appointmentId) {
        setError("Invalid appointment ID.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await getAppointmentById(appointmentId);
        if (response?.data) {
          setAppointment(response.data);
          
          // Fetch chat messages for all appointments to check if there's chat history
          {
            setLoadingChatMessages(true);
            try {
              const chatResponse = await getChatMessages(appointmentId);
              setChatMessages(chatResponse.data || []);
            } catch (chatErr) {
              console.error("Error fetching chat messages:", chatErr);
              setChatMessages([]);
            } finally {
              setLoadingChatMessages(false);
            }
          }
        } else {
          setError(t("appointments.appointmentNotFound"));
          setAppointment(null);
        }
      } catch (err) {
        console.error("Error fetching appointment details:", err);
        setError(
          t("appointments.errorLoadingDetails") ||
          "Failed to load appointment details. Please try again."
        );
        setAppointment(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId, t]);

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    if (!appointment || !appointmentId || appointment.status === newStatus) return;
    
    // Check if trying to cancel and appointment is within 2 days
    if (newStatus === AppointmentStatus.Cancelled && !isLawyer) {
      const appointmentDate = new Date(appointment.start_time);
      const twoDaysFromNow = addDays(new Date(), 2);
      
      // Compare the dates - if appointment is less than 2 days away, show error
      // We need to check if appointmentDate is BEFORE twoDaysFromNow
      if (appointmentDate < twoDaysFromNow) {
        // Show toast error message using the translation key
        toastError(t("appointments.cancelRestriction"));
        return;
      }
    }
    
    const confirmationMessage = t("appointments.confirmStatusChange", {newStatus: t(`appointments.status.${newStatus}`)});
    if (!window.confirm(confirmationMessage)) return;

    setUpdatingStatus(true);
    try {
      const payload: AppointmentUpdateRequest = {status: newStatus};
      const response = await updateAppointment(appointmentId, payload);
      setAppointment(prev =>
        prev ? {...prev, status: response.data.status} : null
      );
      setError(null);
    } catch (err: any) {
      console.error("Error updating appointment status:", err);
      const errorMsg =
        err?.response?.data?.message || t("appointments.errorUpdatingStatus");
      setError(errorMsg);
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  const handleOpenCancelModal = () => {
    if (!appointment || !appointmentId) return;
    
    // Check if cancellation is allowed (2 days before appointment)
    if (!isLawyer) {
      const appointmentDate = new Date(appointment.start_time);
      const twoDaysFromNow = addDays(new Date(), 2);
      
      // Compare the dates - if appointment is less than 2 days away, show error
      if (appointmentDate < twoDaysFromNow) {
        toastError(t("appointments.cancelRestriction"));
        return;
      }
    }
    
    setIsCancelModalOpen(true);
  };
  
  const handleCancelAppointment = async (reason: string) => {
    if (!appointment || !appointmentId) return;
    
    setUpdatingStatus(true);
    try {
      const response = await cancelAppointment(appointmentId, reason);
      setAppointment(prev =>
        prev ? {...prev, status: response.data.status, cancel_reason: reason} : null
      );
      setError(null);
    } catch (err: any) {
      console.error("Error cancelling appointment:", err);
      const errorMsg =
        err?.response?.data?.message || t("appointments.errorCancellingAppointment");
      setError(errorMsg);
    } finally {
      setUpdatingStatus(false);
      setIsCancelModalOpen(false);
    }
  };
  
  const handleRejectAppointment = async (reason: string) => {
    if (!appointment || !appointmentId) return;
    
    setRejectingAppointment(true);
    try {
      const response = await rejectAppointment(appointmentId, reason);
      setAppointment(prev =>
        prev ? {...prev, status: response.data.status, reject_reason: reason} : null
      );
      setIsRejectModalOpen(false);
      setError(null);
    } catch (err: any) {
      console.error("Error rejecting appointment:", err);
      const errorMsg =
        err?.response?.data?.message || t("appointments.errorRejectingAppointment");
      setError(errorMsg);
    } finally {
      setRejectingAppointment(false);
    }
  };

  const handleChatToggle = async () => {
    if (!appointment || !appointmentId) return;

    setUpdatingChat(true);
    try {
      const payload: AppointmentUpdateRequest = {chat_enabled: !appointment.chat_enabled};
      const response = await updateAppointment(appointmentId, payload);
      setAppointment(prev =>
        prev ? {...prev, chat_enabled: response.data.chat_enabled} : null
      );

      if (!response.data.chat_enabled) {
        setLoadingChatMessages(true);
        try {
          const chatResponse = await getChatMessages(appointmentId);
          setChatMessages(chatResponse.data || []);
        } catch (chatErr) {
          console.error("Error fetching chat messages:", chatErr);
          setChatMessages([]);
        } finally {
          setLoadingChatMessages(false);
        }
      }
      
      setError(null);
    } catch (err: any) {
      console.error("Error updating appointment chat setting:", err);
      const errorMsg =
        err?.response?.data?.message ||
        t("appointments.errorUpdatingChatSetting") ||
        "Failed to update chat setting. Please try again.";
      setError(errorMsg);
    } finally {
      setUpdatingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner/>
      </div>
    );
  }

  if (error && !appointment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/profile?tab=appointments"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            {t("appointments.backToList")}
          </Link>
        </div>
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <h2 className="text-lg font-medium text-red-800">
            {t("appointments.errorOccurred")}
          </h2>
          <p className="mt-2 text-red-600">{error}</p>
          <Button
            variant="primary"
            onClick={() => router.push("/profile?tab=appointments")}
            className="mt-4"
          >
            {t("appointments.backToList")}
          </Button>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-yellow-50 p-6 text-center">
          <h2 className="text-lg font-medium text-yellow-800">
            {t("appointments.appointmentNotFound")}
          </h2>
          <p className="mt-2 text-yellow-700">
            {t("appointments.appointmentNotFoundMessage")}
          </p>
          <Link href="/profile?tab=appointments">
            <Button
              variant="primary"
              className="mt-4"
            >
              {t("appointments.viewAllAppointments")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const canChangeStatus =
    appointment.status !== "completed" && appointment.status !== "cancelled";
    
  // Client can cancel only if not a lawyer and appointment is pending or confirmed
  const canClientCancel =
    !isLawyer &&
    (appointment.status === "pending" || appointment.status === "confirmed");

  return (
    <div className="container mx-auto px-4 py-8">
      <CancelAppointmentModal 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        onConfirm={handleCancelAppointment} 
      />
      <div className="mb-6">
        <Link
          href="/profile?tab=appointments"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t("appointments.backToList")}
        </Link>
      </div>

      {error && (
        <div
          className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          <span className="font-medium">
            {t("appointments.errorOccurred")}:
          </span>{" "}
          {error}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-xl font-semibold text-gray-900">
                  {t("appointments.appointmentDetails")}
                </h1>
                <StatusBadge status={appointment.status}/>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  {getAppointmentTitle(appointment, isLawyer)}
                </h2>
                <p className="mt-2 text-gray-600">
                  {formatDate(appointment.start_time, "EEEE, MMMM d, yyyy")}
                </p>
                <p className="mt-1 flex items-center text-gray-600">
                  <svg
                    className="mr-2 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {formatAppointmentTime(appointment.start_time, appointment.end_time)}
                </p>
                {appointment.notes && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("appointments.notes")}
                    </h3>
                    <p className="mt-1 whitespace-pre-wrap text-gray-700">
                      {appointment.notes}
                    </p>
                  </div>
                )}
                {appointment.status === AppointmentStatus.Rejected && appointment.reject_reason && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("appointments.rejectionReason")}
                    </h3>
                    <p className="mt-1 whitespace-pre-wrap text-gray-700">
                      {appointment.reject_reason}
                    </p>
                  </div>
                )}
                {appointment.cancel_reason && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("appointments.cancellationReason")}
                    </h3>
                    <p className="mt-1 whitespace-pre-wrap text-gray-700">
                      {appointment.cancel_reason}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-wrap items-center gap-4">
                  {isLawyer && appointment.status === AppointmentStatus.Pending && (
                    <div className="flex space-x-2">
                      <StatusSelector
                        value={appointment.status}
                        availableStatuses={availableStatuses}
                        onChange={handleStatusChange}
                        disabled={updatingStatus}
                      />
                      <Button
                        variant="danger"
                        onClick={() => setIsRejectModalOpen(true)}
                        disabled={updatingStatus}
                        className="inline-flex items-center"
                      >
                        {t("appointments.reject")}
                      </Button>
                    </div>
                  )}

                  {canClientCancel && (
                    <Button
                      variant="danger"
                      onClick={handleOpenCancelModal}
                      disabled={updatingStatus}
                      isLoading={updatingStatus}
                    >
                      {updatingStatus ? t("appointments.cancelling") : t("appointments.cancelAppointment")}
                    </Button>
                  )}

                  {!isLawyer && appointment.status === AppointmentStatus.Completed && (
                    <Button
                      variant="primary"
                      onClick={() => setIsReviewModalOpen(true)}
                      className="ml-3"
                    >
                      {t("appointments.leaveReview")}
                    </Button>
                  )}

                  {isLawyer && appointment.status !== "cancelled" && (
                    <ChatToggle
                      checked={appointment.chat_enabled}
                      onChange={handleChatToggle}
                      disabled={updatingChat}
                      updating={updatingChat}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {user && (
            loadingChatMessages ? (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">{t("appointments.chat.title")}</h3>
                <div className="border rounded-md p-4 h-80 overflow-y-auto bg-gray-50 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              </div>
            ) : (
              // Let ChatSection component handle all display logic internally
              <ChatSection 
                appointment={appointment} 
                currentUser={user} 
                readOnly={!appointment.chat_enabled || appointment.lawyer?.user_active === false || appointment.client?.is_active === false} 
                initialMessages={chatMessages}
              />
            )
          )}
        </div>



        {appointment.lawyer && !isLawyer && (
          <div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {t("appointments.lawyerInformation")}
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <UserAvatarIcon profileImage={appointment.lawyer.profile_image} size={24} />
                  </div>
                  <div className="ml-6 flex-1">
                    <h3 className="text-2xl font-medium mb-1 flex items-center">
                      {appointment.lawyer.full_name}
                      {appointment.lawyer.user_active === false && (
                        <span className="ml-2 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                          {t("lawyers.disabled")}
                        </span>
                      )}
                    </h3>
                    {appointment.lawyer.affiliation && (
                      <p className="text-base text-gray-600 mb-4">
                        {appointment.lawyer.affiliation}
                      </p>
                    )}
                    {appointment.lawyer.profile_text && (
                      <div>
                        <p className={`text-sm text-gray-700 whitespace-pre-wrap ${!isProfileExpanded ? "line-clamp-10" : ""}`}>
                          {appointment.lawyer.profile_text}
                        </p>
                        {appointment.lawyer.profile_text.split('\n').length > 10 && (
                          <Button 
                            variant="ghost" 
                            className="mt-1 text-blue-600 hover:text-blue-800 p-0 h-auto font-medium"
                            onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                          >
                            {isProfileExpanded ? t("common.showLess") : t("common.showMore")}
                          </Button>
                        )}
                      </div>
                    )}
                    <div className="mt-6">
                      <Link
                        href={`/lawyers/${appointment.lawyer.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {t("appointments.viewLawyerProfile")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {appointment.client && isLawyer && (
          <div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {t("appointments.clientInformation")}
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">
                      {getFullName(appointment.client)}
                      {appointment.client.is_active === false && (
                        <span className="ml-2 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                          {t("lawyers.disabled")}
                        </span>
                      )}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {appointment?.lawyer && !isLawyer && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          lawyerId={appointment.lawyer.id}
          lawyerName={appointment.lawyer.full_name}
          appointmentId={appointmentId || 0}
        />
      )}
      
      {/* Reject Modal */}
      {isLawyer && (
        <RejectModal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          onSubmit={handleRejectAppointment}
          isSubmitting={rejectingAppointment}
        />
      )}
    </div>
  );
}
