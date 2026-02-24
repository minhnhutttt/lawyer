import {ApiResponse} from "@/lib/types";
import {get} from "@/lib/api";

export interface Attachment {
    id: number;
    file_name: string;
    file_size: number;
    file_type: string;
    file_path: string;
    appointment_id?: number;
    chat_message_id?: number;
    uploaded_by: number;
    created_at: string;
    updated_at: string;
}

export async function getAttachmentURL(id: number): Promise<ApiResponse<string>> {
    return get(`/attachments/${id}`);
}