"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TimeSlot } from "@/lib/types/appointments";
import { getAvailableTimeSlots } from "@/lib/services/appointments";
import { formatTimeSlot } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TimeSlotsProps {
  date: string;
  lawyerId: number;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export default function TimeSlots({
  date,
  lawyerId,
  selectedTime,
  onTimeSelect,
}: TimeSlotsProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    if (!date || !lawyerId) {
      setTimeSlots([]);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchSlots = async () => {
      try {

        const slots = await getAvailableTimeSlots(lawyerId, date);

        const mappedSlots = slots.data.map((slot: TimeSlot) => ({
          ...slot,
          selected: selectedTime === slot.time,
        }));
        setTimeSlots(mappedSlots);
      } catch (err) {
        console.error("Error fetching time slots:", err);
        setError(t("appointments.failedToLoadSlots"));
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [date, lawyerId, selectedTime, t]);

  const handleTimeSelect = (timeSlot: TimeSlot) => {
    if (!timeSlot.available) return;
    onTimeSelect(timeSlot.time);
  };

  const morningSlots = timeSlots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0], 10);
    return hour < 12;
  });

  const afternoonSlots = timeSlots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0], 10);
    return hour >= 12;
  });

  if (loading) {
    return (
      <div className="flex h-52 items-center justify-center bg-gray-50 rounded-lg">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-700">
        <p>{error}</p>
      </div>
    );
  }

  if (!date) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-gray-500 h-52 flex items-center justify-center">
        <p>{t("appointments.selectDateFirst")}</p>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-gray-500 h-52 flex items-center justify-center">
        <p>{t("appointments.noTimeSlotsAvailable")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium mb-3">{t("appointments.availableTimes")}</h3>

      {morningSlots.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm text-gray-500 mb-2">
            {t("appointments.morning")}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {morningSlots.map((slot, index) => (
              <Button
                key={index}
                variant={slot.selected ? "primary" : slot.available ? "secondary" : "ghost"}
                size="sm"
                onClick={() => handleTimeSelect(slot)}
                disabled={!slot.available}
                className={!slot.available ? "bg-gray-100 text-gray-400" : ""}
              >
                {formatTimeSlot(slot.time)}
              </Button>
            ))}
          </div>
        </div>
      )}

      {afternoonSlots.length > 0 && (
        <div>
          <h4 className="text-sm text-gray-500 mb-2">
            {t("appointments.afternoon")}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {afternoonSlots.map((slot, index) => (
              <Button
                key={index}
                variant={slot.selected ? "primary" : slot.available ? "secondary" : "ghost"}
                size="sm"
                onClick={() => handleTimeSelect(slot)}
                disabled={!slot.available}
                className={!slot.available ? "bg-gray-100 text-gray-400" : ""}
              >
                {formatTimeSlot(slot.time)}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}