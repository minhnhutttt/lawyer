"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/common/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/types/users";
import { updateUser } from "@/lib/services";

// Define the Zod schema for validation with i18n
const createEditProfileSchema = (t: (key: string) => string) =>
  z.object({
    // Email is no longer included in validation as it's not editable
    nickname: z.string()
      .min(1, { message: t("validation.nickname.required") })
      .max(50, { message: t("validation.nickname.maxLength") }),
    age_group: z.enum(["10代", "20代", "30代", "40代", "50代以上"]).optional(),
    gender: z.enum(["male", "female"]).optional().nullable(),
  });

// Define the component's props
interface EditProfileFormProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export default function EditProfileForm({ user, onUpdate }: EditProfileFormProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const formSchema = createEditProfileSchema(t);

  type EditProfileFormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Email is still needed as display value but not for validation
      nickname: user.nickname || "",
      age_group: user.age_group || undefined,
      gender: user.gender || null,
    },
  });

  const onSubmit = async (data: EditProfileFormData) => {
    try {
      const response = await updateUser(user.id, {
        // Email is no longer included in the update request
        nickname: data.nickname,
        age_group: data.age_group,
        gender: data.gender,
      });

      if (response.data) {
        toast.success(t("profile.updateSuccess"));
        onUpdate(response.data); // Notify parent component of the update
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      
      // Handle specific error cases
      if (error.response?.data?.message?.includes("email already exists")) {
        toast.error(t("validation.email.unique", "Email address is already in use"));
      } else if (error.response?.data?.errors) {
        // Handle validation errors from the API
        const errorMessages = Object.values(error.response.data.errors).flat();
        toast.error(errorMessages.join("\n"));
      } else {
        toast.error(t("errors.unexpectedError"));
      }
    }
  };

  const ageGroupOptions = [
    { value: "10代", label: t("profile.ageGroup10s")},
    { value: "20代", label: t("profile.ageGroup20s")},
    { value: "30代", label: t("profile.ageGroup30s")},
    { value: "40代", label: t("profile.ageGroup40s")},
    { value: "50代以上", label: t("profile.ageGroup50plus")}
  ];

  const genderOptions = [
    { value: "male", label: t("profile.male") },
    { value: "female", label: t("profile.female") },
  ];

  const labelClassName = "block text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1">
        <label htmlFor="email" className={labelClassName}>
          {t("profile.email")}
        </label>
        <Input 
          id="email" 
          type="email" 
          value={user.email || ""}
          disabled={true} 
          className="bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="nickname" className={labelClassName}>
          {t("profile.nickname")} <span className="text-red-500 ml-1">*</span>
        </label>
        <Input id="nickname" type="text" {...register("nickname")} />
        {errors.nickname && <p className="mt-1 text-sm text-red-600">{errors.nickname.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="age_group" className={labelClassName}>{t("profile.ageGroup")}</label>
        <select
          id="age_group"
          {...register("age_group")}
          className="block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-primary focus:border-primary transition-all sm:text-sm"
        >
          {ageGroupOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.age_group && <p className="mt-1 text-sm text-red-600">{errors.age_group.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="gender" className={labelClassName}>{t("profile.gender")}</label>
        <select
          id="gender"
          {...register("gender")}
          className="block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-primary focus:border-primary transition-all sm:text-sm"
        >
          {genderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("profile.processing") : t("profile.save")}
        </Button>
      </div>
    </form>
  );
}