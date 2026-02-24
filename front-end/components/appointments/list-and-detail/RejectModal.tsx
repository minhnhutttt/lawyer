"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

type RejectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isSubmitting: boolean;
};

export default function RejectModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: RejectModalProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError(t("appointments.rejectReasonRequired"));
      return;
    }
    
    onSubmit(reason);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {t("appointments.rejectAppointment")}
                  </h3>
                  <div className="mt-4">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                      {t("appointments.rejectReason")}
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="reason"
                        name="reason"
                        rows={4}
                        className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                        value={reason}
                        onChange={(e) => {
                          setReason(e.target.value);
                          if (e.target.value.trim()) setError("");
                        }}
                        disabled={isSubmitting}
                      />
                      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <Button
                variant="danger"
                type="submit"
                className="sm:ml-3 sm:w-auto w-full"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {t("appointments.reject")}
              </Button>
              <Button
                variant="secondary"
                type="button"
                className="mt-3 sm:mt-0 sm:ml-3 sm:w-auto w-full"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {t("common.cancel")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
