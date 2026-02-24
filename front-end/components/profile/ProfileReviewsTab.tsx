import React from "react";
import { PaginationMeta, Review } from "@/lib/types";
import Pagination from "@/components/common/Pagination";

interface ProfileReviewsTabProps {
  reviews: Review[];
  loadingReviews: boolean;
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  t: (key: string, opts?: any) => string;
  averageRating?: number;
}

const ProfileReviewsTab: React.FC<ProfileReviewsTabProps> = ({ 
  reviews, 
  loadingReviews, 
  pagination,
  onPageChange,
  t,
  averageRating
}) => {
  if (loadingReviews) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return <div className="bg-white rounded-lg shadow p-6 text-center">
      <p className="text-gray-500">{t("profile.noReviews")}</p>
    </div>;
  }

  // Generate stars for reviews
  const renderStars = (rating: number) => {
    const starCount = Math.floor(rating);
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-5 w-5 ${star <= starCount ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">
            {Number.isInteger(rating) ? rating : rating?.toFixed(1)}/5
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <h2 className="text-lg font-medium text-gray-900">{t("profile.myReviews")}</h2>
              <p className="text-sm text-gray-500 mt-1">{t("profile.reviewsDescription")}</p>
            </div>
            {averageRating !== undefined && (
              <div className="bg-yellow-50 rounded-lg px-4 py-3 border border-yellow-200">
                <div className="flex items-center gap-2">
                  <div className="text-yellow-500">
                    {renderStars(averageRating)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{averageRating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">{t("profile.averageRating")}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{review.user?.nickname || review.user?.email || t("reviews.anonymousUser")}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>{renderStars(review.rating)}</div>
                </div>
                
                <div className="mt-2">
                  {review.comment ? (
                    <p className="text-gray-700">{review.comment}</p>
                  ) : (
                    <p className="text-gray-500 italic">{t("reviews.noComment")}</p>
                  )}
                </div>

                {review.approved_status && (
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      review.approved_status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {review.approved_status === 'approved' 
                        ? t("reviews.statusApproved") 
                        : t("reviews.statusPending")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {reviews.length > 0 && pagination.total_pages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <Pagination
              currentPage={pagination.page}
              pagination={pagination}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700 flex items-start">
        <svg className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div>
          <p>{t("profile.reviewsNote")}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileReviewsTab;
