"use client";
import React from "react";
import {AppointmentStatus, getBadgeClass} from "@/lib/enums/appointment-status.enum";
import {useTranslation} from "react-i18next";

type StatusBadgeProps = {
  status: AppointmentStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap flex-shrink-0 ${getBadgeClass(status)}`}
    >
      {t(`appointments.status.${status}`)}
    </span>
  );
}
