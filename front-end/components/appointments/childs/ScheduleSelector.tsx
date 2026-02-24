import { useTranslation } from 'react-i18next'
import Calendar from './Calendar'
import TimeSlots from './TimeSlots'
import LawyerPreview from './LawyerPreview'
import { PublicLawyer } from '@/lib/types/lawyers'
import { formatDate, formatTimeSlot } from '@/lib/utils'

interface ScheduleSelectorProps {
  lawyer: PublicLawyer | null
  selectedDate: string | null
  selectedTime: string | null
  onDateSelect: (date: string) => void
  onTimeSelect: (time: string) => void
}

export default function ScheduleSelector({
  lawyer,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect
}: ScheduleSelectorProps) {
  const { t } = useTranslation()
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      {lawyer && (
        <div className="p-4 border-b border-gray-200">
          <LawyerPreview lawyer={lawyer} compact={true} />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div>
          <h3 className="mb-3 font-medium">{t('appointments.selectDate')}</h3>
          <Calendar 
            selectedDate={selectedDate || ''} 
            onSelectDate={onDateSelect} 
          />
        </div>
        
        <div>
          <TimeSlots 
            date={selectedDate || ''} 
            lawyerId={lawyer?.id || 0}
            selectedTime={selectedTime}
            onTimeSelect={onTimeSelect}
          />
        </div>
      </div>
      
      {selectedDate && selectedTime && (
        <div className="bg-blue-50 p-4 border-t border-blue-100 rounded-b-lg">
          <h3 className="font-medium text-blue-900">{t('appointments.selectedDateTime')}</h3>
          <p className="text-blue-800">
            {formatDate(selectedDate, 'PPPP')} {t('appointments.atTime')} {formatTimeSlot(selectedTime)}
          </p>
        </div>
      )}
    </div>
  )
} 