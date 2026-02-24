import { get, post, put } from '../api'
import { Notification, NotificationSearchParams } from '../types/notifications'
import { ApiResponse } from '../types/api'

// Get all notifications for the current user
export async function getNotifications(params?: NotificationSearchParams): Promise<ApiResponse<Notification[]>> {
  return get('/notifications', { params })
}

// Mark a notification as read
export async function markNotificationAsRead(id: number): Promise<ApiResponse<Notification>> {
  return put(`/notifications/${id}/read`, {})
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(): Promise<ApiResponse<{ message: string }>> {
  return put('/notifications/read-all', {})
}

export default {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} 