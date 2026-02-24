import {useTranslation} from 'react-i18next'
import {PublicLawyer} from '@/lib/types/lawyers'
import {formatDate} from "@/lib/utils"
import {
  FaCheck, FaGlobe, FaIdCard, FaFileAlt,
  FaMapMarkerAlt, FaPhone, FaFax, FaBriefcase, FaBuilding
} from 'react-icons/fa'
import Link from "next/link";
import {Button} from "@/components/ui";
import {useAuthStore} from "@/store/auth-store";

interface LawyerBasicInfoProps {
  lawyer: PublicLawyer
  bookingLink?: string
  isAuthenticated?: boolean
}

export default function LawyerBasicInfo({
  lawyer,
  bookingLink,
  isAuthenticated: propIsAuthenticated
}: LawyerBasicInfoProps) {
  const {t} = useTranslation()
  const authStore = useAuthStore()
  const user = authStore.user

  const isAuthenticated = propIsAuthenticated !== undefined ? propIsAuthenticated : authStore.isAuthenticated


  return (
    <div className="prose max-w-none">
      {/* Personal Information Section */}
      <section className="mb-8">
        {/* Profile Text */}
        <div className="mt-6 space-y-1">
          <h3 className="text-md font-medium text-gray-600">{t('lawyers.profileText')}</h3>
          <p>{lawyer.profile_text || t('lawyers.noBioAvailable')}</p>
        </div>

        {/* Notes */}
        <div className="mt-6 space-y-1">
          <h3 className="text-md font-medium text-gray-600">{t('lawyers.notes')}</h3>
          <p>{lawyer.notes || t('lawyers.noNotesAvailable')}</p>
        </div>
      </section>

      {/* Qualifications Section */}
      <section className="mb-8">
        {/* Registration Number */}
        <div className="mt-4 space-y-1">
          <h3 className="flex items-center text-md font-medium text-gray-600">
            {t('lawyers.registrationNumber')}
          </h3>
          <p className="ml-6">{lawyer.lawyer_registration_number || t('lawyers.notProvided')}</p>
        </div>

        {/* Specialty Fields */}
        <div className="mt-4 space-y-1">
          <h3 className="text-md font-medium text-gray-600">{t('lawyers.specialtyFields')}</h3>
          <ul className="ml-6 mt-2 space-y-2">
            {lawyer.specialties && lawyer.specialties.length > 0 ? (
              lawyer.specialties.map((specialty, index) => (
                <li key={index} className="flex items-center">
                  {t(`common.specialties.${specialty}`)}
                </li>
              ))
            ) : (
              <li>{t('lawyers.noSpecialties')}</li>
            )}
          </ul>
        </div>

        {/* Areas of Expertise */}
        <div className="mt-6 space-y-1">
          <h3 className="text-md font-medium text-gray-600">{t('lawyers.areasOfExpertise')}</h3>
          <p className="ml-6">{lawyer.areas_of_expertise || t('lawyers.noExpertiseProvided')}</p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section>
        <h2 className="text-xl font-semibold">{t('lawyers.contactInformation')}</h2>

        <div className="mt-4 space-y-4">
          {/* Affiliation */}
          <div className="flex items-start">
            <div>
              <h3 className="text-lg font-medium">{t('lawyers.affiliation')}</h3>
              <p>{lawyer.affiliation || t('lawyers.notProvided')}</p>
            </div>
          </div>

          {/* Office Name */}
          <div className="flex items-start">
            <div>
              <h3 className="text-lg font-medium">{t('lawyers.officeName')}</h3>
              <p>{lawyer.office_name || t('lawyers.notProvided')}</p>
            </div>
          </div>

          {/* Office Address */}
          <div className="flex items-start">
            <div>
              <h3 className="text-lg font-medium">{t('lawyers.officeAddress')}</h3>
              <p>{lawyer.address || t('lawyers.addressNotProvided')}</p>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-start">
            <div>
              <h3 className="text-lg font-medium">{t('lawyers.phoneNumber')}</h3>
              <p>{lawyer.phone_number || t('lawyers.phoneNotProvided')}</p>
              {lawyer.phone_number && (
                <a
                  href={`tel:${lawyer.phone_number}`}
                  className="text-blue-600 hover:underline"
                >
                  {t('lawyers.callNow')}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 flex justify-center">
        {isAuthenticated && user && user.role !== 'lawyer' && lawyer.user_active && (
          <Link href={bookingLink || `/appointments/book?lawyer=${lawyer.id}`}>
            <Button variant="primary">
              {t('lawyers.bookConsultation')}
            </Button>
          </Link>
        )}
        {!isAuthenticated && lawyer.user_active && (
          <Link
            href={bookingLink ? `/auth/login?from=${bookingLink}` : `/auth/login?from=/appointments/book?lawyer=${lawyer.id}`}>
            <Button variant="secondary">
              {t('lawyers.loginToBook')}
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
