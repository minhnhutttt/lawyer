import React from "react";
import { Button } from "@/components/ui/button";

type TimeSlot = { start: string; end: string };

interface LawyerAvailabilityFormProps {
  daysOfWeek: string[];
  availabilityData: Record<string, TimeSlot[]>;
  setAvailabilityData: React.Dispatch<React.SetStateAction<Record<string, TimeSlot[]>>>;
  availabilityError: string | null;
  submittingAvailability: boolean;
  handleAvailabilitySubmit: (e: React.FormEvent) => void;
  t: (key: string, opts?: any) => string;
}

const LawyerAvailabilityForm: React.FC<LawyerAvailabilityFormProps> = ({
  daysOfWeek,
  availabilityData,
  setAvailabilityData,
  availabilityError,
  submittingAvailability,
  handleAvailabilitySubmit,
  t,
}) => {
  return (
    <form onSubmit={handleAvailabilitySubmit} className="space-y-6">
      {daysOfWeek.map((day) => (
        <div key={day} className="mb-4">
          <label className="block text-lg font-semibold mb-2">
            { t(`common.datePicker.weekdays.${day}`) }
          </label>
          {availabilityData[day] && availabilityData[day].length > 0 ? (
            availabilityData[day].map((slot, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="time"
                  value={slot.start}
                  onChange={(e) => {
                    const updatedSlot = { ...slot, start: e.target.value };
                    const updatedDay = [...availabilityData[day]];
                    updatedDay[index] = updatedSlot;
                    setAvailabilityData((prev) => ({ ...prev, [day]: updatedDay }));
                  }}
                  className="px-2 py-1 border rounded"
                />
                <span>〜</span>
                <input
                  type="time"
                  value={slot.end}
                  onChange={(e) => {
                    const updatedSlot = { ...slot, end: e.target.value };
                    const updatedDay = [...availabilityData[day]];
                    updatedDay[index] = updatedSlot;
                    setAvailabilityData((prev) => ({ ...prev, [day]: updatedDay }));
                  }}
                  className="px-2 py-1 border rounded"
                />
                <Button
                  variant="danger"
                  size="sm"
                  type="button"
                  onClick={() => {
                    const updatedDay = availabilityData[day].filter((_, i) => i !== index);
                    setAvailabilityData((prev) => ({ ...prev, [day]: updatedDay }));
                  }}
                >
                  {t("profile.remove")}
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 mb-2">{t("profile.noAvailability")}</p>
          )}
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={() => {
              const newSlot = { start: "", end: "" };
              setAvailabilityData((prev) => ({ ...prev, [day]: [...prev[day], newSlot] }));
            }}
          >
            {t("profile.addTimeRange")}
          </Button>
        </div>
      ))}
      {availabilityError && <p className="text-red-500 text-sm">{availabilityError}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={submittingAvailability}>
          {submittingAvailability ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {t("profile.processing")}
            </>
          ) : (
            t("profile.updateAvailability")
          )}
        </Button>
      </div>
    </form>
  );
};

export default LawyerAvailabilityForm;
