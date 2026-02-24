import { useTranslation } from 'react-i18next'
import { BookingFormState } from '@/lib/types/appointments'
import LawyerPreview from './LawyerPreview'
import { FaCalendar, FaClock, FaFileAlt, FaInfoCircle } from 'react-icons/fa'
import { formatDate, formatTimeSlot } from '@/lib/utils'

interface AppointmentSummaryProps {
  formData: BookingFormState
}

export default function AppointmentSummary({ formData }: AppointmentSummaryProps) {
  const { t } = useTranslation()
  
  if (!formData.lawyer || !formData.date || !formData.time) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <div className="flex items-start">
          <div className="mr-3 text-yellow-600">
            <FaInfoCircle />
          </div>
          <div>
            <h3 className="font-medium text-yellow-800">{t('appointments.incompleteDetails')}</h3>
            <p className="text-sm text-yellow-700">{t('appointments.pleaseCompleteAllSteps')}</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-lg font-medium">{t('appointments.appointmentSummary')}</h2>
        <p className="text-gray-500 text-sm">{t('appointments.reviewBeforeBooking')}</p>
      </div>
      
      <div className="space-y-6">
        {/* Lawyer */}
        <div>
          <h3 className="font-medium mb-2">{t('appointments.lawyer')}</h3>
          <LawyerPreview lawyer={formData.lawyer} />
        </div>
        
        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center mb-2">
              <span className="text-blue-600 mr-2"><FaCalendar /></span>
              <h4 className="font-medium">{t('appointments.date')}</h4>
            </div>
            <p>{formatDate(formData.date, 'PPP')}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center mb-2">
              <span className="text-blue-600 mr-2"><FaClock /></span>
              <h4 className="font-medium">{t('appointments.time')}</h4>
            </div>
            <p>{formatTimeSlot(formData.time)}</p>
          </div>
        </div>
        
        {/* Description */}
        {formData.description && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-start mb-2">
              <span className="text-blue-600 mr-2 mt-1"><FaFileAlt /></span>
              <h4 className="font-medium">{t('appointments.description')}</h4>
            </div>
            <p className="text-gray-700 whitespace-pre-line">{formData.description}</p>
          </div>
        )}
        
        {/* What to expect */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="font-medium mb-2">{t('appointments.whatToExpect')}</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <div className="mr-2 text-blue-600">•</div>
              <p>{t('appointments.expectations.preparation')}</p>
            </li>
            <li className="flex items-start">
              <div className="mr-2 text-blue-600">•</div>
              <p>{t('appointments.expectations.documents')}</p>
            </li>
            <li className="flex items-start">
              <div className="mr-2 text-blue-600">•</div>
              <p>{t('appointments.expectations.communication')}</p>
            </li>
            <li className="flex items-start">
              <div className="mr-2 text-blue-600">•</div>
              <p>{t('appointments.expectations.reschedule')}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
} 