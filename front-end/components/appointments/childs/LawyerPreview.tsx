import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { PublicLawyer } from '@/lib/types/lawyers'
import { User } from '@/lib/types/users'
import { FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa'
import { getImageUrl } from '@/lib/utils/images'
import UserAvatarIcon from "@/components/UserAvatarIcon";

interface LawyerPreviewProps {
  lawyer: PublicLawyer
  compact?: boolean
}

export default function LawyerPreview({ lawyer, compact = false }: LawyerPreviewProps) {
  const { t } = useTranslation()
  
  if (!lawyer) return null
  
  // Render stars for lawyer rating
  const renderStars = (rating: number) => {
    const maxStars = 5
    const stars = []
    
    for (let i = 1; i <= maxStars; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="text-yellow-400">★</span>
        )
      } else {
        stars.push(
          <span key={i} className="text-gray-300">★</span>
        )
      }
    }
    
    return <div className="flex">{stars}</div>
  }
  
  // For compact view (used in time selection)
  if (compact) {
    return (
      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
        <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
          <UserAvatarIcon profileImage={lawyer.profile_image}/>
        </div>
        <div>
          <h3 className="font-medium">{lawyer.full_name}</h3>
          <div className="text-sm text-gray-600">
            {lawyer.specialties && lawyer.specialties.length > 0 
              ? lawyer.specialties.map((speciality) => t(`common.specialties.${speciality}`)).join(', ')
              : t('lawyers.noSpecialties')}
          </div>
        </div>
      </div>
    )
  }
  
  // Full preview (used in summary/review step)
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-4">
      <div className="flex items-start">
        <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
          <UserAvatarIcon profileImage={lawyer.profile_image} size={16}/>
        </div>
        
        <div className="flex-grow">
          <h3 className="font-medium text-lg">{lawyer.full_name}</h3>
          <p className="text-gray-600">{lawyer.office_name}</p>
          
          <div className="mt-1 flex items-center">
            {renderStars(lawyer.average_rating || 0)}
            <span className="ml-2 text-sm text-gray-600">
              {t('lawyers.reviewCount', { count: lawyer.review_count || 0 })}
            </span>
          </div>
          
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center text-gray-600">
              <span className="mr-2 text-gray-400"><FaMapMarkerAlt /></span>
              <span>{lawyer.address || t('lawyers.locationNotProvided')}</span>
            </div>
          </div>
          
          {lawyer.specialties && lawyer.specialties.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {lawyer.specialties.slice(0, 3).map((specialty, i) => (
                  <span 
                    key={i} 
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {t(`common.specialties.${specialty}`)}
                  </span>
                ))}
                {lawyer.specialties.length > 3 && (
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    +{lawyer.specialties.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 