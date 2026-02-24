'use client'

import {useTranslation} from 'react-i18next'
import Link from 'next/link'
import Image from 'next/image'
import {useEffect, useState} from 'react'
import reviewsService from '../lib/services/reviews'
import articlesService from '../lib/services/articles'
import {Article} from '@/lib/types'
import {Review} from '@/lib/types'
import {getFullName, getUserInitials} from '@/lib/types'
import {useAuthStore} from '@/store/auth-store'
import UserAvatarIcon from "@/components/UserAvatarIcon";
import RatingStars from "@/components/lawyers/RatingStars";
import {round1Decimal} from "@/lib/utils";

export default function Home() {
  const {t} = useTranslation()
  const {user} = useAuthStore()
  const isLawyer = user?.role === 'lawyer'
  const [reviews, setReviews] = useState<Review[]>([])
  const [articles, setArticles] = useState<Article[]>([])

  const sections = [
    {
      href: '/lawyers',
      key: 'lawyers',
      icon: (
        <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      )
    },
    {
      href: '/questions',
      key: 'questions',
      icon: (
        <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      )
    },
    {
      href: '/appointments',
      key: 'appointments',
      icon: (
        <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      )
    }
  ]

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await reviewsService.getPinnedReviews()

        if (response.data) {
          setReviews(response.data)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

    const fetchArticles = async () => {
      try {
        const response = await articlesService.getArticles({limit: 3})

        if (response.data) {
          setArticles(response.data)
        }
      } catch (error) {
        console.error('Error fetching articles:', error)
      }
    }

    fetchReviews()
    fetchArticles()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* ── Hero Section ── */}
      <div className="w-full bg-[#F8EADC]">
        <div className="container mx-auto flex justify-center px-4">
          <Image
            src="/images/banner-t.png"
            alt="チャットで相談できる弁護士検索サイト べんごしっち"
            width={720}
            height={280}
            priority
            className="rounded-lg"
          />
        </div>
      </div>


      {/* Service Cards Section */}
      <div className="w-full bg-white py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Service Card 1: Find a Lawyer */}
            <Link href="/lawyers" className="block hover:shadow-md transition-shadow h-full">
              <div className="bg-gray-200 py-6 px-8 rounded-lg flex flex-col h-full">
                <div className="relative w-full mb-4">
                  <div className="w-48 h-48 rounded-full mx-auto flex items-center justify-center overflow-hidden">
                    <Image src="/images/top-page/Toppage 1.png" alt="Find a Lawyer" width={192} height={192}
                           className="object-cover"/>
                  </div>
                  <svg className="w-8 h-8 text-blue-600 absolute -right-6 top-1/2 transform -translate-y-1/2" fill="none"
                       stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">{t('home.serviceCards.findLawyer.title')}</h2>
                <p
                  className="text-base text-gray-700 text-center flex-grow"
                  dangerouslySetInnerHTML={{ __html: t('home.serviceCards.findLawyer.description') }}
                ></p>
              </div>
            </Link>

            {/* Service Card 2: Legal Consultation */}
            <Link href="/questions" className="block hover:shadow-md transition-shadow h-full">
              <div className="bg-gray-200 py-6 px-8 rounded-lg flex flex-col h-full">
                <div className="relative w-full mb-4">
                  <div className="w-48 h-48 rounded-full mx-auto flex items-center justify-center overflow-hidden">
                    <Image src="/images/top-page/Toppage 2.png" alt="Legal Consultation" width={192} height={192}
                           className="object-cover"/>
                  </div>
                  <svg className="w-8 h-8 text-blue-600 absolute -right-6 top-1/2 transform -translate-y-1/2" fill="none"
                       stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">{t('home.serviceCards.consultation.title')}</h2>
                <p
                  className="text-base text-gray-700 text-center flex-grow"
                  dangerouslySetInnerHTML={{ __html: t('home.serviceCards.consultation.description') }}
                ></p>
              </div>
            </Link>

            {/* Service Card 3: Legal Blog */}
            <Link href="/articles" className="block hover:shadow-md transition-shadow h-full">
              <div className="bg-gray-200 py-6 px-8 rounded-lg flex flex-col h-full">
                <div className="relative w-full mb-4">
                  <div className="w-48 h-48 rounded-full mx-auto flex items-center justify-center overflow-hidden">
                    <Image src="/images/top-page/Toppage 3.png" alt="Legal Blog" width={192} height={192}
                           className="object-cover"/>
                  </div>
                  <svg className="w-8 h-8 text-blue-600 absolute -right-6 top-1/2 transform -translate-y-1/2" fill="none"
                       stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">{t('home.serviceCards.blog.title')}</h2>
                <p
                  className="text-base text-gray-700 text-center flex-grow"
                  dangerouslySetInnerHTML={{ __html: t('home.serviceCards.blog.description') }}
                ></p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#DFC5B8] pt-24 pb-12 md:pt-28 md:pb-16 mb-12 relative">
        <div className="mx-auto max-w-7xl px-6">

          {/* Free Registration Text with Logo -- ADDED HERE */}
          {/*
            - Thêm các class để định vị tuyệt đối: "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
            - Thêm các class để tạo style nền, bo tròn và đổ bóng: "bg-white px-6 py-2 rounded-full shadow-lg z-10"
          */}
          <div
            className="flex justify-center items-center absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-2 rounded-full shadow-lg z-10">
            <Image
              src="/images/logo.png"
              alt="べんごレッチ"
              width={80}
              height={32}
              className="h-8 w-auto mr-2"
            />
            <p className="text-xl font-semibold whitespace-nowrap">{t('home.serviceCards.freeRegistration')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="relative">
                <div
                  className="absolute -top-4 -left-4 w-20 h-20 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                  <span className="text-2xl font-bold">01</span>
                </div>
                <div className="w-28 h-28 mx-auto mb-6 flex items-center justify-center overflow-hidden">
                  <Image src="/images/top-page/Toppage 4.png" alt="Step 1" width={112} height={112}
                         className="object-cover"/>
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1">
                  <span className="text-2xl font-bold">弁護士との</span>
                </div>
                <div className="mb-1">
                  <span className="text-2xl font-bold">チャット予約</span>
                </div>
                <div>
                  <span className="text-lg">ができます</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="relative">
                <div
                  className="absolute -top-4 -left-4 w-20 h-20 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                  <span className="text-2xl font-bold">02</span>
                </div>
                <div className="w-28 h-28 mx-auto mb-6 flex items-center justify-center overflow-hidden">
                  <Image src="/images/top-page/Toppage 5.png" alt="Step 2" width={112} height={112}
                         className="object-cover"/>
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1">
                  <span className="text-2xl font-bold">みんなの</span>
                </div>
                <div className="mb-1">
                  <span className="text-2xl font-bold">法律相談に投稿</span>
                </div>
                <div>
                  <span className="text-lg">ができます</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="relative">
                <div
                  className="absolute -top-4 -left-4 w-20 h-20 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                  <span className="text-2xl font-bold">03</span>
                </div>
                <div className="w-28 h-28 mx-auto mb-6 flex items-center justify-center overflow-hidden">
                  <Image src="/images/top-page/Toppage 6.png" alt="Step 3" width={112} height={112}
                         className="object-cover"/>
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1">
                  <span className="text-2xl font-bold">みんなの</span>
                </div>
                <div className="mb-1">
                  <span className="text-2xl font-bold">法律相談の回答</span>
                </div>
                <div>
                  <span className="text-lg">を閲覧できます</span>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Button */}
          <div className="flex justify-center mt-10">
            {!user && <Link
                href="/auth/register"
                className="bg-amber-400 hover:bg-amber-500 text-black px-8 py-3 rounded-md font-medium text-center text-lg">
              {t('home.stepsGuide.registerButton')}
            </Link>}
          </div>
        </div>
      </div>

      {/* Lawyer Registration Section */}
      {!user && (
        <div className="w-full bg-gray-200 py-6 md:py-8">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
              <h3 className="text-lg font-medium text-gray-800">
                {t('home.lawyerRegistration.forLawyers')}
              </h3>
              <Link
                href="/auth/register?role=lawyer"
                className="bg-amber-400 hover:bg-amber-500 text-black px-8 py-4 rounded-lg font-semibold text-lg text-center"
              >
                {t('home.lawyerRegistration.registerAsLawyer')}
              </Link>
            </div>
          </div>
        </div>
      )}


      {/* Articles Section */}
      <div className="w-full  py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('home.articles.title')}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {articles.map((article) => (
              <a
                key={article.id}
                href={`/articles/${article.slug}`}
                className="flex flex-col h-full rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {article.thumbnail && (
                  <div className="w-full h-48 overflow-hidden rounded-lg">
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-6">
        <span
          className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-3"
        >
          {t(`articles.categories.${article.category}`)}
        </span>
                  <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                  <p className="text-gray-600 line-clamp-3">{article.summary}</p>
                </div>
              </a>
            ))}
          </div>


          <div className="mt-10 text-center">
            <Link
              href="/articles"
              className="inline-flex items-center justify-center px-10 py-3 bg-gray-200 text-black font-medium hover:bg-gray-300 transition-colors rounded-md"
            >
              {t('articles.viewAll', 'View All Articles')}
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="w-full bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('home.testimonials.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('home.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {reviews.length > 0 ? reviews.map((review) => (
              <div
                key={review.id}
                className="h-full"
              >
                <div className="bg-gray-200 rounded-2xl shadow-md p-6 flex flex-col gap-2 h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <UserAvatarIcon profileImage={review.lawyer.user.profile_image}/>
                      <div>
                        <div className="text-2xl font-semibold text-black leading-6">{review.lawyer.full_name}</div>
                        <div className="text-gray-600 text-base">{review.lawyer.office_name}</div>
                        <div className="mt-1 flex items-center">
                          <RatingStars rating={review.lawyer.average_rating || 0}/>
                          <span className="text-gray-600 text-lg font-medium ml-1">{review.lawyer.average_rating ? round1Decimal(review.lawyer.average_rating) : '-'}</span>
                        </div>
                      </div>
                    </div>
                    {/* Red Chevron */}
                    <Link href={`/lawyers/${review.lawyer.id}`}
                    >
                      <div className="mt-2">
                        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </Link>
                  </div>

                  {/* Speech bubble with medal */}
                  <div className="flex items-center mt-4">
                    {/* Medal (overlapping the bubble) */}
                    <div className="flex items-center h-full">
                      <img src="/icons/medal.svg" alt="Medal" className="w-30 h-30"/>
                    </div>
                    {/* Speech bubble tail */}
                    <div
                      className="w-0 h-0 border-t-[18px] border-t-transparent border-b-[18px] border-b-transparent border-r-[18px] border-r-blue-400 ml-6"></div>
                    {/* Speech bubble */}
                    <div
                      className="bg-blue-100 border-2 border-blue-400 rounded-full px-7 py-5 flex-1 ml-[-8px] relative flex items-center">
                      <div className="text-black text-lg font-semibold leading-relaxed line-clamp-4">
                        {review.comment}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )) : (
              // Fallback testimonials if no reviews are loaded yet
              [
                {
                  id: 1,
                  name: "Sarah Johnson",
                  role: "Business Owner",
                  content: "Finding the right lawyer was simple and fast."
                },
                {
                  id: 2,
                  name: "Michael Chen",
                  role: "Property Developer",
                  content: "Quick responses and professional advice saved me time and money."
                },
                {
                  id: 3,
                  name: "Emily Rodriguez",
                  role: "Family Law Client",
                  content: "I was able to connect with a compassionate lawyer who guided me through my case."
                }
              ].map((fallback) => (
                <div
                  key={fallback.id}
                  className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow h-full"
                >
                  <div className="flex items-center mb-4">
                    <div
                      className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                      {fallback.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold">{fallback.name}</h4>
                      <p className="text-gray-600">{fallback.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">"{fallback.content}"</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-[#DFC5B8] py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('home.finalCta.title')}
          </h2>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('home.finalCta.subtitle')}
          </h2>
          {!user &&
              <div className="mt-10">
                  <Link
                      href="/auth/register"
                      className="rounded-md bg-[#EDB033] px-6 py-3 text-base sm:text-2xl font-semibold text-black shadow-sm hover:bg-[#d9a02d]"
                  >
                    {t('home.finalCta.button')}
                  </Link>
              </div>
          }
        </div>
      </div>
    </main>
  )
}
