'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFileUpload } from 'react-icons/fa';
import PageHeader from '../../components/common/PageHeader';
import Section from '../../components/common/Section';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/common/Toast';
import { submitSupportForm } from '@/lib/services/support';
import { useAuthStore } from '@/store/auth-store';

export default function SupportPage() {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { user } = useAuthStore();

  // Pre-fill form with user data if available
  React.useEffect(() => {
    if (user) {
      if (user.role === 'lawyer' && user.first_name && user.last_name) {
        setName(`${user.last_name} ${user.first_name}`);
      } else if (user.nickname) {
        setName(user.nickname);
      }
      
      if (user.email) {
        setEmail(user.email);
      }
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !message) {
      toast.error(t('support.validation.allFieldsRequired'));
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t('support.validation.invalidEmail'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitSupportForm({ name, email, message });
      
      // Reset form after successful submission
      setMessage('');
      if (!user) {
        setName('');
        setEmail('');
      }
      
      toast.success(t('support.messageSent'));
    } catch (error) {
      toast.error(t('support.errorSending'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqItems = [
    {
      title: t('support.faq1Title'),
      content: t('support.faq1Content')
    },
    {
      title: t('support.faq2Title'),
      content: t('support.faq2Content')
    },
    {
      title: t('support.faq3Title'),
      content: t('support.faq3Content')
    },
    {
      title: t('support.faq4Title'),
      content: t('support.faq4Content')
    },
    {
      title: t('support.faq5Title'),
      content: t('support.faq5Content')
    }
  ];

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <PageHeader
        title={t('support.title')}
        description={t('support.subtitle')}
      />

      {/* Contact Form */}
      <Section className="mb-8">
        <div className="mb-6">
          <p className="text-gray-600 text-sm">{t('support.generalUserSubtitle')}</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {t('support.name')}
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('support.email')}
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              {t('support.message')}
            </label>
            <textarea
              id="message"
              rows={6}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 px-4"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {isSubmitting ? t('common.submitting') : t('support.submit')}
            </Button>
          </div>
        </form>
      </Section>

      {/* FAQ Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Section>
          <h2 className="text-xl font-bold mb-4">{t('support.faq')}</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <details key={index} className="border border-gray-200 rounded-md">
                <summary className="px-4 py-3 cursor-pointer font-medium bg-gray-50 hover:bg-gray-100">
                  {item.title}
                </summary>
                <div className="p-4 bg-white">
                  <p className="text-gray-700">
                    {item.content}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </Section>

        <div className="space-y-8">
          {/* Business Hours */}
          <Section>
            <h2 className="text-xl font-bold mb-4">{t('support.businessHours')}</h2>
            <div className="flex items-start space-x-3">
              <div className="mt-1 text-primary-600">
                <div className="w-4 h-4 rounded-full border-2 border-primary-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                </div>
              </div>
              <div>
                <p className="font-medium">{t('support.businessHoursContent')}</p>
              </div>
            </div>
          </Section>

          {/* Contact Information */}
          <Section>
            <h2 className="text-xl font-bold mb-4">{t('support.contactInfo')}</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaEnvelope className="mt-1 mr-3 text-gray-600" />
                <span>support@legaljapan.com</span>
              </li>
              <li className="flex items-start">
                <FaPhone className="mt-1 mr-3 text-gray-600" />
                <span>03-1234-5678</span>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-gray-600" />
                <span>〒150-0002 東京都渋谷区渋谷2-24-12 渋谷スクランブルスクエア</span>
              </li>
            </ul>
          </Section>
        </div>
      </div>
    </main>
  );
}
