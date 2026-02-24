"use client";

import React, { useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, Controller, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/common/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/types/users";
import { Lawyer } from "@/lib/types/lawyers";
import { updateUser, updateLawyer } from "@/lib/services";
import { useAuthStore } from "@/store/auth-store";
import DatePickerField from "@/components/common/DatePickerField";
import {MultiSelect} from "@/components/ui";
import { LAWYER_SPECIALTIES } from "@/lib/types/enums";
import FileUploadField from "@/components/common/FileUploadField";

interface LawyerProfileFormProps {
  user: User;
  lawyerData: Lawyer;
  onCertificationDocUpload: (file: File) => Promise<void>;
  certificationDocUrl?: string;
  onUpdate?: (updatedUser: User) => void;
}

const createLawyerProfileSchema = (t: (key: string) => string) => {
  // Function to check if a date is at least 20 years ago
  const isOver20YearsOld = (dateStr: string) => {
    if (!dateStr || dateStr === "") return false;
    const birthDate = new Date(dateStr);
    // Check if date is valid
    if (isNaN(birthDate.getTime())) return false;
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 20;
  };
  
  // Function to validate file type and size
  const validateFileType = (file: File | null | undefined) => {
    if (!file) return true; // Optional during edit if already uploaded
    
    // Check file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return false;
    }
    
    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return false;
    }
    
    return true;
  };
  
  return z.object({
    email: z.string()
      .email({ message: t("validation.email.invalid") })
      .optional()
      .or(z.literal("").optional()),  // Keep in schema for type compatibility but optional
    
    first_name: z.string()
      .min(1, { message: t("validation.firstName.required") })
      .max(50, { message: t("validation.firstName.maxLength") }),
    
    last_name: z.string()
      .min(1, { message: t("validation.lastName.required") })
      .max(50, { message: t("validation.lastName.maxLength") }),
    
    birth_date: z.string()
      .refine(val => val !== null && val !== "", { 
        message: t("validation.birthDate.required") 
      })
      .refine(isOver20YearsOld, { 
        message: t("validation.birthDate.ageRestriction") 
      }),
    
    gender: z.string().nullable(),
    
    phone: z.string()
      .min(1, { message: t("validation.phone.required") })
      .regex(/^[0-9]{10,11}$/, { message: t("validation.phone.format") }),
    
    fax_number: z.string()
      .regex(/^[0-9]{10,11}$/, { message: t("validation.fax.format") })
      .optional()
      .or(z.literal("").transform(() => undefined)),

    lawyer_registration_number: z.string()
      .min(1, { message: t("validation.registrationNumber.required") })
      .regex(/^[0-9]{5}$/, { message: t("validation.registrationNumber.format") }),
    
    affiliation: z.string()
      .min(1, { message: t("validation.affiliation.required") })
      .max(100, { message: t("validation.affiliation.maxLength") }),
    
    office_name: z.string()
      .min(1, { message: t("validation.officeName.required") })
      .max(100, { message: t("validation.officeName.maxLength") }),
    
    office_address: z.string()
      .min(1, { message: t("validation.officeAddress.required") })
      .max(200, { message: t("validation.officeAddress.maxLength") }),
    
    experience_years: z.string()
      .min(1, { message: t("validation.experienceYears.required") })
      .regex(/^\d+$/, { message: t("validation.experienceYears.format") }),
    
    specialties: z.array(z.string())
      .min(1, { message: t("validation.specialties.required") }),
    
    profile_text: z.string()
      .min(1, { message: t("validation.profileText.required") }),
    
    areas_of_expertise: z.string().optional(),
    
    notes: z.string()
      .max(1000, { message: t("validation.notes.maxLength") })
      .optional(),
    
    certification_document: z.instanceof(File)
      .refine(file => validateFileType(file), {
        message: t("validation.certificationDocument.fileType")
      })
      .nullable()
      .optional(),
  });
};

const formatKeyAsLabel = (key: string): string => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function LawyerProfileForm({
                                            user,
                                            lawyerData,
                                            onCertificationDocUpload,
                                            certificationDocUrl,
                                            onUpdate,
                                          }: LawyerProfileFormProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const { updateUserData } = useAuthStore();
  const formSchema = createLawyerProfileSchema(t);

  type LawyerProfileFormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LawyerProfileFormData>({
    resolver: zodResolver(formSchema),
    // Initial default values are set here, but they will be updated by `reset`
    defaultValues: {
      email: user.email || "", // Keep email in defaultValues for type compatibility
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      birth_date: user.birth_date || "",
      gender: user.gender || null,
      phone: lawyerData.phone_number || user.phone || "",
      fax_number: "",
      lawyer_registration_number: "",
      affiliation: "",
      office_name: "",
      office_address: "",
      experience_years: "",
      specialties: [],
      notes: "",
    },
  });

  // FIX: Add a useEffect to reset the form when async data arrives
  useEffect(() => {
    if (lawyerData) {
      const formValues = {
        email: user.email || "", // Keep email in formValues for type compatibility
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        // Ensure birth_date is a string, not null
        birth_date: user.birth_date || "",
        gender: user.gender || null,
        phone: lawyerData.phone_number || user.phone || "",
        fax_number: lawyerData.fax_number || "",
        lawyer_registration_number: lawyerData.lawyer_registration_number || "",
        affiliation: lawyerData.affiliation || "",
        office_name: lawyerData.office_name || "",
        office_address: lawyerData.address || "",
        experience_years: lawyerData.experience_years ? String(lawyerData.experience_years) : "",
        specialties: lawyerData.specialties || [],
        profile_text: lawyerData.profile_text || "",
        areas_of_expertise: lawyerData.areas_of_expertise || "",
        notes: user.notes || "",
        certification_document: null,
      };
      reset(formValues); // Reset the form with the fetched data
    }
  }, [lawyerData, user, reset]);


  const onSubmit = async (data: LawyerProfileFormData) => {
    try {
      // Store the API responses
      const userResponse = await updateUser(user.id, {
        // Email deliberately excluded from update request since it shouldn't be changeable
        first_name: data.first_name,
        last_name: data.last_name,
        birth_date: data.birth_date ?? undefined,
        gender: data.gender as "male" | "female" | null,
        phone: data.phone,
        notes: data.notes,
      });
      
      const lawyerResponse = await updateLawyer(lawyerData.id, {
        full_name: `${data.last_name} ${data.first_name}`,
        office_name: data.office_name,
        specialties: data.specialties || [],
        affiliation: data.affiliation,
        lawyer_registration_number: data.lawyer_registration_number,
        profile_text: data.profile_text,
        // Email deliberately excluded from lawyer update request since it shouldn't be changeable
        address: data.office_address,
        phone: data.phone,
        fax_number: data.fax_number,
        areas_of_expertise: data.areas_of_expertise,
        experience_years: data.experience_years ? parseInt(data.experience_years, 10) : undefined,
        notes: data.notes,
      });
      
      if (data.certification_document) {
        await onCertificationDocUpload(data.certification_document);
      }
      
      // Update the auth store so Header component shows updated name
      const updatedUser = {
        ...user,
        first_name: data.first_name,
        last_name: data.last_name
      };
      updateUserData(updatedUser);
      
      // Also update parent component state if callback exists
      if (onUpdate) {
        onUpdate(updatedUser);
      }
      
      toast.success(t("profile.lawyerUpdateSuccess"));
    } catch (error) {
      console.error("Error updating lawyer profile:", error);
      toast.error(t("errors.unexpectedError"));
    }
  };

  const specialtiesOptions = LAWYER_SPECIALTIES.map((specialty) => ({
    label: t(`common.specialties.${specialty}`, formatKeyAsLabel(specialty)),
    value: specialty,
  }));

  const labelClassName = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="last_name" className={labelClassName}>{t("profile.lastName")} <span className="text-red-500">*</span></label>
          <Input id="last_name" {...register("last_name")} />
          {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
        </div>
        <div>
          <label htmlFor="first_name" className={labelClassName}>{t("profile.firstName")} <span className="text-red-500">*</span></label>
          <Input id="first_name" {...register("first_name")} />
          {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className={labelClassName}>{t("profile.email")}</label>
          <Input 
            id="email" 
            type="email" 
            value={user.email || ""}
            disabled={true} 
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClassName}>{t("profile.phone")} <span className="text-red-500">*</span></label>
          <Input id="phone" {...register("phone")} />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="fax_number" className={labelClassName}>{t("profile.fax", "Fax Number")}</label>
          <Input id="fax_number" {...register("fax_number")} />
          {errors.fax_number && <p className="text-red-500 text-sm mt-1">{errors.fax_number.message}</p>}
        </div>
        <div>
          <label htmlFor="birth_date" className={labelClassName}>{t("profile.birthDate")} <span className="text-red-500">*</span></label>
          <Controller
            name="birth_date"
            control={control}
            render={({ field }) => (
              <DatePickerField
                id="birth_date"
                name={field.name}
                value={field.value}
                onChange={(date: Date | null) => field.onChange(date ? date.toISOString().split("T")[0] : null)}
                maxDate={new Date()}
              />
            )}
          />
          {errors.birth_date && <p className="text-red-500 text-sm mt-1">{errors.birth_date.message}</p>}
        </div>
        <div>
          <label htmlFor="gender" className={labelClassName}>{t("profile.gender")}</label>
          <select id="gender" {...register("gender")} className="w-full p-2 border border-gray-300 rounded-md focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
            <option value="male">{t("profile.male")}</option>
            <option value="female">{t("profile.female")}</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
        </div>
        <div>
          <label htmlFor="lawyer_registration_number" className={labelClassName}>{t("profile.registrationNumber")} <span className="text-red-500">*</span></label>
          <Input id="lawyer_registration_number" {...register("lawyer_registration_number")} />
          {errors.lawyer_registration_number && <p className="text-red-500 text-sm mt-1">{errors.lawyer_registration_number.message}</p>}
        </div>
        <div>
          <label htmlFor="affiliation" className={labelClassName}>{t("profile.affiliation")} <span className="text-red-500">*</span></label>
          <Input id="affiliation" {...register("affiliation")} />
          {errors.affiliation && <p className="text-red-500 text-sm mt-1">{errors.affiliation.message}</p>}
        </div>
        <div>
          <label htmlFor="office_name" className={labelClassName}>{t("profile.officeName")} <span className="text-red-500">*</span></label>
          <Input id="office_name" {...register("office_name")} />
          {errors.office_name && <p className="text-red-500 text-sm mt-1">{errors.office_name.message}</p>}
        </div>
        <div>
          <label htmlFor="office_address" className={labelClassName}>{t("profile.officeAddress")} <span className="text-red-500">*</span></label>
          <Input id="office_address" {...register("office_address")} />
          {errors.office_address && <p className="text-red-500 text-sm mt-1">{errors.office_address.message}</p>}
        </div>
        <div>
          <label htmlFor="experience_years" className={labelClassName}>{t("profile.yearsExperience")} <span className="text-red-500">*</span></label>
          <Input id="experience_years" {...register("experience_years")} placeholder={t("profile.enterYearsExperience")} />
          {errors.experience_years && <p className="text-red-500 text-sm mt-1">{errors.experience_years.message}</p>}
        </div>
        <div>
          <FileUploadField
            name="certification_document"
            label={t("profile.certificationDocument")}
            setValue={setValue}
            setError={setError}
            clearErrors={clearErrors}
            watch={watch}
            errors={errors}
            required
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize={5 * 1024 * 1024} // 5MB
            currentFileUrl={certificationDocUrl}
            currentFileLabel={t("profile.viewCurrentDocument")}
            dragInstructions={t("profile.dragOrClickUpload")}
            dragActiveInstructions={t("profile.dropFilesHere")}
            removeButtonText={t("common.remove")}
            fileTypesText={t("profile.fileTypeInfo")}
          />
        </div>
      </div>

      <div className="col-span-1 md:col-span-2">
        <Controller
          name="specialties"
          control={control}
          render={({ field }) => (
            <>
              <div className="mb-1">
                <span className="font-medium text-sm">{t("profile.specialties", "Specialties")} <span className="text-red-500">*</span></span>
              </div>
              <MultiSelect
                options={specialtiesOptions}
                selectedValues={field.value || []}
                onChange={field.onChange}
                placeholder={t("profile.specialtiesPlaceholder", "Select specialties...")}
                error={errors.specialties?.message}
              />
            </>
          )}
        />
      </div>
      <div>
        <label htmlFor="profile_text" className={labelClassName}>{t("profile.profile_text")} <span className="text-red-500">*</span></label>
        <textarea
          id="profile_text"
          {...register("profile_text")}
          className="w-full p-2 border border-gray-300 rounded-md focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          rows={4}
        />
        {errors.profile_text && <p className="text-red-500 text-sm mt-1">{errors.profile_text.message}</p>}
      </div>
      <div>
        <label htmlFor="areas_of_expertise" className={labelClassName}>{t("profile.expertiseAreas")}</label>
        <textarea
          id="areas_of_expertise"
          {...register("areas_of_expertise")}
          className="w-full p-2 border border-gray-300 rounded-md focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          rows={4}
        />
      </div>
      <div>
        <label htmlFor="notes" className={labelClassName}>{t("profile.notes")} </label>
        <textarea
          id="notes"
          {...register("notes")}
          className="w-full p-2 border border-gray-300 rounded-md focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          rows={4}
        />
      </div>
      <div>
        <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
          {t("profile.updateLawyerProfile")}
        </Button>
      </div>
    </form>
  );
}
