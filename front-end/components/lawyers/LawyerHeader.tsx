import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import Image from 'next/image'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { PublicLawyer } from '@/lib/types/lawyers'
import { User } from '@/lib/types/users'
import { useAuthStore } from '@/store/auth-store'
import RatingStars from './RatingStars'
import { getImageUrl } from '@/lib/utils/images'
import { Button } from '@/components/ui/button'
import {round1Decimal} from "@/lib/utils";

interface LawyerHeaderProps {
  lawyer: PublicLawyer
  bookingLink?: string
  isAuthenticated?: boolean
  userImage?: string
}

export default function LawyerHeader({ 
  lawyer, 
  bookingLink,
  isAuthenticated: propIsAuthenticated,
  userImage
}: LawyerHeaderProps) {
  const { t } = useTranslation()
  const authStore = useAuthStore()
  const user = authStore.user
  
  // Use prop if provided, otherwise use the store
  const isAuthenticated = propIsAuthenticated !== undefined ? propIsAuthenticated : authStore.isAuthenticated

  return (
    <div className="mb-6 flex flex-col items-start gap-6 md:flex-row">
      <div className="flex-shrink-0">
        <div className="relative overflow-hidden rounded-full" style={{ height: '9rem', width: '9rem' }}>
          <img
            src={lawyer.profile_image ?? getImageUrl('', 'USER')}
            alt={lawyer.full_name}
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">{lawyer.full_name}</h1>
          <span className="ml-2 text-base font-normal">弁護士</span>
          {lawyer.user_active === false && (
            <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
              {t('lawyers.disabled', 'Disabled')}
            </span>
          )}
        </div>
        <div className="flex items-center text-gray-600">
          <div className="mr-2 text-gray-400">
            <FaMapMarkerAlt size={16} />
          </div>
          <span>{lawyer.office_name}{lawyer.office_name && lawyer.address ? ' - ' : ''}{lawyer.address || t('lawyers.locationNotProvided')}</span>
        </div>
        <div className="mt-2 flex items-center">
          <RatingStars rating={lawyer.average_rating || 0} />
          <span className="ml-2 text-sm text-gray-600">
            {lawyer.average_rating && round1Decimal(lawyer.average_rating)} - {t('lawyers.reviewCount', { count: lawyer.review_count || 0 })}
          </span>
        </div>

        <div className="mt-3">
          {isAuthenticated && user && user.role !== 'lawyer' && lawyer.user_active && (
            <Link href={bookingLink || `/appointments/book?lawyer=${lawyer.id}`}>
              <Button variant="primary">
                {t('lawyers.bookConsultation')}
              </Button>
            </Link>
          )}
          {! isAuthenticated && lawyer.user_active && (
            <Link href={bookingLink ? `/auth/login?from=${bookingLink}` : `/auth/login?from=/appointments/book?lawyer=${lawyer.id}`}>
              <Button variant="secondary">
                {t('lawyers.loginToBook')}
              </Button>
            </Link>
          )}
        </div>
      </div>

    </div>
  )
} 