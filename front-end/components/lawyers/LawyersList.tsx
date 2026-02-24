import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { PublicLawyer } from '@/lib/types/lawyers'
import LawyerCard from './LawyerCard'

interface LawyersListProps {
  lawyers: PublicLawyer[]
  loading: boolean
  error: string | null
  onRetry: () => void
  onSelectLawyer?: (lawyer: PublicLawyer) => void
}

export default function LawyersList({ 
  lawyers, 
  loading, 
  error, 
  onRetry,
  onSelectLawyer
}: LawyersListProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <h2 className="text-lg font-medium text-red-800">{t('appointments.errorOccurred')}</h2>
        <p className="mt-2 text-red-600">{error}</p>
        <Button
          variant="danger"
          onClick={onRetry}
          className="mt-4"
        >
          {t('appointments.tryAgain')}
        </Button>
      </div>
    )
  }

  if (lawyers.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">{t('lawyers.noLawyersFound')}</h3>
        <p className="mt-2 text-gray-500">{t('lawyers.tryDifferentSearch')}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {lawyers.map((lawyer) => (
        <div key={lawyer.id} onClick={onSelectLawyer ? () => onSelectLawyer(lawyer) : undefined} 
             className={onSelectLawyer ? "cursor-pointer" : ""}>
          <LawyerCard lawyer={lawyer} />
        </div>
      ))}
    </div>
  )
} 