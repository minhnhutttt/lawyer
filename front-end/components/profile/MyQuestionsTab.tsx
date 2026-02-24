"use client";

import { useEffect, useState, useRef } from 'react';
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { getMyQuestions } from "@/lib/services/questions";
import { QuestionSearchParams } from "@/lib/types/questions";
import { Question, QuestionStatus } from "@/lib/types/questions";
import { PaginationMeta } from "@/lib/types";
import Pagination from "@/components/common/Pagination";
import { useToast } from "@/components/common/Toast";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ja, enUS } from "date-fns/locale";

export default function MyQuestionsTab() {
  const { t, i18n } = useTranslation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<QuestionStatus | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    page_size: 10,
    total_items: 0,
    total_pages: 0,
  });
  
  // Add a ref to track if we've already loaded the data for this page
  const loadedPages = useRef<Set<number>>(new Set());
  
  const toast = useToast();
  const locale = i18n.language === 'ja' ? ja : enUS;

  // Function to fetch questions - defined inside the component but outside of any hook
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pass pagination parameters to the API
      const response = await getMyQuestions({
        page,
        page_size: 10
      });
      
      if (response?.data && Array.isArray(response.data)) {
        setQuestions(response.data);
        // Use the pagination from API response if available
        if (response.pagination) {
          setPagination(response.pagination);
        } else {
          // Default pagination if not provided by API
          setPagination({
            page,
            page_size: 10,
            total_items: response.data.length,
            total_pages: Math.ceil(response.data.length / 10) || 1
          });
        }
      } else {
        setQuestions([]);
        setPagination({
          page: 1,
          page_size: 10,
          total_items: 0,
          total_pages: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(t("errors.loadQuestions"));
      toast.error(t("errors.loadQuestions"));
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Load questions only once on component mount and when page changes
  useEffect(() => {
    // Only fetch if we haven't already loaded this page
    if (!loadedPages.current.has(page)) {
      fetchQuestions();
      loadedPages.current.add(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage !== page) {
      setPage(newPage);
      // Page change will trigger fetchQuestions through the dependency array
    }
  };

  const getStatusClass = (status: QuestionStatus) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'answered':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPP', { locale });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">{t("profile.myQuestions")}</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">{error}</p>
          <Button 
            variant="danger"
            onClick={fetchQuestions}
          >
            {t("common.tryAgain")}
          </Button>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">{t("profile.noQuestions")}</p>
          <Link href="/questions/ask">
            <Button variant="primary">
              {t("questions.askQuestion")}
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                <div>
                  <Link href={`/questions/${question.id}`} className="block">
                    <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800 transition">
                      {question.title}
                    </h3>
                  </Link>
                  <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                    <span>{formatDate(question.created_at)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(question.status)}`}>
                      {t(`questions.status.${question.status}`)}
                    </span>
                    <span>
                      {question.answer_count} {t("questions.answerCount")}
                    </span>
                    {question.is_anonymous && (
                      <span className="text-gray-400 italic">
                        {t("questions.anonymous")}
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-600 line-clamp-2">
                      {question.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {pagination.total_pages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
