"use client";

import { useTranslation } from "react-i18next";
import { PublicLawyer } from "@/lib/types/lawyers";
import ScheduleSelector from "@/components/appointments/childs/ScheduleSelector";
import { Button } from "@/components/ui/button";

interface SelectDateTimeStepProps {
  lawyer: PublicLawyer | null;
  selectedDate: string | null;
  selectedTime: string | null;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
}

export default function SelectDateTimeStep({
  lawyer,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onNextStep,
  onPreviousStep,
}: SelectDateTimeStepProps) {
  const { t } = useTranslation();

  const canProceed = !!selectedDate && !!selectedTime;

  return (
    <div className="space-y-6">
      <ScheduleSelector
        lawyer={lawyer}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onDateSelect={onDateSelect}
        onTimeSelect={onTimeSelect}
      />

      <div className="flex justify-between pt-4 border-t border-gray-200">
        <Button
          variant="secondary"
          type="button"
          onClick={onPreviousStep}
        >
          {t("common.back")}
        </Button>
        <Button
          variant="primary"
          type="button"
          disabled={!canProceed}
          onClick={onNextStep}
        >
          {t("common.next")}
        </Button>
      </div>
    </div>
  );
}
