import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiLock } from "react-icons/fi";

// Create a schema generator function with translations
const createPasswordSchema = (t: Function) => z.object({
  current_password: z.string()
    .min(1, { message: t("validation.password.currentEmpty", "Current password can not be empty") }),
  new_password: z.string()
    .min(1, { message: t("validation.password.newEmpty", "New password can not be empty") })
    .min(8, { message: t("validation.password.minLength", "Password must be at least 8 characters long") }),
  confirm_password: z.string()
    .min(1, { message: t("validation.password.newEmpty", "New password can not be empty") })
}).refine((data) => data.new_password === data.confirm_password, {
  message: t("validation.confirmPassword.mismatch", "Passwords do not match"),
  path: ["confirm_password"]
});

// Define form data type
interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

type ChangePasswordFormProps = {
  onSubmit: (data: PasswordFormData) => Promise<{ success: boolean; error?: string; error_code?: string }>;
  submittingPassword: boolean;
  t: (key: string, opts?: any) => string;
};

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSubmit,
  submittingPassword,
  t,
}) => {
  // Create the form schema with translations
  const passwordSchema = createPasswordSchema(t);
  
  // State for API errors
  const [error, setError] = useState<string | null>(null);
  const [error_code, setErrorCode] = useState<string | null>(null);

  // Set up form with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: ""
    }
  });

  // Handle form submission
  const handleFormSubmit = async (data: PasswordFormData) => {
    // Clear any previous errors
    setError(null);
    setErrorCode(null);
    
    const result = await onSubmit(data);
    
    if (result.success) {
      reset(); // Reset form after successful submission
    } else if (result.error) {
      console.log(result)
      setError(result.error);
      setErrorCode(result.error_code || 'unknown');
    }
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          <div dangerouslySetInnerHTML={{
            __html: t(`errors.errorCodes.${error_code}`, error)
          }} />
        </div>
      )}
      {/* Current Password */}
      <div className="space-y-1">
        <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
          {t("profile.currentPassword") || "Current Password"}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              <FiLock />
            </div>
          </div>
          <input
            id="current_password"
            type="password"
            placeholder={t("profile.enterCurrentPassword") || "Enter current password"}
            className={`block w-full pl-10 pr-4 py-2 rounded-lg border ${errors.current_password ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-primary focus:border-primary transition-all sm:text-sm`}
            disabled={submittingPassword}
            {...register('current_password')}
          />
        </div>
        {errors.current_password && (
          <p className="mt-1 text-sm text-red-600">
            {errors.current_password.message?.toString()}
          </p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-1">
        <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
          {t("profile.newPassword") || "New Password"}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              <FiLock />
            </div>
          </div>
          <input
            id="new_password"
            type="password"
            placeholder={t("profile.enterNewPassword") || "Enter new password"}
            className={`block w-full pl-10 pr-4 py-2 rounded-lg border ${errors.new_password ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-primary focus:border-primary transition-all sm:text-sm`}
            disabled={submittingPassword}
            {...register('new_password')}
          />
        </div>
        {errors.new_password && (
          <p className="mt-1 text-sm text-red-600">
            {errors.new_password.message?.toString()}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
          {t("profile.confirmPassword") || "Confirm Password"}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              <FiLock />
            </div>
          </div>
          <input
            id="confirm_password"
            type="password"
            placeholder={t("profile.confirmNewPassword") || "Confirm new password"}
            className={`block w-full pl-10 pr-4 py-2 rounded-lg border ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-primary focus:border-primary transition-all sm:text-sm`}
            disabled={submittingPassword}
            {...register('confirm_password')}
          />
        </div>
        {errors.confirm_password && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirm_password.message?.toString()}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button 
          variant="primary"
          type="submit" 
          disabled={submittingPassword}
          isLoading={submittingPassword}
        >
          {t("profile.updatePassword") || "Update Password"}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
