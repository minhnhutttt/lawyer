"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  FiEdit,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiUserPlus,
  FiClock,
  FiCheck,
  FiX
} from "react-icons/fi";
import lawyerService, { verifyLawyer } from "../../../lib/services/lawyers";
import {
  getLawyers,
  getLawyerById,
  deleteLawyer,
  updateLawyer
} from "../../../lib/services/lawyers";
import { Lawyer, LawyerSearchParams } from "../../../lib/types/lawyers";
import Pagination from "../../../components/common/Pagination";
import { useToast } from "../../../components/common/Toast";
import { getUserInitials, PaginationMeta } from "../../../lib/types";
import LawyerEditModal from "../../../components/admin/LawyerEditModal";
import LawyerHistoryModal from "../../../components/admin/LawyerHistoryModal";
import { Button } from "../../../components/ui/button";
import UserAvatarIcon from "../../../components/UserAvatarIcon";

export default function AdminLawyersPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyLoading, setVerifyLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    page_size: 10,
    total_items: 0,
    total_pages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedLawyerForHistory, setSelectedLawyerForHistory] = useState<{id: number, name: string} | null>(null);

  const fetchLawyers = useCallback(
    async (page: number, search?: string, sort?: string, order?: 'asc' | 'desc', size?: number) => {
      try {
        setLoading(true);
        setError(null);
        const params: LawyerSearchParams = {
          page,
          limit: size || pagination.page_size,
          search: search,
          sort_by: sort,
          sort_order: order,
        };
        const response = await getLawyers(params);
        setLawyers(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } catch (err) {
        console.error("Error fetching lawyers:", err);
        setError("errors.unexpectedError");
        toast.error(t("errors.unexpectedError"));
      } finally {
        setLoading(false);
      }
    },
    [pagination.page_size, toast, t]
  );

  useEffect(() => {
    fetchLawyers(currentPage, debouncedSearchQuery, sortField, sortDirection);
  }, [currentPage, debouncedSearchQuery, sortField, sortDirection]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearchQuery !== searchQuery) {
        setDebouncedSearchQuery(searchQuery);
        setCurrentPage(1);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery]);

  const handleEdit = async (lawyer: Lawyer) => {
    setModalLoading(true);
    try {
      const res = await getLawyerById(lawyer.id);
      setSelectedLawyer(res.data);
      setIsModalOpen(true);
    } catch (e) {
      toast.error(t("errors.unexpectedError"));
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLawyer(null);
  };
  
  const handleHistoryModalClose = () => {
    setIsHistoryModalOpen(false);
    setSelectedLawyerForHistory(null);
  };
  
  const handleViewHistory = (lawyer: Lawyer) => {
    setSelectedLawyerForHistory({id: lawyer.id, name: lawyer.full_name || ''});
    setIsHistoryModalOpen(true);
  };

  const handleLawyerUpdated = async () => {
    await fetchLawyers(currentPage, debouncedSearchQuery, sortField, sortDirection);
    setIsModalOpen(false);
    setSelectedLawyer(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already triggered by the effect watching debouncedSearchQuery
  };

  const handleRefresh = () => {
    // Clear search
    setSearchQuery("");
    setDebouncedSearchQuery("");
    
    // Reset sorting to default
    setSortField("id");
    setSortDirection("asc");
    
    // Reset to first page
    setCurrentPage(1);
    
    // Fetch lawyers with default parameters
    fetchLawyers(1, "", "id", "asc");
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Default to ascending order for a new field
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleToggleVerification = async (lawyer: Lawyer) => {
    try {
      setVerifyLoading(lawyer.id);
      const newStatus = !lawyer.is_verified;
      
      // Call the API to update the lawyer verification status
      await verifyLawyer(lawyer.id, newStatus);
      
      // Update the lawyer in the local state
      const updatedLawyers = lawyers.map((l) => {
        if (l.id === lawyer.id) {
          return { ...l, is_verified: newStatus };
        }
        return l;
      });
      
      setLawyers(updatedLawyers);
      
      // Show success toast
      toast.success(
        newStatus 
          ? t("adminLawyers.verificationSuccess")
          : t("adminLawyers.verificationRevoked", "Lawyer verification revoked")
      );
    } catch (error) {
      console.error("Error toggling lawyer verification:", error);
      toast.error(t("appointments.errorOccurred", "An error occurred. Please try again."));
    } finally {
      setVerifyLoading(null);
    }
  };

  // Helper to render sort indicators
  const renderSortIndicator = (field: string) => {
    if (field !== sortField) return null;
    
    return sortDirection === "asc" 
      ? <span className="ml-1">▲</span>
      : <span className="ml-1">▼</span>;
  };

  // Add a handler for page size change
  const handlePageSizeChange = (newSize: number) => {
    setPagination({ ...pagination, page_size: newSize });
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t("adminLawyers.title")}
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
            placeholder={t("adminLawyers.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={t("adminLawyers.searchPlaceholder")}
          />
        </form>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handleRefresh}
            className="inline-flex items-center"
            title={t("adminLawyers.refreshTooltip")}
            aria-label={t("adminLawyers.refreshTooltip")}
          >
            <FiRefreshCw className="w-5 h-5 mr-2" />
            {t("adminLawyers.refresh")}
          </Button>
        </div>
      </div>

      {/* Lawyers table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {error && (
          <div className="bg-red-50 text-red-500 p-4 text-sm border-b border-red-100">
            {t(error)}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("full_name")}
                >
                  {t("adminLawyers.name")}
                  {renderSortIndicator("full_name")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("office_name")}
                >
                  {t("adminLawyers.office")}
                  {renderSortIndicator("office_name")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("specialties")}
                >
                  {t("adminLawyers.specialties")}
                  {renderSortIndicator("specialties")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("average_rating")}
                >
                  {t("adminLawyers.rating")}
                  {renderSortIndicator("average_rating")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("is_verified")}
                >
                  {t("adminLawyers.verified") || "Verified"}
                  {renderSortIndicator("is_verified")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("adminLawyers.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                  >
                    <div className="flex justify-center items-center">
                      <FiRefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      {t("common.loading")}
                    </div>
                  </td>
                </tr>
              ) : lawyers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                  >
                    {t("adminLawyers.noLawyers")}
                  </td>
                </tr>
              ) : (
                lawyers.map((lawyer) => (
                  <tr key={lawyer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {lawyer.profile_image ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={lawyer.profile_image}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              {lawyer.full_name?.substring(0, 2).toUpperCase() || "LA"}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {lawyer.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lawyer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lawyer.office_name}</div>
                      <div className="text-xs text-gray-500">{lawyer.affiliation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {lawyer.specialties?.map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {t(`common.specialties.${specialty}`)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        {lawyer.average_rating !== undefined && lawyer.average_rating !== null
                          ? lawyer.average_rating.toFixed(1)
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        onClick={() => handleToggleVerification(lawyer)}
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          lawyer.is_verified
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                        }`}
                        disabled={lawyer.is_verified || verifyLoading === lawyer.id}
                      >
                        {verifyLoading === lawyer.id ? (
                          <FiRefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        ) : lawyer.is_verified ? (
                          <FiCheck className="w-4 h-4 mr-1" />
                        ) : (
                          <FiX className="w-4 h-4 mr-1" />
                        )}
                        {lawyer.is_verified ? t("adminLawyers.verifiedYes", "Verified") : t("adminLawyers.verifiedNo", "Unverified")}
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleViewHistory(lawyer)}
                        className="text-blue-600 hover:text-blue-900 mr-4 p-1"
                        title={t("adminLawyers.viewHistory", "View Changes")}
                      >
                        <FiClock className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleEdit(lawyer)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 p-1"
                        title={t("adminLawyers.edit")}
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
        {!loading && lawyers.length > 0 && (
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

      {/* Edit/Create Lawyer Modal */}
      <LawyerEditModal
        lawyer={selectedLawyer}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleLawyerUpdated}
      />
      {modalLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-lg flex items-center">
            <FiRefreshCw className="w-5 h-5 mr-3 animate-spin" />
            {t("common.loading", "Loading...")}
          </div>
        </div>
      )}
      
      {/* Lawyer History Modal */}
      {isHistoryModalOpen && selectedLawyerForHistory && (
        <LawyerHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={handleHistoryModalClose}
          lawyerId={selectedLawyerForHistory.id}
          lawyerName={selectedLawyerForHistory.name}
        />
      )}
    </div>
  );
}
