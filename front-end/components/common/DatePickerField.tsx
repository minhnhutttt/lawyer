'use client'

import { useState, useEffect, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'
import '@/styles/datepicker.css'
import { FiCalendar, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { ja } from 'date-fns/locale/ja'
import { enUS } from 'date-fns/locale/en-US'
import { Button } from '@/components/ui/button'

interface DatePickerFieldProps {
  id: string
  name: string
  label?: string
  value: string | null
  onChange: (date: Date | null) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  yearDropdownItemNumber?: number
  minDate?: Date
  maxDate?: Date
}

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  isOpen?: boolean;
  onClear?: (e: React.MouseEvent) => void;
  hasValue?: boolean;
}

// Custom input component to avoid DOM nesting validation errors
const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick, placeholder, className, disabled, isOpen, onClear, hasValue }, ref) => (
    <div className="relative w-full">
      <input
        ref={ref}
        type="text"
        className={className}
        value={value || ''}
        placeholder={placeholder}
        onClick={onClick}
        readOnly
        disabled={disabled}
      />
      <div className="absolute right-0 top-0 h-full flex items-center pr-3">
        {hasValue ? (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onClear}
            className="text-gray-400 hover:text-gray-600 p-1 h-auto"
            aria-label="Clear date"
          >
            <FiX className="w-4 h-4" />
          </Button>
        ) : (
          <FiCalendar className="w-4 h-4 text-gray-500" />
        )}
      </div>
    </div>
  )
);

CustomInput.displayName = 'CustomInput';

// Custom header component with interactive month and year pickers
const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  changeYear,
  changeMonth
}: {
  date: Date;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
}) => {
  const { t, i18n } = useTranslation();
  const years = Array.from({ length: 100 }, (_, i) => date.getFullYear() - 50 + i);
  
  // Get localized month names based on current language
  const getMonthNames = () => {
    if (i18n.language === 'ja') {
      return [
        '1月', '2月', '3月', '4月', '5月', '6月',
        '7月', '8月', '9月', '10月', '11月', '12月'
      ];
    }
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  };
  
  const months = getMonthNames();
  
  return (
    <div className="react-datepicker__custom-header">
      <div className="flex items-center justify-between px-4 py-2 mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          className="react-datepicker__navigation react-datepicker__navigation--previous p-1 h-auto"
          aria-label="Previous Month"
          type="button"
        >
          <FiChevronLeft className="w-4 h-4 text-gray-600" />
        </Button>
        <div className="flex gap-2">
          {/* Month selector */}
          <select 
            className="bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            value={date.getMonth()}
            onChange={e => {
              changeMonth(parseInt(e.target.value, 10));
            }}
          >
            {months.map((month, i) => (
              <option key={month} value={i}>
                {month}
              </option>
            ))}
          </select>

          {/* Year selector */}
          <select
            className="bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            value={date.getFullYear()}
            onChange={e => {
              changeYear(parseInt(e.target.value, 10));
            }}
          >
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          className="react-datepicker__navigation react-datepicker__navigation--next p-1 h-auto"
          aria-label="Next Month"
          type="button"
        >
          <FiChevronRight className="w-4 h-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};

export default function DatePickerField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  yearDropdownItemNumber = 100,
  minDate,
  maxDate
}: DatePickerFieldProps) {
  const { t, i18n } = useTranslation()
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null)
  const [isOpen, setIsOpen] = useState(false)
  
  // Format date based on locale
  const formatDate = (date: Date | null): string => {
    if (!date) return ''
    
    try {
      let formattedDate = '';
      if (i18n.language === 'ja') {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        formattedDate = `${year}/${month}/${day}`;
      } else {
        const options: Intl.DateTimeFormatOptions = { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        };
        formattedDate = new Intl.DateTimeFormat(i18n.language || 'en', options).format(date);
      }
      return formattedDate;
    } catch (error) {
      return date.toLocaleDateString();
    }
  }

  // Choose locale based on the current language
  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    onChange(date);
    setIsOpen(false);
  };

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDateChange(null);
  };

  // Helper function to get the correct locale object
  const getLocale = () => {
    switch (i18n.language) {
      case 'ja':
        return ja;
      default:
        return enUS;
    }
  };

  // Using the previously defined formatDate function

  // Handle clicks outside calendar to close it
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (isOpen && !target.closest('.calendar-container') && !target.closest('.datepicker-wrapper')) {
      setIsOpen(false);
    }
  };

  // Add click outside listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 flex items-center">
          <FiCalendar className="w-4 h-4 mr-1.5 text-gray-500" />
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative mt-1 datepicker-wrapper">
        {/* Custom input field that triggers the calendar */}
        <CustomInput
          ref={null}
          value={formatDate(selectedDate)}
          onClick={() => setIsOpen(!isOpen)}
          placeholder={placeholder || t('common.selectDate') || 'Select date'}
          className={`block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-primary focus:border-primary transition-all sm:text-sm ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          } ${className} ${isOpen ? 'border-primary ring-2 ring-primary/20' : ''}`}
          disabled={disabled}
          isOpen={isOpen}
          onClear={handleClearDate}
          hasValue={!!selectedDate}
        />
        
        {/* Calendar dropdown that appears when open */}
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 mt-1 z-[9999] shadow-xl rounded-lg bg-white border border-gray-200 calendar-container">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              inline
              dateFormat={i18n.language === 'ja' ? 'yyyy/MM/dd' : 'yyyy-MM-dd'}
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              scrollableYearDropdown
              yearDropdownItemNumber={yearDropdownItemNumber}
              openToDate={selectedDate || undefined}
              calendarClassName="shadow-lg border-0 rounded-lg calendar-theme"
              minDate={minDate}
              maxDate={maxDate}
              locale={getLocale()}
              renderCustomHeader={({ 
                date, 
                decreaseMonth, 
                increaseMonth, 
                prevMonthButtonDisabled, 
                nextMonthButtonDisabled,
                changeYear,
                changeMonth
              }) => (
                <CustomHeader
                  date={date}
                  decreaseMonth={decreaseMonth}
                  increaseMonth={increaseMonth}
                  prevMonthButtonDisabled={prevMonthButtonDisabled}
                  nextMonthButtonDisabled={nextMonthButtonDisabled}
                  changeYear={changeYear}
                  changeMonth={changeMonth}
                />
              )}
              dayClassName={(date: Date) => {
                if (date.getDay() === 0) return 'react-datepicker__day--sunday';
                if (date.getDay() === 6) return 'react-datepicker__day--saturday';
                return '';
              }}
              todayButton={t('common.datePicker.today')}
            />
          </div>
        )}
      </div>
    </div>
  )
}