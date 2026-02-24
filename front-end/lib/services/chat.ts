import { get, post, patch, del } from '../api';
import { ApiResponse } from '@/lib/types';
import {Attachment} from "@/lib/services/attachement";

export interface ChatMessage {
  id: number;
  appointment_id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  read: boolean;
  attachment?: Attachment;
  created_at: string;
  updated_at: string;
}

export interface CreateChatMessageRequest {
  appointment_id: number;
  receiver_id: number;
  content: string;
}

export async function getChatMessages(appointmentId: number): Promise<ApiResponse<ChatMessage[]>> {
  return get(`/chats/appointment/${appointmentId}`);
}

export async function createChatMessage(
    data: CreateChatMessageRequest
): Promise<ApiResponse<ChatMessage>> {
  return post(`/chats/appointment/${data.appointment_id}`, data);
}

export async function markMessageAsRead(messageId: number): Promise<ApiResponse<any>> {
  return patch(`/chats/${messageId}/read`);
}

export async function deleteChatMessage(messageId: number): Promise<ApiResponse<any>> {
  return del(`/chats/${messageId}`);
}

export async function getUnreadMessageCount(): Promise<ApiResponse<{ count: number }>> {
  return get('/chats/unread-count');
}

export async function sendChatAttachment(
  appointmentId: number,
  file: File,
  receiverId: number
): Promise<ApiResponse<ChatMessage>> {
  const form = new FormData();
  form.append('file', file);
  form.append('receiver_id', receiverId.toString());

  return post(
      `/chats/appointment/${appointmentId}/attachment`,
      form,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
  );
}

export default {
  getChatMessages,
  createChatMessage,
  markMessageAsRead,
  deleteChatMessage,
  getUnreadMessageCount,
  sendChatAttachment,
};
