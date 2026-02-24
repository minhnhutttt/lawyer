'use client'

import {useState, useEffect, useCallback} from 'react'
import {useTranslation} from 'react-i18next'
import {toast} from 'react-hot-toast'
import {
  FiCheck,
  FiX,
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiFilter,
  FiTrash2,
  FiStar
} from 'react-icons/fi'
import {getAllReviews, updateReviewStatus, deleteReview, pinReview} from '@/lib/services/reviews'
import {Review} from '@/lib/types/reviews'
import {formatDate} from '@/lib/utils'
import Pagination from '@/components/common/Pagination'
import {PaginationMeta} from '@/lib/types/api'
import ReviewDetailModal from '@/components/admin/ReviewDetailModal'
import Modal from '@/components/common/Modal'
import {getFullName, User} from '@/lib/types'
import { Button } from "@/components/ui/button"

export default function AdminReviewsPage() {
  const {t} = useTranslation()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    page_size: 10,
    total_items: 0,
    total_pages: 0
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortField, setSortField] = useState<string>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [reviewToReject, setReviewToReject] = useState<Review | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null)

  // Fetch reviews with filters and pagination
  const fetchReviews = useCallback(async (
    page = 1,
    status?: string,
    search?: string,
    sort?: string,
    order?: 'asc' | 'desc',
    size?: number
  ) => {
    setLoading(true)
    setError(null)
    try {
      const params: any = {
        page,
        limit: size || pagination.page_size,
      }

      if (status && status !== 'all') {
        params.status = status
      }

      if (search) {
        params.search = search
      }

      if (sort) {
        params.sort = sort
        params.order = order || 'desc'
      }

      const response = await getAllReviews(params)
      if (response.data) {
        setReviews(response.data)

        if (response.pagination) {
          setPagination(response.pagination)
        }
      } else {
        setError(t('errors.failedToLoad'))
        toast.error(t('errors.failedToLoad'))
      }
    } catch (error) {
      setError(t('errors.failedToLoad'))
      toast.error(t('errors.failedToLoad'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [pagination.page_size, t])

  // Initial fetch and when dependencies change
  useEffect(() => {
    fetchReviews(
      currentPage,
      statusFilter,
      debouncedSearchQuery,
      sortField,
      sortDirection
    )
  }, [
    currentPage,
    statusFilter,
    debouncedSearchQuery,
    sortField,
    sortDirection,
    fetchReviews
  ])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only reset page if search query actually changed
      if (debouncedSearchQuery !== searchQuery) {
        setDebouncedSearchQuery(searchQuery)
        // Reset to first page when search changes
        setCurrentPage(1)
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [searchQuery, debouncedSearchQuery])

  // Handle filter change
  const handleFilterChange = (status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  // Handle approve review
  const handleApprove = async (id: number) => {
    try {
      setIsSubmitting(true)
      const response = await updateReviewStatus(id, 'approved')
      if (response.data) {
        toast.success(t('adminReviews.approved'))
        // Refresh the list
        fetchReviews(
          currentPage,
          statusFilter,
          debouncedSearchQuery,
          sortField,
          sortDirection
        )
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

  // Open rejection modal
  const openRejectModal = (review: Review) => {
    setReviewToReject(review)
    setRejectionReason('')
    setShowRejectModal(true)
  }

  // Handle reject review with reason from modal
  const handleReject = async () => {
    if (!reviewToReject) return

    setIsSubmitting(true)
    try {
      const response = await updateReviewStatus(reviewToReject.id, 'rejected', rejectionReason || undefined)
      if (response.data) {
        toast.success(t('adminReviews.rejected'))
        // Refresh the list
        fetchReviews(
          currentPage,
          statusFilter,
          debouncedSearchQuery,
          sortField,
          sortDirection
        )
      } else {
        toast.error(t('errors.failedToUpdate'))
      }
    } catch (error) {
      toast.error(t('errors.failedToUpdate'))
      console.error(error)
    } finally {
      setIsSubmitting(false)
      setShowRejectModal(false)
      setReviewToReject(null)
    }
  }

  // Handle view review details
  const handleViewDetails = (review: Review) => {
    setSelectedReview(review)
    setIsModalOpen(true)
  }

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already triggered by the effect watching debouncedSearchQuery
  }

  // Handle refresh
  const handleRefresh = () => {
    // Clear search
    setSearchQuery('')
    setDebouncedSearchQuery('')

    // Reset to default filter
    setStatusFilter('all')

    // Reset sorting to default
    setSortField('created_at')
    setSortDirection('desc')

    // Reset to first page
    setCurrentPage(1)

    // Fetch with default parameters
    fetchReviews(1, 'all', '', 'created_at', 'desc')
  }

  // Handle sort
  const handleSort = (field: string) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Default to descending order for a new field
      setSortField(field)
      setSortDirection('desc')
    }
    // Reset to first page when sorting changes
    setCurrentPage(1)
  }

  // Helper to render sort indicators
  const renderSortIndicator = (field: string) => {
    if (field !== sortField) return null

    return sortDirection === 'asc'
      ? <span className="ml-1">▲</span>
      : <span className="ml-1">▼</span>
  }

  // Add a handler for page size change
  const handlePageSizeChange = (newSize: number) => {
    setPagination({...pagination, page_size: newSize})
    setCurrentPage(1) // Reset to first page when changing page size
  }

  // Handle status updates from modal
  const handleStatusUpdate = () => {
    fetchReviews(
      currentPage,
      statusFilter,
      debouncedSearchQuery,
      sortField,
      sortDirection
    )
  }

  // Handle pin/unpin review
  const handlePinReview = async (review: Review) => {
    try {
      setIsSubmitting(true)
      const response = await pinReview(review.id, !review.is_pin)

      if (response.data) {
        toast.success(review.is_pin ?
          (t('adminReviews.reviewUnpinned') || 'Review unpinned successfully') :
          (t('adminReviews.reviewPinned') || 'Review pinned successfully')
        )

        // Refresh the reviews list
        fetchReviews(
          currentPage,
          statusFilter,
          debouncedSearchQuery,
          sortField,
          sortDirection
        )
      }
    } catch (error) {
      console.error('Error updating review pin status:', error)
      toast.error(t('adminReviews.pinUpdateError') || 'Error updating review pin status')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Open delete confirmation modal
  const openDeleteModal = (review: Review) => {
    setReviewToDelete(review)
    setShowDeleteModal(true)
  }

  // Handle delete review
  const handleDelete = async () => {
    if (!reviewToDelete) return

    setIsSubmitting(true)
    try {
      const response = await deleteReview(reviewToDelete.id)

      if (response.data) {
        toast.success(t('adminReviews.reviewDeleted') || 'Review deleted successfully')

        // Refresh the reviews list
        fetchReviews(
          currentPage,
          statusFilter,
          debouncedSearchQuery,
          sortField,
          sortDirection
        )
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error(t('adminReviews.errorDeleting') || 'Error deleting review')
    } finally {
      setIsSubmitting(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t('adminReviews.title')}
      </h1>

      {/* Search and actions bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <form onSubmit={handleSearch} className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="w-5 h-5 text-gray-500"/>
          </div>
          <input
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
            placeholder={t('adminReviews.searchPlaceholder') || "Search reviews..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={t('adminReviews.searchPlaceholder') || "Search reviews"}
          />
        </form>

        <div className="flex gap-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 pl-10 pr-8 appearance-none"
              aria-label={t('adminReviews.filterByStatus') || "Filter by status"}
            >
              <option value="all">{t('adminReviews.filters.all')}</option>
              <option value="pending">{t('adminReviews.filters.pending')}</option>
              <option value="approved">{t('adminReviews.filters.approved')}</option>
              <option value="rejected">{t('adminReviews.filters.rejected')}</option>
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiFilter className="w-5 h-5 text-gray-500"/>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={handleRefresh}
            className="inline-flex items-center"
            title={t('adminReviews.refresh') || "Refresh"}
            aria-label={t('adminReviews.refresh') || "Refresh"}
          >
            <FiRefreshCw className="w-5 h-5 mr-2"/>
            {t('adminReviews.refresh') || "Refresh"}
          </Button>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {error && (
          <div className="bg-red-50 text-red-500 p-4 text-sm border-b border-red-100">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('users.name')}
              >
                {t('adminReviews.table.reviewer')}
                {renderSortIndicator('users.name')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('lawyers.full_name')}
              >
                {t('adminReviews.table.lawyer')}
                {renderSortIndicator('lawyers.full_name')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('rating')}
              >
                {t('adminReviews.table.rating')}
                {renderSortIndicator('rating')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('created_at')}
              >
                {t('adminReviews.table.date')}
                {renderSortIndicator('created_at')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('approved_status')}
              >
                {t('adminReviews.table.status')}
                {renderSortIndicator('approved_status')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {t('adminReviews.table.actions')}
              </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <FiRefreshCw className="w-5 h-5 mr-2 animate-spin"/>
                    {t('common.loading') || "Loading..."}
                  </div>
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  {t('adminReviews.noReviews')}
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getFullName(review.user) || t('common.unknown')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {review.lawyer?.full_name || t('common.unknown')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {review.rating}/5
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                      {review.is_pin && (
                        <span
                          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {t('adminReviews.pinned') || 'Pinned'}
                            </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => handleViewDetails(review)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4 p-1"
                      title={t('adminReviews.actions.view')}
                      aria-label={t('adminReviews.actions.view')}
                    >
                      <FiEye className="h-5 w-5"/>
                    </Button>

                    {(!review.approved_status || review.approved_status === 'pending') && (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => openRejectModal(review)}
                          className="text-red-600 hover:text-red-900 mr-4 p-1"
                          title={t('adminReviews.actions.reject')}
                          aria-label={t('adminReviews.actions.reject')}
                        >
                          <FiX className="h-5 w-5"/>
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleApprove(review.id)}
                          className="p-1 text-green-600 hover:text-green-900"
                          title={t('adminReviews.actions.approve')}
                          aria-label={t('adminReviews.actions.approve')}
                        >
                          <FiCheck className="h-5 w-5"/>
                        </Button>
                      </>
                    )}

                    {(review.approved_status === 'approved') && (
                      <Button
                        variant="ghost"
                        onClick={() => handlePinReview(review)}
                        className={`p-1 ${review.is_pin ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
                        title={review.is_pin ? t('adminReviews.actions.unpin') : t('adminReviews.actions.pin')}
                        aria-label={review.is_pin ? t('adminReviews.actions.unpin') : t('adminReviews.actions.pin')}
                      >
                        <FiStar className="h-5 w-5"/>
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      onClick={() => openDeleteModal(review)}
                      className="p-1 text-red-600 hover:text-red-900"
                      title={t('adminReviews.actions.delete')}
                      aria-label={t('adminReviews.actions.delete')}
                    >
                      <FiTrash2 className="h-5 w-5"/>
                    </Button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && reviews.length > 0 && (
          <div className="py-3 px-6 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              pagination={pagination}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>

      {/* Review Detail Modal */}
      <ReviewDetailModal
        review={selectedReview}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
        onReject={openRejectModal}
      />

      {/* Rejection Reason Modal */}
      <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)}>
        <div>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {t('adminReviews.rejectReasonTitle') || 'Rejection Reason'}
            </h3>
          </div>
          <div className="p-6">
            {reviewToReject && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  {t('adminReviews.rejectingReviewFor') || 'Rejecting review for'}:
                  <span className="font-bold ml-1">{reviewToReject.lawyer?.full_name}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {t('adminReviews.byUser') || 'By'}: {getFullName(reviewToReject.user)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {t('adminReviews.rating') || 'Rating'}: {reviewToReject.rating}/5
                </p>
              </div>
            )}
            <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700 mb-2">
              {t('adminReviews.rejectReasonPrompt') || 'Please provide a reason for rejection:'}
            </label>
            <textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              rows={4}
              placeholder={t('adminReviews.rejectReasonPlaceholder') || 'Enter reason here...'}
            />
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowRejectModal(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleReject}
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {isSubmitting ? t('common.submitting') || 'Submitting...' : t('common.submit')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {t('adminReviews.deleteConfirmTitle') || 'Confirm Deletion'}
            </h3>
          </div>
          <div className="p-6">
            {reviewToDelete && (
              <div className="mb-4 p-4 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  {t('adminReviews.deleteConfirmMessage') || 'Are you sure you want to delete this review? This action cannot be undone.'}
                </p>
                <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                  <p className="text-sm font-medium">
                    <span className="text-gray-700">{t('adminReviews.lawyer') || 'Lawyer'}:</span>
                    <span className="font-bold ml-1">{reviewToDelete.lawyer?.full_name}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span>{t('adminReviews.byUser') || 'By'}:</span> {getFullName(reviewToDelete.user)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span>{t('adminReviews.rating') || 'Rating'}:</span> {reviewToDelete.rating}/5
                  </p>
                  {reviewToDelete.comment && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span>{t('adminReviews.comment') || 'Comment'}:</span> "{reviewToDelete.comment}"
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {isSubmitting ?
                t('common.deleting') || 'Deleting...' :
                t('adminReviews.confirmDelete') || 'Delete Review'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}