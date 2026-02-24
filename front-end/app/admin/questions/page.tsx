'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { 
  FiEye, 
  FiEyeOff,
  FiSearch, 
  FiRefreshCw,
  FiFilter,
  FiExternalLink
} from 'react-icons/fi'
import { getQuestions, updateQuestionHidden } from '@/lib/services/questions'
import { Question, QuestionStatus } from '@/lib/types/questions'
import { formatDate } from '@/lib/utils'
import Pagination from '@/components/common/Pagination'
import { PaginationMeta } from '@/lib/types/api'
import Modal from '@/components/common/Modal'
import {getFullName, User} from '@/lib/types'
import { Button } from '@/components/ui/button'

export default function AdminQuestionsPage() {
  const { t } = useTranslation()
  const [questions, setQuestions] = useState<Question[]>([])
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
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Fetch questions with filters and pagination
  const fetchQuestions = useCallback(async (
    page = 1, 
    status?: string, 
    search?: string,
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
        params.title = search
      }
      

      
      const response = await getQuestions(params)
      if (response.data) {
        setQuestions(response.data)
        
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
    fetchQuestions(
      currentPage, 
      statusFilter, 
      debouncedSearchQuery
    )
  }, [
    currentPage, 
    statusFilter, 
    debouncedSearchQuery, 
    fetchQuestions
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
  
  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isFilterOpen && !(event.target as Element).closest('.filter-dropdown')) {
        setIsFilterOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen])

  // Handle filter change
  const handleFilterChange = (status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  // Handle toggling question visibility
  const handleToggleVisibility = async (id: number, currentlyHidden: boolean) => {
    setIsSubmitting(true)
    try {
      await updateQuestionHidden(id, !currentlyHidden)
      // Update the local state
      setQuestions(questions.map(q => 
        q.id === id ? { ...q, is_hidden: !currentlyHidden } : q
      ))
      toast.success(currentlyHidden ? 
        t('adminQuestions.successUnhide') : 
        t('adminQuestions.successHide')
      )
    } catch (error) {
      console.error('Error updating question visibility:', error)
      toast.error(t('errors.somethingWentWrong'))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle view question details
  const handleViewDetails = (question: Question) => {
    setSelectedQuestion(question)
    setIsModalOpen(true)
  }

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The useEffect with debounced search will trigger the search
  }

  // Handle refresh
  const handleRefresh = () => {
    // Reset all filters
    setSearchQuery('')
    setDebouncedSearchQuery('')
    setStatusFilter('all')
    setCurrentPage(1)
    setIsFilterOpen(false)
    
    // Force re-fetch with default parameters
    fetchQuestions(1, 'all', '')
    
    toast.success(t('adminQuestions.refresh'))
  }



  // Add a handler for page size change
  const handlePageSizeChange = (newSize: number) => {
    setPagination(prev => ({ ...prev, page_size: newSize }))
    setCurrentPage(1)
  }

  // Get status label
  const getStatusLabel = (status: QuestionStatus) => {
    switch (status) {
      case 'open':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{t('adminQuestions.status.open')}</span>
      case 'answered':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">{t('adminQuestions.status.answered')}</span>
      case 'closed':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{t('adminQuestions.status.closed')}</span>
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-500">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
        {t('adminQuestions.title')}
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
            placeholder={t('common.search') || "Search questions..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={t('common.search')}
          />
        </form>

        <div className="flex gap-2">
          <div className="relative">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="inline-flex items-center h-full"
              aria-label={t('adminQuestions.filter')}
            >
              <FiFilter className="mr-2 h-4 w-4" />
              {t('adminQuestions.filter')}
            </Button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white shadow-lg border rounded-md z-10 py-1">
                <ul>
                  <li>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        handleFilterChange('all');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'all' ? 'bg-gray-100 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {t('adminQuestions.filters.all')}
                    </Button>
                  </li>
                  <li>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        handleFilterChange('open');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'open' ? 'bg-gray-100 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {t('adminQuestions.status.open')}
                    </Button>
                  </li>
                  <li>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        handleFilterChange('answered');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'answered' ? 'bg-gray-100 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {t('adminQuestions.status.answered')}
                    </Button>
                  </li>
                  <li>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        handleFilterChange('closed');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'closed' ? 'bg-gray-100 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {t('adminQuestions.status.closed')}
                    </Button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <Button
            type="button"
            variant="secondary"
            onClick={handleRefresh}
            className="inline-flex items-center"
            title={t('adminQuestions.refresh')}
            aria-label={t('adminQuestions.refresh')}
          >
            <FiRefreshCw className="w-5 h-5 mr-2" />
            {t('adminQuestions.refresh')}
          </Button>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"

              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"

              >
                {t('adminQuestions.table.title')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {t('adminQuestions.table.user')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"

              >
                {t('adminQuestions.table.status')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"

              >
                {t('adminQuestions.table.answers')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"

              >
                {t('adminQuestions.table.date')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {t('adminQuestions.table.visibility')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {t('adminQuestions.table.actions') || 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  {t('common.loading')}
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-red-500">
                  {error}
                </td>
              </tr>
            ) : questions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  {t('adminQuestions.noQuestions')}
                </td>
              </tr>
            ) : (
              questions.map((question) => (
                <tr key={question.id} className={question.is_hidden ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {question.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {question.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {question.is_anonymous ? (
                      <span className="italic">{t('common.anonymous')}</span>
                    ) : (
                      getFullName(question.user)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusLabel(question.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {question.answer_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(question.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {question.is_hidden ? (
                      <span className="text-red-600">{t('adminQuestions.hidden')}</span>
                    ) : (
                      <span className="text-green-600">{t('adminQuestions.visible')}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        onClick={() => handleToggleVisibility(question.id, question.is_hidden)}
                        disabled={isSubmitting}
                        className={`p-1 rounded-full ${question.is_hidden ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
                        title={question.is_hidden ? t('adminQuestions.makeVisible') : t('adminQuestions.makeHidden')}
                        aria-label={question.is_hidden ? t('adminQuestions.makeVisible') : t('adminQuestions.makeHidden')}
                      >
                        {question.is_hidden ? <FiEye className="h-5 w-5" /> : <FiEyeOff className="h-5 w-5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleViewDetails(question)}
                        className="p-1 text-primary hover:bg-primary-50 rounded-full"
                        title={t('adminQuestions.viewDetails')}
                        aria-label={t('adminQuestions.viewDetails')}
                      >
                        <FiExternalLink className="h-5 w-5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && questions.length > 0 && (
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

      {/* Question Detail Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedQuestion && (
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('adminQuestions.questionDetails')}
              </h3>
              <div className="flex items-center space-x-2">
                {getStatusLabel(selectedQuestion.status)}
                <span>
                  {selectedQuestion.is_hidden ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      {t('adminQuestions.hidden')}
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {t('adminQuestions.visible')}
                    </span>
                  )}
                </span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-500 mb-2">
                ID: {selectedQuestion.id} • 
                {selectedQuestion.is_anonymous ? (
                  <span className="italic ml-1">{t('common.anonymous')}</span>
                ) : (
                  <span className="ml-1">{getFullName(selectedQuestion.user)}</span>
                )} •
                <span className="ml-1">{formatDate(selectedQuestion.created_at)}</span>
              </div>
              
              <h4 className="font-medium text-lg mb-2">{selectedQuestion.title}</h4>
              
              <div className="bg-gray-50 p-4 rounded-md mb-4 prose">
                {selectedQuestion.content}
              </div>
              
              <div className="flex justify-between mt-4 pt-3 border-t border-gray-200">
                <div>
                  <Button
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    {t('adminQuestions.close')}
                  </Button>
                </div>
                
                <Button
                  variant={selectedQuestion.is_hidden ? "primary" : "danger"}
                  onClick={() => {
                    handleToggleVisibility(selectedQuestion.id, selectedQuestion.is_hidden);
                    setIsModalOpen(false);
                  }}
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  {selectedQuestion.is_hidden 
                    ? t('adminQuestions.makeVisible')
                    : t('adminQuestions.makeHidden')
                  }
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
