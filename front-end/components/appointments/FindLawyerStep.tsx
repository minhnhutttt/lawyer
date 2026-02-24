"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PublicLawyer } from "@/lib/types/lawyers";
import { getPublicLawyers } from "@/lib/services/lawyers";
import { PaginationMeta } from "@/lib/types";

import LawyersList from "@/components/lawyers/LawyersList";
import SearchBar from "@/components/lawyers/SearchBar";
import LawyerFilters from "@/components/lawyers/LawyerFilters";
import {LAWYER_SPECIALTIES} from "@/lib/types/enums";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/common/Pagination";

interface FindLawyerStepProps {
  onLawyerSelect: (lawyer: PublicLawyer) => void;
  initialSearchTerm?: string;
}

export default function FindLawyerStep({
  onLawyerSelect,
  initialSearchTerm = "",
}: FindLawyerStepProps) {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedPrefecture, setSelectedPrefecture] = useState('')
  const [minRating, setMinRating] = useState<number | null>(null);
  const [minExperience, setMinExperience] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Pagination states
  const [searchParams, setSearchParams] = useState({
    page: 1,
    page_size: 9
  });
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    page_size: 9,
    total_items: 0,
    total_pages: 0
  });

  const [lawyers, setLawyers] = useState<PublicLawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const allSpecialtiesOption = 'all'

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: searchParams.page,
        page_size: searchParams.page_size
      };
      if (searchTerm) params.name = searchTerm;
      if (
        selectedSpecialty &&
        selectedSpecialty !== t("lawyers.allSpecialties")
      ) {
        params.specialty = selectedSpecialty;
      }
      if (selectedPrefecture) params.prefecture = selectedPrefecture
      if (minRating) params.min_rating = minRating.toString();
      if (minExperience) params.experience = minExperience.toString();

      const response = await getPublicLawyers(params);
      setLawyers(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching lawyers:", err);
      setError(t("errors.failedToLoadLawyers"));
      setLawyers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, [searchTerm, selectedSpecialty, minRating, selectedPrefecture, minExperience, searchParams, t]);

  const handleSearch = () => {
    // Reset to page 1 when searching
    setSearchParams((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSpecialtyChange = (specialty: string) => {
    if (specialty === 'all') {
      setSelectedSpecialty('')
    } else {
      setSelectedSpecialty(specialty)
    }
  }

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSpecialty("");
    setMinRating(null);
    setMinExperience(null);
    setSelectedPrefecture("");
    setSearchParams({ page: 1, page_size: 6 });
  };

  const handlePrefectureChange = (prefecture: string) => {
    setSelectedPrefecture(prefecture)
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="space-y-6">
      {}
      <div className="shadow-lg">
        <SearchBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearch}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {}
        <div className="hidden md:block md:col-span-1">
          <LawyerFilters
            allSpecialtiesOption={allSpecialtiesOption}
            specialties={LAWYER_SPECIALTIES}
            selectedSpecialty={selectedSpecialty}
            selectedPrefecture={selectedPrefecture}
            minRating={minRating}
            minExperience={minExperience}
            onSpecialtyChange={handleSpecialtyChange}
            onPrefectureChange={handlePrefectureChange}
            onMinRatingChange={setMinRating}
            onMinExperienceChange={setMinExperience}
            onClearFilters={handleClearFilters}
          />
        </div>

        {}
        {isFilterOpen && (
          <div className="md:hidden col-span-1">
            <LawyerFilters
              allSpecialtiesOption={allSpecialtiesOption}
              specialties={LAWYER_SPECIALTIES}
              selectedSpecialty={selectedSpecialty}
              selectedPrefecture={selectedPrefecture}
              minRating={minRating}
              minExperience={minExperience}
              onSpecialtyChange={handleSpecialtyChange}
              onPrefectureChange={handlePrefectureChange}
              onMinRatingChange={setMinRating}
              onMinExperienceChange={setMinExperience}
              onClearFilters={handleClearFilters}
              isFilterOpen={isFilterOpen}
              toggleFilter={toggleFilter}
            />
          </div>
        )}

        {}
        <div className="md:col-span-3">
          {}
          <div className="md:hidden mb-4">
            <Button
              variant="secondary"
              className="w-full flex items-center justify-between rounded-lg px-4 py-3"
              onClick={toggleFilter}
              aria-expanded={isFilterOpen}
              aria-controls="mobile-filters"
            >
              <span className="font-medium flex items-center gap-2 text-indigo-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                {t("lawyers.filterLawyers")}
              </span>
              <div className="bg-indigo-100 rounded-full h-6 w-6 flex items-center justify-center">
                <svg
                  className={`h-4 w-4 text-indigo-700 transition-transform ${
                    isFilterOpen ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {t("appointments.selectLawyer")}
            </h2>
            
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-600">
                {pagination.total_items > 0
                  ? t('lawyers.foundResults', { count: pagination.total_items })
                  : t('lawyers.noResults')}
              </p>
            </div>
            
            <LawyersList
              lawyers={lawyers}
              loading={loading}
              error={error}
              onRetry={fetchLawyers}
              onSelectLawyer={onLawyerSelect}
            />
            
            {/* Pagination */}
            {!loading && lawyers.length > 0 && pagination.total_pages > 1 && (
              <div className="my-6">
                <Pagination 
                  currentPage={pagination.page}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
