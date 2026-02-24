import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import Modal from './common/Modal';
import { Button } from '@/components/ui/button';

interface CancelAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export default function CancelAppointmentModal({
  isOpen,
  onClose,
  onConfirm
}: CancelAppointmentModalProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError(t('appointments.reasonRequired'));
      return;
    }

    setError('');
    setIsSubmitting(true);
    
    try {
      await onConfirm(reason);
      setReason('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{t('appointments.cancelAppointmentTitle')}</h2>
        <p className="text-gray-600 mb-4">{t('appointments.cancelAppointmentDescription')}</p>
        
        <div className="mb-4">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            {t('appointments.cancellationReason')}
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
            placeholder={t('appointments.cancellationReasonPlaceholder')}
            className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            rows={4}
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('appointments.closeModalButton')}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {t('appointments.cancelAppointmentButton')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
