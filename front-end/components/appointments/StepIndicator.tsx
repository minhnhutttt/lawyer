import { useTranslation } from 'react-i18next'
import { FaCheck } from 'react-icons/fa'
import { BookingStep } from '@/lib/types/appointments'

interface StepIndicatorProps {
  currentStep: BookingStep
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const { t } = useTranslation()
  
  const steps = [
    { id: BookingStep.FindLawyer, label: t('appointments.steps.findLawyer') },
    { id: BookingStep.SelectDateTime, label: t('appointments.steps.selectDateTime') },
    { id: BookingStep.CompleteBooking, label: t('appointments.steps.completeBooking') }
  ]
  
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center w-1/3">
            <div className="relative">
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep > step.id
                    ? 'bg-blue-600'
                    : currentStep === step.id
                    ? 'bg-blue-600 ring-4 ring-blue-100'
                    : 'bg-gray-200'
                }`}
              >
                {currentStep > step.id ? (
                  <FaCheck color="white" size={16} />
                ) : (
                  <span className={`text-${currentStep === step.id ? 'white' : 'gray-500'}`}>
                    {step.id}
                  </span>
                )}
              </div>
              
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div 
                  className={`absolute top-5 left-10 w-full h-0.5 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
            <span 
              className={`mt-2 text-sm font-medium ${
                currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 