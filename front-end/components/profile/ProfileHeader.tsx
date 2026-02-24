import React, { useRef } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {getFullName, getUserInitials} from "@/lib/types/users";
import { Camera } from "lucide-react";

type ProfileHeaderProps = {
  user: any;
  t: (key: string, opts?: any) => string;
  onImageUpload?: (file: File) => void;
  isUploading?: boolean;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, t, onImageUpload, isUploading = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (!onImageUpload) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload(file);
    }
  };
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 relative group w-24 h-24">
          {user.role === 'lawyer' ? (
            <>
              <img
                src={user?.profile_image ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt={getFullName(user)}
                className={`h-24 w-24 rounded-full object-cover mx-auto ${onImageUpload ? 'cursor-pointer' : ''} ${isUploading ? 'opacity-50' : ''}`}
                onClick={handleImageClick}
              />

              {onImageUpload && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-200 pointer-events-none"
                  >
                    <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </>
              )}

              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                </div>
              )}
            </>
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-medium">
              {getUserInitials(user)}
            </div>
          )}
        </div>

        <CardTitle>{getFullName(user)}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default ProfileHeader;
