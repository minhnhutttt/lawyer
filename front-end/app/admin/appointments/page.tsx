'use client'

import React, {useState, useEffect, useCallback} from 'react'
import {useTranslation} from 'react-i18next'
import {format} from 'date-fns'
import {FiFilter, FiChevronDown, FiEdit, FiEye, FiTrash2, FiCheck, FiX, FiLoader, FiSearch} from 'react-icons/fi'
import {useRouter} from 'next/navigation'
import {Appointment, AppointmentSearchParams, PaginationMeta} from '@/lib/types'
import {User, getFullName} from '@/lib/types/users'
import {getAppointments, updateAppointment, deleteAppointment} from '@/lib/services/appointments'
import {AppointmentStatus, getBadgeClass} from '@/lib/enums/appointment-status.enum'
import {formatAppointmentTime} from '@/lib/utils'
import {getAppointmentTitle} from '@/lib/utils/appointments'
import Modal from '@/components/common/Modal'
import {Button} from '@/components/ui/button'
import DatePickerField from '@/components/common/DatePickerField'
import {useToast} from '@/components/common/Toast'
import Link from 'next/link'
import Pagination from '@/components/common/Pagination'
import Tooltip from "@/components/common/Tooltip";

export default function AdminAppointmentsPage() {
  const {t} = useTranslation()
  const router = useRouter()
  const toast = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  // Filter state
  const [filters, setFilters] = useState<AppointmentSearchParams>({})

  // Search queries with debouncing
  const [clientSearchQuery, setClientSearchQuery] = useState('')
  const [lawyerSearchQuery, setLawyerSearchQuery] = useState('')
  const [debouncedClientSearch, setDebouncedClientSearch] = useState('')
  const [debouncedLawyerSearch, setDebouncedLawyerSearch] = useState('')

  // Appointment to manage
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState<AppointmentStatus | null>(null)
  const [adminReason, setAdminReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    page_size: 10,
    total_items: 0,
    total_pages: 0
  })

  // Load appointments when page, page size, or filters change
  useEffect(() => {
    fetchAppointments(currentPage, pageSize, filters)
  }, [currentPage, pageSize, filters])

  // Debounce client search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedClientSearch !== clientSearchQuery) {
        setDebouncedClientSearch(clientSearchQuery)
        // Update filters with debounced value and reset to page 1
        setFilters(prev => ({
          ...prev,
          client_search: clientSearchQuery || undefined
        }))
        // Reset to page 1 when search changes
        setCurrentPage(1)
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [clientSearchQuery, debouncedClientSearch])

  // Debounce lawyer search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedLawyerSearch !== lawyerSearchQuery) {
        setDebouncedLawyerSearch(lawyerSearchQuery)
        // Update filters with debounced value
        setFilters(prev => ({
          ...prev,
          lawyer_search: lawyerSearchQuery || undefined
        }))
        // Reset to page 1 when search changes
        setCurrentPage(1)
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [lawyerSearchQuery, debouncedLawyerSearch])

  // Fetch appointments from API with pagination and filtering
  const fetchAppointments = useCallback(async (page: number = 1, pageSize: number = 10, filters: AppointmentSearchParams = {}) => {
    try {
      setLoading(true)

      // Combine pagination parameters with filters
      const params = {
        ...filters,
        page,
        limit: pageSize
      }

      const response = await getAppointments(params)

      // Set the appointments and pagination data
      setAppointments(response.data)

      // Update pagination if available from API response
      if (response.pagination) {
        setPagination(response.pagination)
      } else {
        // Fallback if API doesn't return pagination info
        setPagination({
          page: page,
          page_size: pageSize,
          total_items: response.data.length,
          total_pages: Math.ceil(response.data.length / pageSize)
        })
      }
    } catch (err) {
      toast.error(t('errors.networkError'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when page size changes
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({})
    setClientSearchQuery('')
    setLawyerSearchQuery('')
    setCurrentPage(1)
  }

  // Reset modal state when closed
  useEffect(() => {
    if (!showStatusModal) {
      setAdminReason('')
      setNewStatus(null)
    }
  }, [showStatusModal])

  // Handle appointment status change
  const handleStatusChange = async () => {
    if (!selectedAppointment || !newStatus || !adminReason.trim()) return

    try {
      setActionLoading(true)
      await updateAppointment(selectedAppointment.id, {
        status: newStatus,
        admin_reason: adminReason.trim()
      })

      // Refresh the appointments list after update
      toast.success(t('appointments.statusUpdateSuccess'))
      setShowStatusModal(false)
      setSelectedAppointment(null)
      setNewStatus(null)
      setAdminReason('')

      // Refresh appointments data
      fetchAppointments(currentPage, pageSize, filters)
    } catch (err) {
      toast.error(t('errors.updateFailed'))
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  // Handle appointment deletion
  const handleDelete = async () => {
    if (!selectedAppointment) return

    try {
      setActionLoading(true)
      await deleteAppointment(selectedAppointment.id)

      setShowDeleteModal(false)
      setSelectedAppointment(null)
      toast.success(t('adminAppointments.deleteSuccess'))

      // Refresh the appointments list after deletion
      fetchAppointments(currentPage, pageSize, filters)
    } catch (err) {
      toast.error(t('errors.deleteFailed'))
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('adminAppointments.pageTitle')}
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-medium mb-4">{t('adminAppointments.filter')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('adminAppointments.statusFilter')}
            </label>
            <select
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              value={filters.status || ''}
              onChange={(e) => {
                setFilters({...filters, status: e.target.value || undefined})
                setCurrentPage(1) // Reset to page 1 when status filter changes
              }}
            >
              <option value="">{t('adminAppointments.allStatuses')}</option>
              {Object.values(AppointmentStatus).map((status) => (
                <option key={status} value={status}>
                  {t(`appointments.status.${status}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Client Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('adminAppointments.clientFilter')}
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 pl-9 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder={t('adminAppointments.searchClient')}
                value={clientSearchQuery}
                onChange={(e) => setClientSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="w-4 h-4 text-gray-400"/>
              </div>
            </div>
          </div>

          {/* Lawyer Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('adminAppointments.lawyerFilter')}
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 pl-9 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder={t('adminAppointments.searchLawyer')}
                value={lawyerSearchQuery}
                onChange={(e) => setLawyerSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="w-4 h-4 text-gray-400"/>
              </div>
            </div>
          </div>

          {/* Date Range Filters */}
          <div>
            <DatePickerField
              id="start_date"
              name="start_date"
              label={t('adminAppointments.startDate')}
              value={filters.start_date || null}
              onChange={(date) =>
                setFilters(prev => ({
                  ...prev,
                  start_date: date ? format(date, 'yyyy-MM-dd') : undefined
                }))
              }
              placeholder={t('adminAppointments.selectDate')}
            />
          </div>

          <div>
            <DatePickerField
              id="end_date"
              name="end_date"
              label={t('adminAppointments.endDate')}
              value={filters.end_date || null}
              onChange={(date) =>
                setFilters({...filters, end_date: date ? format(date, 'yyyy-MM-dd') : undefined})
              }
              placeholder={t('adminAppointments.selectDate')}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="ghost" onClick={resetFilters}>
            {t('adminAppointments.reset')}
          </Button>
        </div>
      </div>

      {/* Error Alert removed - using Toast instead */}

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <FiLoader className="w-6 h-6 text-primary animate-spin"/>
              <span className="text-gray-600">{t('adminAppointments.loading')}</span>
            </div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">{t('adminAppointments.noAppointments')}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                    {t('adminAppointments.clientColumn')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                    {t('adminAppointments.lawyerColumn')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                    {t('adminAppointments.titleColumn')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                    {t('adminAppointments.datetimeColumn')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                    {t('adminAppointments.statusColumn')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                    {t('adminAppointments.actionsColumn')}
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                            {appointment.client ? getFullName(appointment.client) : t('common.unknown')}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 break-words">
                            {appointment.client?.email || ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm text-gray-900 break-words">
                        {appointment.lawyer?.full_name || t('common.unknown')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs sm:text-sm text-gray-900 break-words">
                        {getAppointmentTitle(appointment)}
                      </div>
                      <Tooltip content={appointment.description}>
                        <div className="text-xs">{appointment.description?.slice(0, 20) + (appointment.description?.length > 20 ? '...' : '')}</div>
                      </Tooltip>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm text-gray-900 break-words">
                        {formatAppointmentTime(
                          appointment.start_time,
                          appointment.end_time
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-block text-xs font-medium rounded-full ${getBadgeClass(appointment.status)}`}>
                        {t(`appointments.status.${appointment.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1 sm:space-x-2 justify-center">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedAppointment(appointment)
                            setShowStatusModal(true)
                          }}
                          className="text-primary hover:text-primary-dark p-0.5 sm:p-1"
                          title={t('adminAppointments.updateStatus')}
                        >
                          <FiEdit className="w-4 h-4 sm:w-5 sm:h-5"/>
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedAppointment(appointment)
                            setShowDeleteModal(true)
                          }}
                          className="text-red-600 hover:text-red-800 p-0.5 sm:p-1"
                          title={t('adminAppointments.delete')}
                        >
                          <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5"/>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && appointments.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  pageSizeOptions={[10, 25, 50, 100]}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('adminAppointments.deleteAppointment')}
          </h3>
          <div className="py-2">
            <p className="text-gray-700">
              {t('adminAppointments.deleteConfirmation')}
            </p>
            <p className="font-medium mt-2">
              {selectedAppointment ? getAppointmentTitle(selectedAppointment) : ''}
            </p>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteModal(false)}
              disabled={actionLoading}
            >
              {t('adminAppointments.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={actionLoading}
            >
              {t('adminAppointments.delete')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
      >
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('adminAppointments.updateStatus')}
          </h3>
          <div className="py-2">
            <p className="text-gray-700 mb-4">
              {t('adminAppointments.currentStatus')}:{' '}
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                selectedAppointment ? getBadgeClass(selectedAppointment.status) : ''
              }`}>
                {selectedAppointment
                  ? t(`appointments.status.${selectedAppointment.status}`)
                  : ''}
              </span>
            </p>

            {selectedAppointment?.admin_reason && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {t('adminAppointments.currentAdminReason')}:
                </p>
                <p className="text-gray-600 bg-gray-50 p-2 rounded border border-gray-200 text-sm">
                  {selectedAppointment.admin_reason}
                </p>
              </div>
            )}

            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('adminAppointments.newStatus')}
            </label>
            <select
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              value={newStatus || ''}
              onChange={(e) => setNewStatus(e.target.value as AppointmentStatus)}
            >
              <option value="">{t('adminAppointments.selectStatus')}</option>
              {Object.values(AppointmentStatus).map((status) => (
                <option key={status} value={status} disabled={selectedAppointment?.status === status}>
                  {t(`appointments.status.${status}`)}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
              {t('adminAppointments.reasonForChange')}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              value={adminReason}
              onChange={(e) => setAdminReason(e.target.value)}
              placeholder={t('adminAppointments.enterReason')}
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setShowStatusModal(false)}
              disabled={actionLoading}
            >
              {t('adminAppointments.cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={handleStatusChange}
              isLoading={actionLoading}
              disabled={!newStatus || !adminReason.trim()}
            >
              {t('adminAppointments.update')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
