import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { FiX, FiCheck, FiStar } from 'react-icons/fi'
import { Review } from '@/lib/types/reviews'
import { formatDate } from '@/lib/utils'
import { updateReviewStatus } from '@/lib/services/reviews'
import Modal from '@/components/common/Modal'
import {getFullName, User} from '@/lib/types'
import { Button } from '@/components/ui/button'

interface ReviewDetailModalProps {
  review: Review | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: () => void
  onReject?: (review: Review) => void
}

export default function ReviewDetailModal({ 
  review, 
  isOpen, 
  onClose,
  onStatusUpdate,
  onReject
}: ReviewDetailModalProps) {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!review) {
    return null
  }

  // Handle approve review
  const handleApprove = async () => {
    setIsSubmitting(true)
    try {
      const response = await updateReviewStatus(review.id, 'approved')
      if (response.data) {
        toast.success(t('adminReviews.approved'))
        onStatusUpdate()
        onClose()
      } else {
        toast.error(t('errors.failedToUpdate'))
      }
    } catch (error) {
      toast.error(t('errors.failedToUpdate'))
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle reject button click
  const handleRejectClick = () => {
    if (onReject && review) {
      onReject(review)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="bg-primary/10 p-2.5 rounded-full mr-3">
              <FiStar className="w-5 h-5 text-primary" />
            </span>
            {t('adminReviews.viewTitle')}
          </h2>
          <Button 
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-14rem)]">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                {t('adminReviews.details.reviewer')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {getFullName(review.user) || t('common.unknown')}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                {t('adminReviews.details.lawyer')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {review.lawyer?.full_name || t('common.unknown')}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                {t('adminReviews.details.rating')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {review.rating}/5
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                {t('adminReviews.details.date')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(review.created_at, 'PPPpp')}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                {t('adminReviews.details.status')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  !review.approved_status || review.approved_status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : review.approved_status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {!review.approved_status || review.approved_status === 'pending'
                    ? t('adminReviews.status.pending')
                    : review.approved_status === 'approved'
                    ? t('adminReviews.status.approved')
                    : t('adminReviews.status.rejected')}
                </span>
                {review.approved_status === 'rejected' && review.hidden_reason && (
                  <p className="mt-2 text-sm text-gray-500">
                    {t('adminReviews.details.rejectionReason')}: {review.hidden_reason}
                  </p>
                )}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                {t('adminReviews.details.comment')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {review.comment || t('adminReviews.details.noComment')}
              </dd>
            </div>
          </dl>
        </div>

        {/* Footer with actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
          >
            {t('common.cancel')}
          </Button>
          
          {(!review.approved_status || review.approved_status === 'pending') && (
            <>
              {onReject && (
                <Button
                  variant="danger"
                  type="button"
                  onClick={handleRejectClick}
                  disabled={isSubmitting}
                  className="flex items-center"
                >
                  <FiX className="mr-2 h-4 w-4" />
                  {t('adminReviews.actions.reject')}
                </Button>
              )}
              <Button
                variant="primary"
                type="button"
                onClick={handleApprove}
                disabled={isSubmitting}
                className="flex items-center bg-green-600 hover:bg-green-700 focus:ring-green-500"
              >
                <FiCheck className="mr-2 h-4 w-4" />
                {t('adminReviews.actions.approve')}
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
} 