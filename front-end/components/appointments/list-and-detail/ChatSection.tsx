"use client";

import { useEffect, useState, useRef } from "react";
import { getChatMessages, createChatMessage, sendChatAttachment, markMessageAsRead } from "@/lib/services/chat";
import { Attachment, getAttachmentURL } from "@/lib/services/attachement";
import {Appointment, User} from "@/lib/types";
import { FiPaperclip, FiFile, FiX, FiInfo } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

type ChatMessage = {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  attachment?: Attachment;
  read: boolean;
};

interface ChatSectionProps {
  appointment: Appointment;
  currentUser: User;
  readOnly?: boolean;
}

export default function ChatSection({
  appointment,
  currentUser,
  readOnly = false,
  initialMessages = [],
}: ChatSectionProps & { initialMessages?: ChatMessage[] }) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showFileInfo, setShowFileInfo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if there are any messages (chat history)
  const hasChatHistory = messages && messages.length > 0;
  
  // Determine which alert message to display based on conditions
  const getAlertMessage = () => {
    // Check lawyer inactive status (priority 1)
    if (appointment.lawyer?.user_active === false) {
      return t("appointments.chat.lawyerInactive");
    }
    
    // Check client inactive status (priority 1)
    if (appointment.client?.is_active === false) {
      return t("appointments.chat.clientInactive");
    }
    
    // Check chat disabled (priority 2)
    if (!appointment.chat_enabled) {
      return t("appointments.chat.chatDisabled");
    }
    
    return null;
  };
  
  // Get the alert message if any condition is met
  const alertMessage = getAlertMessage();
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await getChatMessages(appointment.id);
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(t("appointments.chat.errorLoadingMessages"));
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [appointment.id]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    
    // Mark unread messages from other users as read
    markUnreadMessagesAsRead();
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      
      if (file.size > maxSize) {
        setError(t("appointments.chat.fileTooLarge", { maxSize: "5MB" }));
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setSelectedFile(file);
        setError(""); // Clear any previous errors
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const markUnreadMessagesAsRead = async () => {
    try {
      // Filter messages that are from other users and not read yet
      const unreadMessages = messages.filter(
        (msg) => msg.sender_id !== currentUser.id && !msg.read
      );
      
      // Mark each unread message as read
      for (const msg of unreadMessages) {
        await markMessageAsRead(msg.id);
      }
      
      // Update local state to reflect that messages are now read
      if (unreadMessages.length > 0) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => 
            msg.sender_id !== currentUser.id ? { ...msg, read: true } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleUploadFile = async (selectedFile: File, receiverId: number): Promise<ChatMessage | null> => {
    try {
      setIsUploading(true);
      const res = await sendChatAttachment(appointment.id, selectedFile, receiverId);
      return res.data;
    } catch (err) {
      console.error("Error uploading file:", err);
      setError(t("appointments.chat.errorUploadingFile"));
      return null;
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSendMessage = async () => {
    const receiverId =
      currentUser.id === appointment.lawyer.user_id
        ? appointment.user_id
        : appointment.lawyer.user_id;
    try {
      let msg: ChatMessage | null = null;
      if (newMessage.trim() !== "") {
        msg = (await createChatMessage({
          appointment_id: appointment.id,
          receiver_id: receiverId,
          content: newMessage,
        })).data;
      }
      let attachmentMsg: ChatMessage | null = null;
      if (selectedFile) {
        attachmentMsg = await handleUploadFile(selectedFile, receiverId);
      }
      if (msg) {
        setMessages(prev =>
          Array.isArray(prev) ? [...prev, msg] : [msg]
        );
        setNewMessage("");
      }
      if (attachmentMsg) {
        setMessages(prev =>
          Array.isArray(prev) ? [...prev, attachmentMsg] : [attachmentMsg]
        );
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(t("appointments.chat.errorSendingMessage"));
    }
  };
  console.log(messages);
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">{t("appointments.chat.title")}</h3>
      <div
        className="border rounded-md p-4 h-80 overflow-y-auto bg-gray-50"
        ref={containerRef}
      >
        {!hasChatHistory && alertMessage ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-gray-600 text-center">{alertMessage}</p>
          </div>
        ) : (
          messages && messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 flex ${
              msg.sender_id === currentUser.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`inline-block rounded-lg px-3 py-2 max-w-[70%] break-words ${
                msg.sender_id === currentUser.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {msg.content}
              {msg.attachment && (
                <div className="mt-2 flex items-center">
                  <FiFile className="h-4 w-4 mr-1" />
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      try {
                        const response = await getAttachmentURL(msg.attachment?.id ?? 0);
                        window.open(response.data, '_blank');
                      } catch (err) {
                        console.error("Error fetching attachment URL:", err);
                        setError(t("appointments.chat.errorOpeningAttachment"));
                      }
                    }} 
                    className="underline text-sm text-left p-0 h-auto"
                  >
                    {msg.attachment.file_name} ({(msg.attachment.file_size / 1024).toFixed(2)} {t("appointments.chat.fileSize")})
                  </Button>
                </div>
              )}
            </div>
          </div>
        )))
        }
      </div>
      {error && <p className="mt-2 text-red-600">{error}</p>}
      {alertMessage && hasChatHistory && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-center">
          <p className="text-sm text-gray-600">{alertMessage}</p>
        </div>
      )}
      {!alertMessage && !readOnly && (
        <div className="mt-4">
          {selectedFile && (
            <div className="mb-2 p-2 bg-gray-100 rounded flex items-center justify-between">
              <div className="flex items-center">
                <FiFile className="h-5 w-5 mr-2 text-gray-600" />
                <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                <span className="text-xs text-gray-500 ml-2">({(selectedFile.size / 1024).toFixed(2)} {t("appointments.chat.fileSize")})</span>
              </div>
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="text-gray-500 hover:text-gray-700 p-0 h-auto"
                aria-label={t("appointments.chat.removeFile")}
              >
                <FiX className="h-5 w-5" />
              </Button>
            </div>
          )}
          <div className="flex">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t("appointments.chat.messagePlaceholder")}
              className="flex-grow border rounded-l-md px-3 py-2 focus:outline-none resize-none min-h-[40px] max-h-[120px] overflow-y-auto"
              disabled={isUploading}
              rows={1}
              style={{ lineHeight: '1.5', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
              }}
            />
            <div className="flex flex-col w-12">  
              <label htmlFor="fileInput" className="bg-gray-200 h-12 w-12 cursor-pointer border-b border-gray-300 flex items-center justify-center">
                <FiPaperclip className="h-5 w-5 text-gray-500" />
                <input
                  id="fileInput"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </label>
              <div className="relative group bg-gray-200 h-12 w-12 flex items-center justify-center border-b border-gray-300">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto"
                  aria-label={t("appointments.chat.fileInfoLabel")}
                >
                  <FiInfo className="h-4 w-4 text-gray-500" />
                </Button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-white shadow-lg rounded border text-sm text-gray-700 w-64 z-10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
                  <p>{t("appointments.chat.allowedFileTypes")}:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>{t("appointments.chat.documentFiles")}: PDF, DOC, DOCX</li>
                    <li>{t("appointments.chat.imageFiles")}: JPG, JPEG, PNG</li>
                  </ul>
                  <p className="mt-1">{t("appointments.chat.maxFileSize")}: 5MB</p>
                </div>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={handleSendMessage}
              className="rounded-l-none"
              disabled={isUploading}
              isLoading={isUploading}
            >
              {isUploading ? t("appointments.chat.uploading") : t("appointments.chat.send")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );

}
