import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { LAWYER_SPECIALTIES } from '@/lib/types/enums'
import { getPrefectureOptions } from '@/lib/enums/prefectures-enum'
import { Button } from '@/components/ui/button'

interface LawyerFiltersProps {
  allSpecialtiesOption: string
  specialties: typeof LAWYER_SPECIALTIES
  selectedSpecialty: string
  selectedPrefecture: string
  minRating: number | null
  minExperience: number | null
  onSpecialtyChange: (specialty: string) => void
  onPrefectureChange: (prefecture: string) => void
  onMinRatingChange: (rating: number | null) => void
  onMinExperienceChange: (experience: number | null) => void
  onClearFilters: () => void
  isFilterOpen?: boolean
  toggleFilter?: () => void
}

export default function LawyerFilters({
  allSpecialtiesOption,
  specialties,
  selectedSpecialty,
  selectedPrefecture,
  minRating,
  minExperience,
  onSpecialtyChange,
  onPrefectureChange,
  onMinRatingChange,
  onMinExperienceChange,
  onClearFilters,
  isFilterOpen = true,
  toggleFilter
}: LawyerFiltersProps) {
  const { t } = useTranslation()
  const [expandedSections, setExpandedSections] = useState({
    specialty: true,
    prefecture: true,
    rating: true,
    experience: true
  })

  // If on mobile and filter is closed, don't render anything
  // The mobile toggle button is handled in the parent component
  if (toggleFilter && !isFilterOpen) {
    return null
  }

  const toggleSection = (section: 'specialty' | 'prefecture' | 'rating' | 'experience') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const prefectureOptions = getPrefectureOptions((key) => t(key))

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 border border-gray-100">
      <div className="hidden lg:flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-indigo-700">{t('lawyers.filters')}</h2>
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className="text-indigo-600 hover:text-indigo-800 p-0 h-auto flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {t('lawyers.clearFilters')}
        </Button>
      </div>

      {/* Mobile close button - only shown on mobile */}
      {toggleFilter && (
        <div className="md:hidden mb-4">
          <Button
            variant="ghost"
            onClick={toggleFilter}
            className="w-full flex items-center justify-between bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          >
            <span className="font-medium">{t('lawyers.closeFilters')}</span>
            <svg
              className="h-5 w-5 transition-transform transform rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>

          {/* "Clear Filters" button floated to the end (right) */}
          <div className="flex justify-end mt-2">
            <Button
              variant="ghost"
              onClick={onClearFilters}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 p-0 h-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {t('lawyers.clearFilters')}
            </Button>
          </div>
        </div>
      )}



      {/* Specialty Section */}
      <div className="mb-5 border-b border-gray-100 pb-5">
        <Button
          variant="ghost"
          onClick={() => toggleSection('specialty')}
          className="flex items-center justify-between w-full text-left mb-3 p-0 h-auto"
        >
          <h3 className="text-md font-semibold text-gray-800">{t('lawyers.specialty')}</h3>
          <svg
            className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.specialty ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>

        {expandedSections.specialty && (
          <div className="flex flex-wrap gap-2 mt-3">
            {/* Add the 'All Specialties' option first */}
            <Button
              key="all"
              variant={selectedSpecialty === '' ? "primary" : "secondary"}
              className={`px-3 py-1.5 rounded-full text-sm`}
              onClick={() => onSpecialtyChange(allSpecialtiesOption)}
            >
              {t('common.specialties.all')}
            </Button>

            {/* Map through the specialty enum values */}
            {specialties.map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "primary" : "secondary"}
                className={`px-3 py-1.5 rounded-full text-sm`}
                onClick={() => onSpecialtyChange(specialty)}
              >
                {t(`common.specialties.${specialty}`)}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Prefecture Section */}
      <div className="mb-5 border-b border-gray-100 pb-5">
        <Button
          variant="ghost"
          onClick={() => toggleSection('prefecture')}
          className="flex items-center justify-between w-full text-left mb-3 p-0 h-auto"
        >
          <h3 className="text-md font-semibold text-gray-800">{t('lawyers.prefecture')}</h3>
          <svg
            className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.prefecture ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
        
        {expandedSections.prefecture && (
          <div className="mt-3">
            <select
              className="block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-primary focus:border-primary transition-all sm:text-sm"
              value={selectedPrefecture || ''}
              onChange={(e) => onPrefectureChange(e.target.value)}
            >
              <option value="">{t('prefectures.select')}</option>
              {prefectureOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Rating Section */}
      <div className="mb-5 border-b border-gray-100 pb-5">
        <Button 
          variant="ghost"
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full text-left mb-3 p-0 h-auto"
        >
          <h3 className="text-md font-semibold text-gray-800">{t('lawyers.minimumRating')}</h3>
          <svg
            className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.rating ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
        
        {expandedSections.rating && (
          <div className="flex flex-wrap gap-2 mt-3">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={minRating === rating ? "primary" : "secondary"}
                className="p-2.5 flex items-center gap-1"
                onClick={() => onMinRatingChange(minRating === rating ? null : rating)}
              >
                {rating}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {t('lawyers.orHigher')}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div>
        <Button 
          variant="ghost"
          onClick={() => toggleSection('experience')}
          className="flex items-center justify-between w-full text-left mb-3 p-0 h-auto"
        >
          <h3 className="text-md font-semibold text-gray-800">{t('lawyers.minimumExperience')}</h3>
          <svg
            className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.experience ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
        
        {expandedSections.experience && (
          <div className="flex flex-wrap gap-2 mt-3">
            {[1, 3, 5, 10].map((years) => (
              <Button
                key={years}
                variant={minExperience === years ? "primary" : "secondary"}
                className="px-3 py-1.5 flex items-center gap-1.5"
                onClick={() => onMinExperienceChange(minExperience === years ? null : years)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('lawyers.years', { count: years })}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}