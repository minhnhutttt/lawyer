import {Appointment, getFullName} from '@/lib/types';
import i18next from 'i18next';

/**
 * Generates a formatted appointment title using translations from the appointments namespace
 * - English: "Consultation with {lawyerName}"
 * - Japanese: "{lawyerName}弁護士との面談"
 *
 * @param appointment The appointment object containing lawyer information
 * @param isLawyerName
 * @returns Formatted appointment title string based on current language
 */
export function getAppointmentTitle(appointment: Appointment, isLawyerName = true): string {
  if (!appointment || !appointment.lawyer || !appointment.lawyer.full_name) {
    return i18next.t('appointments.consultationWith');
  }
  if (!isLawyerName) {
    return i18next.t('appointments.appointmentTitleFormat', {
      lawyerName: appointment.lawyer.full_name
    });
  }

  return i18next.t('appointments.appointmentTitleFormat', {
    lawyerName: getFullName(appointment.client)
  });
}
