import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  getMonth,
  getYear,
  addDays
} from 'date-fns'
import { formatDateInJapan } from "@/lib/utils";
import { Button } from '@/components/ui/button';

interface CalendarProps {
  selectedDate: string
  onSelectDate: (date: string) => void
}

export default function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const { t } = useTranslation()
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  // Calendar nav
  const previousMonth = () =>
    setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))
  const nextMonth = () =>
    setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))

  // build grid days
  const generateCalendarDays = (month: Date) => {
    const monthStart = startOfMonth(month)
    const monthEnd   = endOfMonth(monthStart)
    const startDate  = startOfWeek(monthStart)
    const endDate    = endOfWeek(monthEnd)
    return eachDayOfInterval({ start: startDate, end: endDate })
  }

  const jstTodayStr = formatDateInJapan(new Date())

  const isSelectable = (date: Date) => {
    const cellDateStr = format(date, 'yyyy-MM-dd')
    return cellDateStr >= jstTodayStr
  }

  const dayLabels = [
    t('appointments.calendar.days.sun'),
    t('appointments.calendar.days.mon'),
    t('appointments.calendar.days.tue'),
    t('appointments.calendar.days.wed'),
    t('appointments.calendar.days.thu'),
    t('appointments.calendar.days.fri'),
    t('appointments.calendar.days.sat')
  ]

  const monthKeys = [
    'january','february','march','april','may','june',
    'july','august','september','october','november','december'
  ]

  return (
    <div className="calendar">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={previousMonth}
          aria-label={t('appointments.calendar.previousMonth')}
          className="p-2 rounded-full hover:bg-gray-100 h-8 w-8"
        >
          ←
        </Button>
        <h2 className="text-lg font-semibold">
          {t(`appointments.calendar.months.${monthKeys[getMonth(currentMonth)]}`)} {getYear(currentMonth)}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={nextMonth}
          aria-label={t('appointments.calendar.nextMonth')}
          className="p-2 rounded-full hover:bg-gray-100 h-8 w-8"
        >
          →
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayLabels.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
      {generateCalendarDays(currentMonth).map((day, i) => {
          const dateStr       = format(day, 'yyyy-MM-dd')
          const isSelected    = selectedDate === dateStr
          const isCurrMonth   = isSameMonth(day, currentMonth)
          const canSelect     = isSelectable(day)
          const isJstToday    = dateStr === jstTodayStr

          return (
            <Button
              key={i}
              variant={isSelected ? "primary" : "ghost"}
              type="button"
              disabled={!canSelect}
              onClick={() => canSelect && onSelectDate(dateStr)}
              className={`
                p-2 rounded-md text-center
                ${!isCurrMonth ? 'text-gray-300' : ''}
                ${isJstToday ? 'border border-gray-300' : ''}
                ${isSelected ? 'bg-indigo-100 text-indigo-800 font-semibold' : ''}
                ${canSelect && isCurrMonth && !isSelected ? 'hover:bg-gray-100' : ''}
                ${!canSelect && isCurrMonth ? 'text-gray-400 cursor-not-allowed' : ''}
              `}
            >
              <time dateTime={dateStr}>{format(day, 'd')}</time>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
