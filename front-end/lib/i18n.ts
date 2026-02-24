'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'

// English
import enCommon from '@/locales/en/common.json'
import enAuth from '@/locales/en/auth.json'
import enAnswers from '@/locales/en/answers.json'
import enQuestions from '@/locales/en/questions.json'
import enLawyers from '@/locales/en/lawyers.json'
import enAppointments from '@/locales/en/appointments.json'
import enErrors from '@/locales/en/errors.json'
import enProfile from '@/locales/en/profile.json'
import enHome from '@/locales/en/home.json'
import enCreateQuestion from '@/locales/en/createQuestion.json'
import enPrefectures from '@/locales/en/prefectures.json'
import enTermOfService from '@/locales/en/termsOfService.json'
import enArticles from '@/locales/en/articles.json'
import enSupport from '@/locales/en/support.json'
import enReview from '@/locales/en/reviews.json'
import enPrivacy from '@/locales/en/privacy.json'
import enAbout from '@/locales/en/about.json'
import enValidation from '@/locales/en/validation.json'

import enAdmin from '@/locales/en/admin.json'
import enAdminDashboard from '@/locales/en/admin/dashboard.json'
import enAdminUsers from '@/locales/en/admin/users.json'
import enAdminLawyers from '@/locales/en/admin/lawyers.json'
import enAdminReviews from '@/locales/en/admin/reviews.json'
import enAdminAppointments from '@/locales/en/admin/appointments.json'
import enAdminQuestions from '@/locales/en/admin/questions.json'
import enLawyerHistory from '@/locales/en/lawyerHistory.json'

// Japanese
import jaCommon from '@/locales/ja/common.json'
import jaAuth from '@/locales/ja/auth.json'
import jaAnswers from '@/locales/ja/answers.json'
import jaQuestions from '@/locales/ja/questions.json'
import jaLawyers from '@/locales/ja/lawyers.json'
import jaAppointments from '@/locales/ja/appointments.json'
import jaErrors from '@/locales/ja/errors.json'
import jaProfile from '@/locales/ja/profile.json'
import jaHome from '@/locales/ja/home.json'
import jaCreateQuestion from '@/locales/ja/createQuestion.json'
import jaPrefectures from '@/locales/ja/prefectures.json'
import jaTermOfService from '@/locales/ja/termsOfService.json'
import jaArticles from '@/locales/ja/articles.json'
import jaSupport from '@/locales/ja/support.json'
import jaReview from '@/locales/ja/reviews.json'
import jaPrivacy from '@/locales/ja/privacy.json'
import jaAbout from '@/locales/ja/about.json'
import jaValidation from '@/locales/ja/validation.json'

import jaAdmin from '@/locales/ja/admin.json'
import jaAdminDashboard from '@/locales/ja/admin/dashboard.json'
import jaAdminUsers from '@/locales/ja/admin/users.json'
import jaAdminLawyers from '@/locales/ja/admin/lawyers.json'
import jaAdminReviews from '@/locales/ja/admin/reviews.json'
import jaAdminAppointments from '@/locales/ja/admin/appointments.json'
import jaAdminQuestions from '@/locales/ja/admin/questions.json'
import jaLawyerHistory from '@/locales/ja/lawyerHistory.json'

const resources = {
  en: {
    translation: {
      home: enHome,
      answers: enAnswers,
      common: enCommon,
      auth: enAuth,
      questions: enQuestions,
      lawyers: enLawyers,
      appointments: enAppointments,
      errors: enErrors,
      profile: enProfile,
      createQuestion: enCreateQuestion,
      prefectures: enPrefectures,
      admin: enAdmin,
      adminDashboard: enAdminDashboard,
      adminUsers: enAdminUsers,
      adminLawyers: enAdminLawyers,
      adminReviews: enAdminReviews,
      adminAppointments: enAdminAppointments,
      adminQuestions: enAdminQuestions,
      termsOfService: enTermOfService,
      articles: enArticles,
      privacy: enPrivacy,
      support: enSupport,
      reviews: enReview,
      about: enAbout,
      validation: enValidation,
      lawyerHistory: enLawyerHistory,
    }
  },
  ja: {
    translation: {
      home: jaHome,
      answers: jaAnswers,
      common: jaCommon,
      auth: jaAuth,
      questions: jaQuestions,
      lawyers: jaLawyers,
      appointments: jaAppointments,
      errors: jaErrors,
      profile: jaProfile,
      createQuestion: jaCreateQuestion,
      prefectures: jaPrefectures,
      admin: jaAdmin,
      adminDashboard: jaAdminDashboard,
      adminUsers: jaAdminUsers,
      adminLawyers: jaAdminLawyers,
      adminReviews: jaAdminReviews,
      adminAppointments: jaAdminAppointments,
      adminQuestions: jaAdminQuestions,
      articles: jaArticles,
      termsOfService: jaTermOfService,
      privacy: jaPrivacy,
      support: jaSupport,
      reviews: jaReview,
      about: jaAbout,
      validation: jaValidation,
      lawyerHistory: jaLawyerHistory,
    }
  }
}

// Initialize i18n
i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ja',
    fallbackLng: 'ja',
    supportedLngs: ['ja', 'en'],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })

export default i18n