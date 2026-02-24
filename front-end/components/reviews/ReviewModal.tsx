import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createReview } from '@/lib/services/reviews';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyerId: number;
  lawyerName: string;
  appointmentId: number;
}

const ReviewModal = ({ isOpen, onClose, lawyerId, lawyerName, appointmentId }: ReviewModalProps) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating < 1 || rating > 5) {
      toast.error(t('reviews.invalidRating'));
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await createReview({
        lawyer_id: lawyerId,
        rating,
        comment: comment.trim() || undefined,
        appointment_id: appointmentId
      });
      
      toast.success(t('reviews.reviewSubmitted'));
      onClose();
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      toast.error(error?.response?.data?.message || t('reviews.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-60">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-xl font-semibold text-gray-800">
            {t('reviews.reviewTitle')}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            disabled={isSubmitting}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <div className="py-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="mb-2 block font-medium text-gray-700">
                {t('reviews.ratingLabel')} <span className="text-red-500">*</span>
              </label>
              <p className="mb-2 text-sm text-gray-500">{t('reviews.ratingLawyer', { name: lawyerName })}</p>
              <div className="flex items-center space-x-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-0 h-auto focus:outline-none"
                  >
                    <svg
                      className={`h-8 w-8 ${
                        rating >= star
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </Button>
                ))}
              </div>
              <div className="mt-1 text-sm">
                <span className="font-medium text-gray-700">
                  {rating}/5 - {t(`reviews.rating${rating}`)}
                </span>
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="comment" className="mb-2 block font-medium text-gray-700">
                {t('reviews.commentLabel')}
              </label>
              <textarea
                id="comment"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={4}
                placeholder={t('reviews.commentPlaceholder')}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="secondary"
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {t('common.submit')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
