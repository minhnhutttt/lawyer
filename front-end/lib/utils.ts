import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format as dateFnsFormat, isToday as dateFnsIsToday, parseISO } from 'date-fns'
import { ja, enUS } from 'date-fns/locale'
import i18n from './i18n'
import {formatInTimeZone, fromZonedTime} from 'date-fns-tz'

/**
 * Combines multiple class names with Tailwind CSS support
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gets the current locale for date-fns based on i18n language
 */
export function getDateLocale() {
  const language = i18n.language || 'ja'
  
  switch (language) {
    case 'ja':
      return ja
    default:
      return enUS
  }
}

/**
 * Formats a date using date-fns with support for i18n
 * @param date Date to format (Date object or ISO string)
 * @param formatStr Format string (see date-fns docs)
 * @param options Additional options
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, formatStr: string = 'PPP', options: any = {}) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return dateFnsFormat(dateObj, formatStr, {
    locale: getDateLocale(),
    ...options
  })
}

/**
 * Formats a date (Date object or ISO string) to 'yyyy-MM-dd'
 * @param date Date or ISO string
 * @returns Formatted date string in 'yyyy-MM-dd'
 */
export function formatToYYYYMMDD(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return dateFnsFormat(dateObj, 'yyyy/MM/dd', {
    locale: getDateLocale(),
  })
}

export function round1Decimal(value: number): number {
  return Math.round((value || 0) * 10) / 10
}


export function japanLocalToUtc(date: Date): Date {
  return fromZonedTime(date, 'Asia/Tokyo');
}

export function formatDateInJapan(date: Date, fmt: string = 'yyyy-MM-dd'): string {
  return formatInTimeZone(date, 'Asia/Tokyo', fmt)
}

/**
 * Format a time slot (e.g., "14:30") to a localized time format
 * @param timeSlot Time in 24-hour format (HH:MM)
 * @returns Formatted time string
 */
export function formatTimeSlot(timeSlot: string) {
  if (!timeSlot) return ''
  
  const [hours, minutes] = timeSlot.split(':')
  const date = new Date()
  date.setHours(parseInt(hours, 10))
  date.setMinutes(parseInt(minutes, 10))
  
  // Use 'p' for short time format (e.g., "2:30 PM" in English, "14:30" in Japanese)
  return formatDate(date, 'p')
}

/**
 * Format a date range for appointments
 * @param startDate Start date
 * @param endDate End date (optional)
 * @returns Formatted date range string
 */
export function formatAppointmentTime(startDate: Date | string, endDate?: Date | string) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  
  if (!endDate) {
    return formatDate(start, 'PPpp')
  }
  
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  
  // If dates are on the same day, only show the date once
  if (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  ) {
    return `${formatDate(start, 'PPP')} · ${formatDate(start, 'p')} - ${formatDate(end, 'p')}`
  }
  
  return `${formatDate(start, 'PPp')} - ${formatDate(end, 'PPp')}`
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateFnsIsToday(dateObj)
}

/**
 * Formats a date to show relative time (e.g., "2 days ago", "in 3 hours")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMilliseconds = date.getTime() - now.getTime()
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInDays > 0) {
    return diffInDays === 1 ? 'tomorrow' : `in ${diffInDays} days`
  } else if (diffInDays < 0 && diffInDays >= -1) {
    return 'yesterday'
  } else if (diffInDays < -1) {
    return `${Math.abs(diffInDays)} days ago`
  } else if (diffInHours > 0) {
    return `in ${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'}`
  } else if (diffInHours < 0) {
    return `${Math.abs(diffInHours)} ${Math.abs(diffInHours) === 1 ? 'hour' : 'hours'} ago`
  } else if (diffInMinutes > 0) {
    return `in ${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'}`
  } else if (diffInMinutes < 0) {
    return `${Math.abs(diffInMinutes)} ${Math.abs(diffInMinutes) === 1 ? 'minute' : 'minutes'} ago`
  } else {
    return 'just now'
  }
}

/**
 * Truncates text to a specified length and adds ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Formats currency with proper symbol and decimals
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Debounce function to limit how often a function can be called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Generates an array of dates between start and end dates
 */
export function generateDatesBetween(
  startDate: Date,
  endDate: Date
): Date[] {
  const dates: Date[] = []
  let currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return dates
}

/**
 * Gets query parameters from a URL string
 */
export function getQueryParams(url: string): Record<string, string> {
  const params = new URLSearchParams(url.split('?')[1])
  const result: Record<string, string> = {}
  
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  
  return result
}

/**
 * Error handler utility to process backend API errors
 * @param error The error object from an API call
 * @returns An object with error info including code, message, and status
 */
export function handleApiError(error: any): {
  code: string;
  message: string;
  status: number;
} {

  let response;
  if (error?.response?.data) {
    response = {
      code: error.response.data.code,
      message: error.response.data.error,
      status: error.response.status
    }
  } else {
    response = {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
      status: error.response.status
    }
  }

  return response;
} 