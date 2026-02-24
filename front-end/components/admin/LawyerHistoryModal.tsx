import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiX, FiRefreshCw } from "react-icons/fi";
import { formatDate } from "../../lib/utils";
import { getLawyerHistory } from "../../lib/services/lawyer-history";
import { LawyerHistory, FieldChange } from "../../lib/types/lawyer-history";
import { PaginationMeta } from "../../lib/types";
import Pagination from "../common/Pagination";
import { Button } from "../ui/button";

interface LawyerHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyerId: number;
  lawyerName: string;
}

export default function LawyerHistoryModal({
  isOpen,
  onClose,
  lawyerId,
  lawyerName,
}: LawyerHistoryModalProps) {
  const { t } = useTranslation();
  const [history, setHistory] = useState<LawyerHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    page_size: 10,
    total_items: 0,
    total_pages: 0,
  });

  const fetchHistory = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getLawyerHistory({
        lawyer_id: lawyerId,
        page,
        limit: pagination.page_size,
      });
      setHistory(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching lawyer history:", err);
      setError(t("errors.unexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && lawyerId) {
      fetchHistory(currentPage);
    }
  }, [isOpen, lawyerId, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination({ ...pagination, page_size: newSize });
    setCurrentPage(1);
  };

  // Format the field name for display
  const formatFieldName = (fieldName: string) => {
    // Check if we have a translation for this field
    const translatedField = t(`lawyerHistory.fields.${fieldName}`, "");
    
    // If we have a translation, use it
    if (translatedField) {
      return translatedField;
    }
    
    // Otherwise, fallback to formatting the field name
    // For PascalCase fields (most fields from the database)
    if (/^[A-Z]/.test(fieldName)) {
      // Insert spaces between words in PascalCase (e.g., "FullName" -> "Full Name")
      return fieldName.replace(/([A-Z])/g, ' $1').trim().replace(/^./, (str) => str.toUpperCase());
    }
    
    // For snake_case fields (if any)
    return fieldName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format the field value for display
  const formatFieldValue = (value: any, fieldName?: string): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-gray-400">-</span>;
      }
      
      // Special handling for specialties array
      if (fieldName === "Specialties") {
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((specialty, idx) => {
              // Get translated specialty from common.specialties
              const translatedSpecialty = t(`common.specialties.${specialty}`, specialty) as string;
              return (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {translatedSpecialty}
                </span>
              );
            })}
          </div>
        );
      }
      
      // Default array handling for other array fields
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
            >
              {item}
            </span>
          ))}
        </div>
      );
    }

    if (typeof value === "boolean") {
      return value ? (
        <span className="text-green-600">{t("lawyerHistory.booleanValues.yes", "Yes")}</span>
      ) : (
        <span className="text-red-600">{t("lawyerHistory.booleanValues.no", "No")}</span>
      );
    }

    return <span>{String(value)}</span>;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-auto max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {t("lawyerHistory.title", "Lawyer Change History")}: {lawyerName}
            </h3>
              <Button
              variant="ghost"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
              aria-label={t("lawyerHistory.close", "Close")}
            >
              <FiX className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <FiRefreshCw className="w-6 h-6 mr-3 animate-spin text-primary" />
                <span>{t("common.loading", "Loading...")}</span>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 p-4">{error}</div>
            ) : history.length === 0 ? (
              <div className="text-center text-gray-500 p-4">
                {t("lawyerHistory.noChanges", "No change history found")}
              </div>
            ) : (
              <div className="space-y-8">
                {history.map((item) => (
                  <div key={item.id} className="border-b border-gray-200 pb-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-sm font-semibold text-gray-500">
                          {formatDate(item.created_at)}
                        </span>
                        {item.user_name && (
                          <span className="ml-2 text-sm text-gray-500">
                            {t("lawyerHistory.by", "by")} {item.user_name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t("lawyerHistory.field", "Field")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t("lawyerHistory.oldValue", "Old Value")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t("lawyerHistory.newValue", "New Value")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {item.changes.map((change, idx) => (
                            <tr key={idx}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatFieldName(change.field)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {formatFieldValue(change.old, change.field)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {formatFieldValue(change.new, change.field)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!loading && history.length > 0 && (
            <div className="border-t border-gray-200 py-3 px-6">
              <Pagination
                currentPage={currentPage}
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
