import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BookingFormState } from '@/lib/types/appointments'

interface AppointmentFormProps {
  formData: BookingFormState
  onDescriptionChange: (description: string) => void
  maxLength?: number
}

export default function AppointmentForm({ 
  formData, 
  onDescriptionChange, 
  maxLength = 1000 
}: AppointmentFormProps) {
  const { t } = useTranslation()
  const [characterCount, setCharacterCount] = useState(formData.description.length)
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    
    if (value.length <= maxLength) {
      onDescriptionChange(value)
      setCharacterCount(value.length)
    }
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-lg font-medium">{t('appointments.details')}</h2>
        <p className="text-gray-500 text-sm">{t('appointments.detailsDescription')}</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="description" className="block font-medium text-gray-700 mb-1">
            {t('appointments.description')}
          </label>
          <p className="text-sm text-gray-500 mb-2">{t('appointments.descriptionHelp')}</p>
          
          <textarea
            id="description"
            name="description"
            rows={6}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4"
            placeholder={t('appointments.descriptionPlaceholder')}
            value={formData.description}
            onChange={handleDescriptionChange}
          />
          
          <div className="mt-1 text-right text-sm text-gray-500">
            {characterCount}/{maxLength} {t('common.characters')}
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-md text-sm text-yellow-800">
          <h4 className="font-medium">{t('appointments.privacyNote')}</h4>
          <p className="mt-1">{t('appointments.privacyDescription')}</p>
        </div>
      </div>
    </div>
  )
} 