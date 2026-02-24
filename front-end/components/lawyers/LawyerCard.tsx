import {useTranslation} from 'react-i18next'
import Link from 'next/link'
import Image from 'next/image'
import {FaMapMarkerAlt, FaChevronRight, FaStar} from 'react-icons/fa'
import {getImageUrl} from '@/lib/utils/images'
import {PublicLawyer} from '@/lib/types/lawyers'
import {User} from '@/lib/types/users'
import {useAuthStore} from '@/store/auth-store'
import {Button} from '@/components/ui/button'
import RatingStars from '@/components/lawyers/RatingStars'
import {round1Decimal} from "@/lib/utils";

interface LawyerCardProps {
  lawyer: PublicLawyer
}

export default function LawyerCard({lawyer}: LawyerCardProps) {
  const {t} = useTranslation()
  const {isAuthenticated, user} = useAuthStore()

  const handleCardClick = () => {
    window.location.href = `/lawyers/${lawyer.id}`;
  }

  const handleBookingClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when booking button is clicked
  }

  return (
    <div
      onClick={handleCardClick}
      className="border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden bg-white hover:border-indigo-200 group h-full flex flex-col cursor-pointer">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center mb-4">
          <div
            className="relative w-20 h-20 mr-4 rounded-full overflow-hidden border-2 border-indigo-100 shadow-sm group-hover:border-indigo-300 transition-all duration-300 shrink-0">
            <img
              src={lawyer.profile_image ?? getImageUrl('', 'USER')}
              alt={lawyer.full_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div>
            <h3
              className="font-bold text-lg text-gray-800 group-hover:text-indigo-700 group-hover:underline transition-all duration-300">
              {lawyer.full_name} <span className="text-base text-gray-600 font-normal">弁護士</span>
            </h3>
            <p className="text-gray-600 text-sm">{lawyer.office_name}</p>

            {/* Adjusted this section below */}
            <div className="flex items-center mt-1.5">
              <RatingStars rating={lawyer.average_rating || 0}/>
              <span className="text-gray-600 text-sm font-medium ml-2">
                {(lawyer.average_rating ? round1Decimal(lawyer.average_rating) : '-')}
              </span>
            </div>
          </div>

        </div>

        <div className="mb-4 min-h-[40px]">
          {lawyer.specialties && lawyer.specialties.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {lawyer.specialties.slice(0, 5).map((specialty, i) => (
                <span key={i}
                      className="inline-block bg-indigo-50 text-indigo-800 text-xs px-2.5 py-1 rounded-full font-medium border border-indigo-100">
                  {t(`common.specialties.${specialty}`)}
                </span>
              ))}
              {lawyer.specialties.length > 5 && (
                <span
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium border border-gray-200">
                  +{lawyer.specialties.length - 5}
                </span>
              )}
            </div>
          ) : (
            <div className="h-full"></div>
          )}
        </div>

        <div className="mb-4 min-h-[56px]">
          {lawyer.profile_text ? (
            <p className="text-base text-gray-600 line-clamp-2">{lawyer.profile_text.substring(0, 50)}</p>
          ) : (
            <p className="text-base text-gray-400 italic">{t('lawyers.noInformation')}</p>
          )}
        </div>

        <div className="mb-4 min-h-[56px]">
          <h4 className="text-sm font-medium text-gray-700 mb-1">{t('lawyers.areasOfExpertise')}</h4>
          {lawyer.areas_of_expertise ? (
            <p className="text-base text-gray-600 line-clamp-2">{lawyer.areas_of_expertise.substring(0, 50)}</p>
          ) : (
            <p className="text-base text-gray-400 italic">{t('lawyers.noInformation')}</p>
          )}
        </div>

        <div className="gap-3 mb-4 text-sm">
          <div className="flex items-center">
            <div className="text-indigo-400 mr-2">
              <FaMapMarkerAlt/>
            </div>
            <span className="text-gray-700">
              {lawyer.address
                ? lawyer.address.length > 10
                  ? `${lawyer.address.slice(0, 10)}...`
                  : lawyer.address
                : t('lawyers.locationNotProvided')}
            </span>
          </div>
        </div>
        <div className="flex justify-center items-center mt-auto pt-4 border-t border-gray-100">
          {isAuthenticated ? (
            user?.role !== 'lawyer' ? (
              <Link href={`/appointments/book?lawyer=${lawyer.id}`} onClick={handleBookingClick}>
                <Button variant="primary" className="text-sm">
                  {t('lawyers.bookConsultation')}
                </Button>
              </Link>
            ) : (
              /* Empty space for lawyers - no button or text */
              <div></div>
            )
          ) : (
            <Link href={`/auth/login?from=/appointments/book?lawyer=${lawyer.id}`} onClick={handleBookingClick}>
              <Button variant="secondary" className="text-sm">
                {t('lawyers.loginToBook')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
} 