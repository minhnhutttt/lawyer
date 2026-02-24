'use client'

import { PaginationMeta } from '@/lib/types'
import { useTranslation } from 'react-i18next'
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  pagination: PaginationMeta
  onPageChange: (page: number) => void
  pageSizeOptions?: number[]
  onPageSizeChange?: (size: number) => void
}

export default function Pagination({
  currentPage,
  pagination,
  onPageChange,
  pageSizeOptions = [10, 25, 50],
  onPageSizeChange,
}: PaginationProps) {
  const { t } = useTranslation()
  
  if (pagination.total_pages <= 0) {
    return null
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5
    
    if (pagination.total_pages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= pagination.total_pages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Calculate the range of pages to show around current page
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(pagination.total_pages - 1, currentPage + 1)
      
      // Adjust start and end to always show 3 pages in the middle
      if (startPage === 2) {
        endPage = Math.min(4, pagination.total_pages - 1)
      }
      if (endPage === pagination.total_pages - 1) {
        startPage = Math.max(2, pagination.total_pages - 3)
      }
      
      // Always show first page
      pageNumbers.push(1)
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push('ellipsis1')
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }
      
      // Add ellipsis if needed
      if (endPage < pagination.total_pages - 1) {
        pageNumbers.push('ellipsis2')
      }
      
      // Always show last page
      if (pagination.total_pages > 1) {
        pageNumbers.push(pagination.total_pages)
      }
    }
    
    return pageNumbers
  }

  // Calculate showing from/to text
  const getShowingText = () => {
    if (pagination.total_items && pagination.page && pagination.page_size) {
      return (
        <>
          {t('common.pagination.showing')}{' '}
          <span className="font-medium">{(pagination.page - 1) * pagination.page_size + 1}-{Math.min(pagination.page * pagination.page_size, pagination.total_items)}</span>{' '}
          {t('common.pagination.of')}{' '}
          <span className="font-medium">{pagination.total_items}</span>{' '}
          {t('common.pagination.items')}
        </>
      )
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 justify-between py-2">
      <div className="flex flex-wrap justify-between md:justify-start w-full md:w-auto gap-2 items-center">
        {/* Showing text */}
        <div className="text-sm text-gray-700 whitespace-nowrap order-1">
          {getShowingText()}
        </div>
        
        {/* Page size selector */}
        {pagination.page_size && onPageSizeChange && (
          <div className="flex items-center gap-2 ml-0 md:ml-4 whitespace-nowrap order-2 md:order-2">
            <label htmlFor="pageSize" className="text-sm text-gray-700">
              {t('common.pagination.pageSize')}
            </label>
            <select
              id="pageSize"
              value={pagination.page_size}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-primary focus:ring-primary"
              aria-label={t('common.pagination.pageSize')}
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {/* Pagination controls */}
      <div className="flex justify-center md:justify-end w-full md:w-auto order-3">
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          {/* First page button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            aria-label={t('common.pagination.first')}
          >
            <FiChevronsLeft className="h-5 w-5" aria-hidden="true" />
          </Button>

          {/* Previous page button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            aria-label={t('common.pagination.previous')}
          >
            <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
          </Button>
          
          {/* Page numbers */}
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <Button
                key={index}
                variant={page === currentPage ? "primary" : "ghost"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                  page === currentPage
                    ? 'z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                }`}
                aria-current={page === currentPage ? 'page' : undefined}
                aria-label={`${t('common.pagination.page')} ${page}`}
              >
                {page}
              </Button>
            ) : (
              <span
                key={index}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300"
              >
                &hellip;
              </span>
            )
          ))}
          
          {/* Next page button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(Math.min(pagination.total_pages, currentPage + 1))}
            disabled={currentPage === pagination.total_pages}
            className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            aria-label={t('common.pagination.next')}
          >
            <FiChevronRight className="h-5 w-5" aria-hidden="true" />
          </Button>

          {/* Last page button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(pagination.total_pages)}
            disabled={currentPage === pagination.total_pages}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            aria-label={t('common.pagination.last')}
          >
            <FiChevronsRight className="h-5 w-5" aria-hidden="true" />
          </Button>
        </nav>
      </div>
    </div>
  )
}