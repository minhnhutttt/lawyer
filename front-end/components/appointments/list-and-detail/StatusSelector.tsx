"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import {AppointmentStatus} from "@/lib/enums/appointment-status.enum";

type StatusSelectorProps = {
  value: AppointmentStatus;
  availableStatuses: AppointmentStatus[];
  onChange: (newStatus: AppointmentStatus) => void;
  disabled: boolean;
};

export default function StatusSelector({
  value,
  availableStatuses,
  onChange,
  disabled,
}: StatusSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as AppointmentStatus)}
        disabled={disabled}
        className={`rounded-md border border-gray-300 bg-white pl-3 pr-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-label={t("appointments.changeStatusAriaLabel")}
      >
        {availableStatuses.map((status) => (
          <option key={status} value={status}>
            {t(`appointments.status.${status}`)}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 top-6 flex items-center px-2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
    </div>
  );
}
