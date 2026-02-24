export type NotificationType = 
  | 'appointment_created' 
  | 'appointment_updated'
  | 'appointment_cancelled'
  | 'question_answered'
  | 'answer_accepted'
  | 'review_created'
  | 'message_received'
  | 'system';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  data?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface NotificationCreateRequest {
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

export interface NotificationSearchParams {
  is_read?: boolean;
  type?: NotificationType;
  page?: number;
  limit?: number;
} 