'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FiEdit,
  FiTrash2,
  FiUserCheck,
  FiUserX,
  FiUserPlus,
  FiSearch,
  FiRefreshCw
} from 'react-icons/fi'
import { getUsers, deleteUser, updateUserStatus } from '@/lib/services/users'
import { User, getFullName, getUserInitials } from '@/lib/types/users'
import UserEditModal from '@/components/admin/UserEditModal'
import Pagination from '@/components/common/Pagination'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/components/common/Toast'
import { useAuthStore } from '@/store/auth-store'
import { PaginationMeta } from '@/lib/types'
import { Button } from '@/components/ui/button'

export default function AdminUsersPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const { user: currentUser } = useAuthStore()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, page_size: 10, total_items: 0, total_pages: 0 })
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [sortField, setSortField] = useState('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const fetchUsers = useCallback(async (page: number, search?: string, sort?: string, order?: 'asc' | 'desc', size?: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await getUsers(page, size || pagination.page_size, search, sort, order)
      setUsers(response.data)
      
      if (response.pagination) {
        setPagination(response.pagination)
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('errors.unexpectedError')
      toast.error('errors.unexpectedError')
    } finally {
      setLoading(false)
    }
  }, [pagination.page_size])

  useEffect(() => {
    fetchUsers(currentPage, debouncedSearchQuery, sortField, sortDirection)
  }, [currentPage, debouncedSearchQuery, sortField, sortDirection, pagination.page_size, fetchUsers])

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

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleDelete = async (user: User) => {
    if (!confirm(t('adminUsers.confirmDelete'))) return

    try {
      await deleteUser(user.id)
      toast.success('adminUsers.deleteSuccess')
      // Preserve search query, sort parameters, and page size when refreshing the list
      await fetchUsers(currentPage, debouncedSearchQuery, sortField, sortDirection, pagination.page_size)
    } catch (err) {
      console.error('Error deleting user:', err)
      toast.error('errors.unexpectedError')
    }
  }

  const handleStatusToggle = async (user: User) => {
    try {
      await updateUserStatus(user.id, { is_active: !user.is_active })
      toast.success(
        user.is_active
          ? 'adminUsers.deactivateSuccess'
          : 'adminUsers.activateSuccess'
      )
      // Preserve search query, sort parameters, and page size when refreshing the list
      await fetchUsers(currentPage, debouncedSearchQuery, sortField, sortDirection, pagination.page_size)
    } catch (err) {
      console.error('Error updating user status:', err)
      toast.error('errors.unexpectedError')
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleUserUpdated = async () => {
    // Preserve search query, sort parameters, and page size when refreshing the list
    await fetchUsers(currentPage, debouncedSearchQuery, sortField, sortDirection, pagination.page_size)
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already triggered by the effect watching debouncedSearchQuery
  }

  const handleRefresh = () => {
    // Clear search
    setSearchQuery('')
    setDebouncedSearchQuery('')
    
    // Reset sorting to default
    setSortField('id')
    setSortDirection('asc')
    
    // Reset to first page
    setCurrentPage(1)
    
    // Fetch users with default parameters
    fetchUsers(1, '', 'id', 'asc')
  }

  const handleSort = (field: string) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Default to ascending order for a new field
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Helper to render sort indicators
  const renderSortIndicator = (field: string) => {
    if (field !== sortField) return null
    
    return sortDirection === 'asc' 
      ? <span className="ml-1">▲</span>
      : <span className="ml-1">▼</span>
  }

  // Add a helper function to check if a user is the current user
  const isCurrentUser = (user: User): boolean => {
    return !!currentUser && user.id === Number(currentUser.id)
  }

  // Add a handler for page size change
  const handlePageSizeChange = (newSize: number) => {
    setPagination({ ...pagination, page_size: newSize })
    setCurrentPage(1) // Reset to first page when changing page size
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t('adminUsers.title')}
      </h1>

      {/* Search and actions bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <form onSubmit={handleSearch} className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
            placeholder={t('adminUsers.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={t('adminUsers.searchPlaceholder')}
          />
        </form>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="secondary"
            className="inline-flex items-center"
            title={t('adminUsers.refreshTooltip')}
            aria-label={t('adminUsers.refreshTooltip')}
          >
            <FiRefreshCw className="w-5 h-5 mr-2" />
            {t('adminUsers.refresh')}
          </Button>
        </div>
      </div>

      {/* Users table */}
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
                  onClick={() => handleSort('name')}
                >
                  {t('adminUsers.table.user')}
                  {renderSortIndicator('name')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  {t('adminUsers.table.email')}
                  {renderSortIndicator('email')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('role')}
                >
                  {t('adminUsers.table.role')}
                  {renderSortIndicator('role')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('is_active')}
                >
                  {t('adminUsers.table.status')}
                  {renderSortIndicator('is_active')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  {t('adminUsers.table.created')}
                  {renderSortIndicator('created_at')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t('adminUsers.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                  >
                    <div className="flex justify-center items-center">
                      <FiRefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      {t('common.loading')}
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                  >
                    {t('adminUsers.noUsers')}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.role === 'lawyer' && user.profile_image ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.profile_image}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              {getUserInitials(user)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getFullName(user)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : user.role === 'lawyer'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {t(`common.roles.${user.role}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={() => handleStatusToggle(user)}
                        variant="ghost"
                        className={`inline-flex items-center px-2.5 py-1 text-xs rounded-full ${
                          user.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } ${isCurrentUser(user) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isCurrentUser(user)}
                        title={isCurrentUser(user) ? t('adminUsers.cannotChangeOwnStatus') : ''}
                      >
                        {user.is_active ? (
                          <>
                            <FiUserCheck className="mr-1 h-4 w-4" />
                            {t('adminUsers.active')}
                          </>
                        ) : (
                          <>
                            <FiUserX className="mr-1 h-4 w-4" />
                            {t('adminUsers.inactive')}
                          </>
                        )}
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at, 'PPP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        onClick={() => handleEdit(user)}
                        variant="ghost"
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title={t('adminUsers.edit')}
                      >
                        <FiEdit className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && users.length > 0 && (
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

      {/* User edit modal */}
      <UserEditModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleUserUpdated}
      />
    </div>
  )
} 