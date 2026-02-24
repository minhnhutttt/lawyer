"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FiX, FiEdit2, FiSave, FiAlertCircle, FiUser, FiMail, FiBriefcase,
  FiAward, FiInfo, FiDatabase, FiPhone, FiFilePlus, FiFileText
} from "react-icons/fi";
import FileUploadField from "@/components/common/FileUploadField";

import { Lawyer, LawyerProfileRequest } from "@/lib/types/lawyers";
import Modal from "@/components/common/Modal";
import { useToast } from "@/components/common/Toast";
import { updateLawyer, uploadLawyerCertification } from "@/lib/services/lawyers";
import MultiSelect from "@/components/ui/MultiSelect";
import { LAWYER_SPECIALTIES } from "@/lib/types/enums";
import { Button } from "@/components/ui/button";

// Zod schema creator function for form validation
const createLawyerProfileSchema = (t: (key: string) => string) => z.object({
  last_name: z.string()
    .min(1, { message: t("validation.lastName.required") })
    .max(50, { message: t("validation.lastName.maxLength") }),
    
  first_name: z.string()
    .min(1, { message: t("validation.firstName.required") })
    .max(50, { message: t("validation.firstName.maxLength") }),
  
  email: z.string()
    .email({ message: t("validation.email.invalid") })
    .optional()
    .or(z.literal("").optional()),  // Keep in schema for type compatibility but optional
  
  gender: z.string().nullable(),
  
  office_name: z.string()
    .min(1, { message: t("validation.officeName.required") })
    .max(100, { message: t("validation.officeName.maxLength") }),
  
  address: z.string()
    .min(1, { message: t("validation.officeAddress.required") })
    .max(200, { message: t("validation.officeAddress.maxLength") }),
  
  experience_years: z.string()
    .min(1, { message: t("validation.experienceYears.required") })
    .regex(/^\d+$/, { message: t("validation.experienceYears.format") }),
  
  lawyer_registration_number: z.string()
    .min(1, { message: t("validation.registrationNumber.required") })
    .regex(/^[0-9]{5}$/, { message: t("validation.registrationNumber.format") }),
  
  affiliation: z.string()
    .min(1, { message: t("validation.affiliation.required") })
    .max(100, { message: t("validation.affiliation.maxLength") }),
  
  phone: z.string()
    .min(1, { message: t("validation.phone.required") })
    .regex(/^[0-9]{10,11}$/, { message: t("validation.phone.format") }),
  
  fax_number: z.string()
    .regex(/^[0-9]{10,11}$/, { message: t("validation.fax.format") })
    .optional()
    .or(z.literal("").transform(() => null))
    .nullable(),
  
  profile_text: z.string()
    .min(1, { message: t("validation.profileText.required") })
    .max(1000, { message: t("validation.notes.maxLength") })
    .nullable(),
  
  areas_of_expertise: z.string()
    .max(1000, { message: t("validation.notes.maxLength") })
    .optional()
    .or(z.literal("").transform(() => null))
    .nullable(),
  
  notes: z.string()
    .max(1000, { message: t("validation.notes.maxLength") })
    .optional()
    .or(z.literal("").transform(() => null))
    .nullable(),
  
  specialties: z.array(z.string())
    .min(1, { message: t("validation.specialties.required") }),
});

type LawyerFormData = z.infer<ReturnType<typeof createLawyerProfileSchema>>;

interface LawyerEditModalProps {
  lawyer: Lawyer | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function LawyerEditModal({ lawyer, isOpen, onClose, onSave }: LawyerEditModalProps) {
  const { t } = useTranslation();
  const formSchema = createLawyerProfileSchema(t);
  const { error: errorToast, success: successToast } = useToast();
  const [step, setStep] = useState<"basic" | "advanced">("basic");
  const [uploadingCertification, setUploadingCertification] = useState(false);

  const methods = useForm<LawyerFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      last_name: "",
      first_name: "",
      email: "",
      gender: null,
      office_name: "",
      address: "",
      experience_years: "",
      lawyer_registration_number: "",
      affiliation: "",
      phone: "",
      fax_number: "",
      profile_text: "",
      areas_of_expertise: "",
      notes: "",
      specialties: [],
    },
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { isDirty, isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (isOpen && lawyer) {
      // Split full name into first and last name or use empty strings if not available
      const fullNameParts = (lawyer.full_name || "").split(" ");
      let lastName = "";
      let firstName = "";
      
      if (fullNameParts.length >= 2) {
        lastName = fullNameParts[0];
        firstName = fullNameParts.slice(1).join(" ");
      } else if (fullNameParts.length === 1) {
        lastName = fullNameParts[0];
      }
      
      reset({
        last_name: lastName,
        first_name: firstName,
        email: lawyer.email || "",
        gender: (lawyer as any).gender || "",
        office_name: lawyer.office_name || "",
        address: lawyer.address || "",
        experience_years: lawyer.experience_years ? String(lawyer.experience_years) : "",
        lawyer_registration_number: lawyer.lawyer_registration_number || "",
        affiliation: lawyer.affiliation || "",
        phone: lawyer.phone || "",
        fax_number: lawyer.fax_number || "",
        profile_text: lawyer.profile_text || "",
        areas_of_expertise: lawyer.areas_of_expertise || "",
        notes: lawyer.notes || "",
        specialties: lawyer.specialties || [],
      });
      // Reset certification document state is handled by form reset
      setStep("basic");
    }
  }, [lawyer, isOpen, reset]);

  const handleCertificationUpload = async (file: File) => {
    if (!lawyer) return;
    console.log(lawyer)
    
    try {
      setUploadingCertification(true);
      const formData = new FormData();
      formData.append('certification', file);

      const result = await uploadLawyerCertification(lawyer.id, formData);
      successToast(t("adminLawyers.documentUploadSuccess", "Document uploaded successfully"));
      if (result.data.certification_document_path) {
        lawyer.certification_document_path = result.data.certification_document_path;
      }
      return true;
    } catch (error) {
      console.error("Error uploading certification document:", error);
      errorToast(t("adminLawyers.documentUploadError", "Failed to upload document"));
      return false;
    } finally {
      setUploadingCertification(false);
    }
  };

  const processSubmit = async (data: LawyerFormData) => {
    if (!lawyer) return;
    try {
      // Combine last_name and first_name into full_name for the API and convert types
      const submissionData = {
        ...data,
        full_name: `${data.last_name} ${data.first_name}`.trim(),
        // Convert string to number for experience_years
        experience_years: data.experience_years ? parseInt(data.experience_years, 10) : 0
      };

      await updateLawyer(lawyer.id, submissionData as LawyerProfileRequest);
      successToast(t("adminLawyers.updateSuccess"));
      onSave();
    } catch (err) {
      console.error("Error saving lawyer:", err);
      errorToast(t("errors.unexpectedError"));
    }
  };

  const specialtyOptions = LAWYER_SPECIALTIES.map(s => ({ value: s, label: t(`common.specialties.${s}`) }));

  const inputClassName = (field: keyof LawyerFormData) =>
    `mt-1 block w-full px-4 py-2.5 rounded-lg border ${
      errors[field]
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:ring-primary focus:border-primary'
    } shadow-sm transition-all sm:text-sm`;

  const errorDisplay = (field: keyof LawyerFormData) =>
    errors[field] && (
      <p className="mt-1.5 text-sm text-red-600 flex items-center">
        <FiAlertCircle className="w-4 h-4 mr-1.5" />
        {errors[field]?.message}
      </p>
    );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <FormProvider {...methods}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="bg-primary/10 p-2.5 rounded-full mr-3">
              <FiEdit2 className="w-5 h-5 text-primary" />
            </span>
            {t("adminLawyers.editTitle")}
          </h2>
          <Button variant="ghost" onClick={onClose} className="p-2 rounded-full" aria-label="Close">
            <FiX className="w-5 h-5 text-gray-500" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6 flex">
          <Button variant="ghost" onClick={() => setStep('basic')} className={`py-3 px-4 border-b-2 font-medium text-sm rounded-none ${step === 'basic' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            {t("adminLawyers.basicInfo")}
          </Button>
          {lawyer && (
            <Button variant="ghost" onClick={() => setStep('advanced')} className={`py-3 px-4 border-b-2 font-medium text-sm rounded-none ${step === 'advanced' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              {t("adminLawyers.advancedInfo")}
            </Button>
          )}
        </div>

        {/* Form */}
        <form id="edit-lawyer-form" onSubmit={handleSubmit(processSubmit)} className="p-6 overflow-y-auto max-h-[calc(90vh-14rem)]">
          {step === 'basic' ? (
            <div className="space-y-6">
              {/* Last Name & First Name */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 flex items-center">
                    <FiUser className="w-4 h-4 mr-1.5 text-gray-500" />
                    {t("profile.lastName")} <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input id="last_name" type="text" {...register('last_name')} placeholder={t("profile.lastName")} className={inputClassName('last_name')} />
                  {errorDisplay('last_name')}
                </div>
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 flex items-center">
                    <FiUser className="w-4 h-4 mr-1.5 text-gray-500" />
                    {t("profile.firstName")} <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input id="first_name" type="text" {...register('first_name')} placeholder={t("profile.firstName")} className={inputClassName('first_name')} />
                  {errorDisplay('first_name')}
                </div>
              </div>

              {/* Email & Gender */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center">
                    <FiMail className="w-4 h-4 mr-1.5 text-gray-500" />
                    {t("adminLawyers.email")}
                  </label>
                  <input 
                    id="email" 
                    type="email" 
                    value={lawyer?.email || ""}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 flex items-center">
                    <FiInfo className="w-4 h-4 mr-1.5 text-gray-500" />
                    {t("adminLawyers.gender")}
                  </label>
                  <select id="gender" {...register('gender')} className={inputClassName('gender')}>
                    <option value="male">{t("profile.male")}</option>
                    <option value="female">{t("profile.female")}</option>
                  </select>
                  {errorDisplay('gender')}
                </div>
              </div>

              {/* Office Name & Address */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="office_name" className="block text-sm font-medium text-gray-700 flex items-center">
                    <FiBriefcase className="w-4 h-4 mr-1.5 text-gray-500" />
                    {t("adminLawyers.officeName")} <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input id="office_name" type="text" {...register('office_name')} placeholder={t("adminLawyers.placeholders.officeName")} className={inputClassName('office_name')} />
                  {errorDisplay('office_name')}
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 flex items-center">
                    <FiInfo className="w-4 h-4 mr-1.5 text-gray-500" />
                    {t("adminLawyers.officeAddress")} <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input id="address" {...register('address')} placeholder={t("adminLawyers.placeholders.officeAddress")} className={inputClassName('address')} />
                  {errorDisplay('address')}
                </div>
              </div>

              <div>
                <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiAward className="w-4 h-4 mr-1.5 text-gray-500" />
                  {t("profile.yearsExperience")} <span className="text-red-500 ml-1">*</span>
                </label>
                <input id="experience_years" {...register('experience_years')} placeholder={t("profile.enterYearsExperience")} className={inputClassName('experience_years')} />
                {errorDisplay('experience_years')}
              </div>

              {/* Registration Number & Affiliation */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="lawyer_registration_number" className="block text-sm font-medium text-gray-700 flex items-center">
                    <FiAward className="w-4 h-4 mr-1.5 text-gray-500" />
                    {t("adminLawyers.lawyerRegistrationNumber")} <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input id="lawyer_registration_number" type="text" {...register('lawyer_registration_number')} placeholder={t("adminLawyers.placeholders.registrationNumber")} className={inputClassName('lawyer_registration_number')} />
                  {errorDisplay('lawyer_registration_number')}
                </div>
                <div>
                  <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700 flex items-center">
                    <FiAward className="w-4 h-4 mr-1.5 text-gray-500" />
                    {t("adminLawyers.affiliation")} <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input id="affiliation" type="text" {...register('affiliation')} placeholder={t("adminLawyers.placeholders.affiliation")} className={inputClassName('affiliation')} />
                  {errorDisplay('affiliation')}
                </div>
              </div>

              {/* Phone & Fax */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 flex items-center">
                    <FiPhone className="w-4 h-4 mr-1.5 text-gray-500" />
                    {t("adminLawyers.phone")} <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input id="phone" type="tel" {...register('phone')} placeholder={t("adminLawyers.placeholders.phone")} className={inputClassName('phone')} />
                  {errorDisplay('phone')}
                </div>
                <div>
                  <label htmlFor="fax_number" className="block text-sm font-medium text-gray-700 flex items-center">
                    <FiPhone className="w-4 h-4 mr-1.5 text-gray-500" />
                    {t("adminLawyers.faxNumber")}
                  </label>
                  <input id="fax_number" type="tel" {...register('fax_number')} placeholder={t("adminLawyers.placeholders.faxNumber")} className={inputClassName('fax_number')} />
                  {errorDisplay('fax_number')}
                </div>
              </div>

              {/* Certification Document Upload */}
              <div>
                <FileUploadField
                  name="certification_document"
                  label={t("adminLawyers.certificationDocument")}
                  setValue={(name: string, file: File | null) => {
                    // First set the value in the form
                    setValue(name as any, file);
                    // Then handle file upload when a new file is selected
                    if (file) {
                      handleCertificationUpload(file);
                    }
                  }}
                  setError={setError}
                  clearErrors={clearErrors}
                  watch={watch}
                  errors={errors}
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSize={5 * 1024 * 1024} // 5MB
                  currentFileUrl={lawyer?.certification_document_path}
                  currentFileLabel={t("adminLawyers.viewCurrentDocument")}
                  dragInstructions={t("profile.dragOrClickUpload")}
                  dragActiveInstructions={t("profile.dropFilesHere")}
                  removeButtonText={t("common.remove")}
                  fileTypesText={t("profile.fileTypeInfo")}
                />
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                  <FiDatabase className="w-4 h-4 mr-1.5 text-gray-500" />
                  {t("adminLawyers.specialties")} <span className="text-red-500 ml-1">*</span>
                </label>
                <Controller name="specialties" control={control} render={({ field }) => (
                  <MultiSelect options={specialtyOptions} selectedValues={field.value || []} onChange={field.onChange} placeholder={t("adminLawyers.specialtiesPlaceholder")} error={errors.specialties?.message} />
                )} />
              </div>

              {/* Textareas */}
              <div>
                <label htmlFor="profile_text" className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiFileText className="w-4 h-4 mr-1.5 text-gray-500" />
                  {t("adminLawyers.profileText")} <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea id="profile_text" rows={4} {...register('profile_text')} placeholder={t("adminLawyers.placeholders.profileText")} className={inputClassName('profile_text')} />
                {errorDisplay('profile_text')}
              </div>
              <div>
                <label htmlFor="areas_of_expertise" className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiInfo className="w-4 h-4 mr-1.5 text-gray-500" />
                  {t("adminLawyers.areasOfExpertise")}
                </label>
                <textarea id="areas_of_expertise" rows={3} {...register('areas_of_expertise')} placeholder={t("adminLawyers.placeholders.areasOfExpertise")} className={inputClassName('areas_of_expertise')} />
                {errorDisplay('areas_of_expertise')}
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiFileText className="w-4 h-4 mr-1.5 text-gray-500" />
                  {t("adminLawyers.notes")}
                </label>
                <textarea id="notes" rows={2} {...register('notes')} placeholder={t("adminLawyers.placeholders.notes")} className={inputClassName('notes')} />
                {errorDisplay('notes')}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {lawyer && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiDatabase className="w-4 h-4 mr-2 text-gray-500" />{t("adminLawyers.lawyerDetails")}
                  </h3>
                  <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 text-sm">
                    <p><span className="text-gray-500 mr-2">ID:</span><span className="font-medium">{lawyer.id}</span></p>
                    <p><span className="text-gray-500 mr-2">{t("adminLawyers.rating")}:</span><span className="font-medium">{lawyer.average_rating?.toFixed(1) || "-"}</span></p>
                    <p><span className="text-gray-500 mr-2">{t("adminLawyers.reviewCount")}:</span><span className="font-medium">{lawyer.review_count || 0}</span></p>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div>
            {isDirty && (
              <div className="flex items-center text-amber-600 text-sm">
                <FiAlertCircle className="w-4 h-4 mr-1.5" />
                {t("adminLawyers.unsavedChanges")}
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" form="edit-lawyer-form" variant="primary" disabled={isSubmitting || !isDirty} isLoading={isSubmitting}>
              <FiSave className="w-4 h-4 mr-2" />
              {t("common.save")}
            </Button>
          </div>
        </div>
      </FormProvider>
    </Modal>
  );
}