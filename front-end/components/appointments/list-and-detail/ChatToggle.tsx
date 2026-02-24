"use client";
import React from "react";
import {useTranslation} from "react-i18next";

type ChatToggleProps = {
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
  updating?: boolean;
};

export default function ChatToggle({
  checked,
  onChange,
  disabled,
  updating,
}: ChatToggleProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center">
      <label htmlFor="chat-toggle" className="mr-2 text-sm font-medium text-gray-700">
        {t('appointments.chatEnabled')}
      </label>
      <div className="relative inline-block">
        <label className="inline-flex relative items-center cursor-pointer">
          <input
            id="chat-toggle"
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
          />
          <div
            className={`w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          ></div>
        </label>
        {updating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
}
