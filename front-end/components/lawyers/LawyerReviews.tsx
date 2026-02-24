import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { PublicLawyer, PublicReview } from '@/lib/types/lawyers'
import RatingStars from './RatingStars'

interface LawyerReviewsProps {
  lawyer: PublicLawyer
  reviews: PublicReview[]
}

export default function LawyerReviews({ lawyer, reviews }: LawyerReviewsProps) {
  const { t } = useTranslation()

  return (
    <div>
      {reviews.length === 0 ? (
        <p className="text-gray-500">{t('lawyers.noReviews')}</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
              <div className="mb-2 flex items-center justify-between">
                <div className="font-medium">{review.user_name}</div>
                <div className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</div>
              </div>
              <div className="mb-2 flex items-center">
                <RatingStars rating={review.rating} />
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 