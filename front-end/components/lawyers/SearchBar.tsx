import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import {Search} from "lucide-react";

interface SearchBarProps {
  searchTerm: string
  onSearchTermChange: (term: string) => void
  onSearch: () => void
}

export default function SearchBar({ 
  searchTerm, 
  onSearchTermChange, 
  onSearch 
}: SearchBarProps) {
  const { t } = useTranslation()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <div 
      className="w-full py-20 md:py-28 relative shadow-lg text-white"
      style={{
        backgroundImage: 'url(/images/banner.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        maxHeight: '330px',
      }}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
      <div className="container mx-auto px-4 relative z-20 text-center">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 justify-center">
          {t('lawyers.findLawyer')}
        </h1>

        <div className="max-w-3xl mx-auto mb-6">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400">
              <Search size={18}/>
            </div>
          <input
            type="text"
            placeholder={t('lawyers.searchPlaceholder')}
            className="w-full rounded-lg border-0 py-4 pl-10 pr-10 shadow-md focus:ring-2 focus:ring-indigo-500 text-gray-800 text-lg"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        </div>
      </div>
    </div>
  )
} 