import { ApiResponse, ApiErrorResponse } from '@/lib/types';
import axiosInstance from '@/lib/api';

export interface SupportFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Submits a support contact form
 */
export async function submitSupportForm(data: SupportFormData): Promise<ApiResponse<void>> {
  const response = await axiosInstance.post('/support/contact', data);
  return response.data;
}

// Create a default export for the support service
const supportService = {
  submitSupportForm
};

export default supportService;
