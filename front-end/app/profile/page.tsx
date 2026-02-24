"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/common/Toast";
import { useAuthStore } from "@/store/auth-store";
import {
  getMyLawyerProfile,
  getLawyerReviews,
  getUserById,
  updateUser,
  updateUserPassword,
  updateUserProfileImage,
  uploadLawyerCertification,
  updateLawyer,
} from "@/lib/services";
import { User, UpdateUserRequest } from "@/lib/types/users";
import { Lawyer } from "@/lib/types/lawyers";
import { Review } from "@/lib/types/reviews";
import { PaginationMeta } from "@/lib/types";
import ProfileHeader from "@/components/profile/ProfileHeader";
import EditProfileForm from "@/components/profile/EditProfileForm";
import LawyerProfileForm from "@/components/profile/LawyerProfileForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import LawyerAvailabilityForm from "@/components/profile/LawyerAvailabilityForm";
import ProfileReviewsTab from "@/components/profile/ProfileReviewsTab";
import AppointmentsTab from "@/components/profile/AppointmentsTab";
import MyQuestionsTab from "@/components/profile/MyQuestionsTab";

export default function ProfilePage() {
  const { t } = useTranslation();
  const toast = useToast();
  const { user: authUser } = useAuthStore();
  const searchParams = useSearchParams();
  
  // Get tab from URL or default to 'edit'
  const activeTab = searchParams.get('tab') || 'edit';

  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UpdateUserRequest>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittingPassword, setSubmittingPassword] = useState(false);

  const [lawyerData, setLawyerData] = useState<Lawyer | null>(null);
  const [certificationUploading, setCertificationUploading] = useState(false);

  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const [availabilityData, setAvailabilityData] = useState<Record<string, { start: string; end: string }[]>>(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  );
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [submittingAvailability, setSubmittingAvailability] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [reviewPagination, setReviewPagination] = useState<PaginationMeta>({
    page: 1,
    page_size: 4,
    total_items: 0,
    total_pages: 0,
  });

  const fetchProfileData = async (userId: number) => {
    try {
      const userResponse = await getUserById(userId);
      if (!userResponse.data) {
        toast.error(t("profile.userNotFound"));
        return;
      }
      const fetchedUser = userResponse.data;
      setUser(fetchedUser);
      setFormData({
        email: fetchedUser.email,
        nickname: fetchedUser.nickname || "",
        age_group: fetchedUser.age_group || undefined,
        gender: fetchedUser.gender || undefined,
        role: fetchedUser.role,
      });

      if (fetchedUser.role === "lawyer") {
        const lawyerResponse = await getMyLawyerProfile();
        if (lawyerResponse.data) {
          setLawyerData(lawyerResponse.data);
          if (lawyerResponse.data.availability) {
            setAvailabilityData(lawyerResponse.data.availability);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(t("errors.unexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser?.id) {
      fetchProfileData(Number(authUser.id));
    } else {
      setLoading(false);
    }
  }, [authUser?.id, t]);

  const fetchLawyerReviews = async () => {
    if (!lawyerData?.id) return;
    setLoadingReviews(true);
    try {
      const response = await getLawyerReviews(lawyerData.id, {
        page: reviewPagination.page,
        limit: reviewPagination.page_size,
      });
      if (response.data) setReviews(response.data);
      if (response.pagination) setReviewPagination(response.pagination);
    } catch (error: any) {
      console.error("Error fetching lawyer reviews:", error);
      toast.error(t("reviews.fetchError"));
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (lawyerData?.id) {
      fetchLawyerReviews();
    }
  }, [lawyerData?.id, reviewPagination.page]);

  const handleReviewPageChange = (page: number) => {
    setReviewPagination((prev) => ({ ...prev, page }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email?.trim()) newErrors.email = t("validation.email.required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t("validation.email.invalid");
    if (!formData.nickname?.trim()) newErrors.nickname = t("validation.nickname.required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user) return;
    setSubmitting(true);
    try {
      await updateUser(user.id, formData);
      toast.success(t("profile.updateSuccess"));
      const response = await getUserById(user.id);
      if (response.data) setUser(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(t("errors.unexpectedError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (data: { current_password: string; new_password: string; confirm_password: string }) => {
    if (!user) return { success: false, error: t("profile.userNotFound") };
    
    setSubmittingPassword(true);
    try {
      await updateUserPassword(user.id, {
        current_password: data.current_password,
        new_password: data.new_password,
      });
      toast.success(t("profile.passwordUpdateSuccess"));
      return { success: true };
    } catch (error: any) {
      console.error("Error updating password:", error);
      
      // Get the error code if available
      const error_code = error.code || 'unknown';
      const errorMessage = error.response?.data?.message || t("errors.unexpectedError");

      // Don't show toast error since we'll display it in the form
      return { 
        success: false, 
        error: errorMessage,
        error_code: error_code
      };
    } finally {
      setSubmittingPassword(false);
    }
  };

  const handleAvailabilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAvailability(true);
    try {
      await updateLawyer(lawyerData!.id, { availability: availabilityData });
      toast.success(t("profile.updateAvailabilitySuccess"));
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error(t("errors.unexpectedError"));
    } finally {
      setSubmittingAvailability(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    // Check file size - 3MB limit (3 * 1024 * 1024 bytes)
    const maxSize = 3 * 1024 * 1024; // 3MB in bytes
    if (file.size > maxSize) {
      toast.error(t("profile.fileSizeError"));
      return;
    }
    
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await updateUserProfileImage(formData);
      if (response.data) {
        setUser((prev) => (prev ? { ...prev, profile_image: response.data.profile_image } : null));
        toast.success(t("profile.imageUpdated"));
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error(t("profile.imageUploadError"));
    } finally {
      setImageUploading(false);
    }
  };

  const handleCertificationUpload = async (file: File) => {
    if (!file || !lawyerData?.id) return;
    setCertificationUploading(true);
    try {
      const formData = new FormData();
      formData.append("certification", file);
      const response = await uploadLawyerCertification(lawyerData.id, formData);
      if (response.data) {
        setLawyerData((prev) => (prev ? { ...prev, ...response.data } : null));
        toast.success(t("profile.certificationUpdated"));
      }
    } catch (error) {
      console.error("Error uploading certification document:", error);
      toast.error(t("profile.documentUploadError"));
    } finally {
      setCertificationUploading(false);
    }
  };

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>{t("profile.userNotFound")}</p>
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          {t("profile.signIn")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("profile.myProfile")}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <ProfileHeader 
            user={user} 
            t={t} 
            onImageUpload={user.role === 'lawyer' ? handleImageUpload : undefined} 
            isUploading={imageUploading} 
          />
        </div>
        <div className="md:w-2/3">
          <Tabs defaultValue={activeTab}>
            <TabsList className={`grid ${user.role === "lawyer" ? "grid-cols-5" : (user.role === "client" || user.role === "admin" ? "grid-cols-4" : "grid-cols-3")} mb-8`}>
              <TabsTrigger value="edit">{t("profile.editProfile")}</TabsTrigger>
              <TabsTrigger value="password">{t("profile.updatePassword")}</TabsTrigger>
              <TabsTrigger value="appointments" className="relative">
                {t("appointments.title")}
                {authUser?.has_new_appointment === true && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-600 rounded-full"></span>
                )}
              </TabsTrigger>
              {user.role !== "lawyer" && <TabsTrigger value="questions">{t("profile.myQuestions")}</TabsTrigger>}
              {user.role === "lawyer" && <TabsTrigger value="availability">{t("profile.lawyerAvailability")}</TabsTrigger>}
              {user.role === "lawyer" && <TabsTrigger value="reviews">{t("profile.reviews")}</TabsTrigger>}
            </TabsList>

            <TabsContent value="edit">
              {user.role === "lawyer" && lawyerData ? (
                <LawyerProfileForm
                  user={user}
                  lawyerData={lawyerData}
                  onCertificationDocUpload={handleCertificationUpload}
                  certificationDocUrl={lawyerData.certification_document_path}
                  onUpdate={handleProfileUpdate}
                />
              ) : (
                <EditProfileForm
                  user={user}
                  onUpdate={handleProfileUpdate}
                />
              )}
            </TabsContent>

            <TabsContent value="password">
              <ChangePasswordForm
                onSubmit={handlePasswordSubmit}
                submittingPassword={submittingPassword}
                t={t}
              />
            </TabsContent>

            <TabsContent value="appointments">
              <AppointmentsTab />
            </TabsContent>

            {user.role === "lawyer" && (
              <TabsContent value="availability">
                <LawyerAvailabilityForm
                  daysOfWeek={daysOfWeek}
                  availabilityData={availabilityData}
                  setAvailabilityData={setAvailabilityData}
                  availabilityError={availabilityError}
                  submittingAvailability={submittingAvailability}
                  handleAvailabilitySubmit={handleAvailabilitySubmit}
                  t={t}
                />
              </TabsContent>
            )}

            {user.role === "lawyer" && (
              <TabsContent value="reviews">
                <ProfileReviewsTab
                  reviews={reviews}
                  loadingReviews={loadingReviews}
                  pagination={reviewPagination}
                  onPageChange={handleReviewPageChange}
                  averageRating={lawyerData?.average_rating}
                  t={t}
                />
              </TabsContent>
            )}
            
            {user.role !== "lawyer" && (
              <TabsContent value="questions">
                <MyQuestionsTab />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}