'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import {
  FiX, FiUser, FiMail, FiEdit2, FiLock, FiShield, FiSave,
  FiAlertCircle, FiCalendar, FiGrid, FiPhone,
} from 'react-icons/fi'

import { updateUser, updateUserRole, updateUserPassword } from '@/lib/services/users'
import { User, UpdateUserRequest } from '@/lib/types/users'
import { formatDate as formatDateUtil } from '@/lib/utils'
import Modal from '@/components/common/Modal'
import { Button } from '@/components/ui/button'
import DatePickerField from '@/components/common/DatePickerField'
import { useToast } from '@/components/common/Toast'
import { useAuthStore } from '@/store/auth-store'

const createUserProfileSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().min(1, { message: 'adminUsers.validation.required' }).email({ message: 'adminUsers.validation.invalidEmail' }),
    role: z.enum(['client', 'admin', 'lawyer']),
    first_name: z.string().min(1, { message: 'validation.firstName.required' }),
    last_name: z.string().min(1, { message: 'validation.lastName.required' }),
    nickname: z.string().optional(),
    birth_date: z.string().nullable().optional(),
    phone: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).nullable().optional(),
    age_group: z.string().optional(),
  }).superRefine((data, ctx) => {
    if ((data.role === 'client' || data.role === 'admin') && (!data.nickname || data.nickname.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nickname'],
        message: 'adminUsers.validation.required',
      });
    }
  });

const createPasswordSchema = (t: (key: string) => string) =>
  z.object({
    password: z.string()
      .min(8, { message: 'adminUsers.validation.passwordLength' }),
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, {
    message: 'adminUsers.validation.passwordMismatch',
    path: ['confirmPassword'],
  });

type UserProfileFormData = z.infer<ReturnType<typeof createUserProfileSchema>>;
type PasswordFormData = z.infer<ReturnType<typeof createPasswordSchema>>;

interface UserEditModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function UserEditModal({ user, isOpen, onClose, onSave }: UserEditModalProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const { user: currentUser } = useAuthStore();
  // Removing tab navigation state
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const profileSchema = createUserProfileSchema(t);
  const passwordSchema = createPasswordSchema(t);

  const profileMethods = useForm<UserProfileFormData>({ resolver: zodResolver(profileSchema) });
  const passwordMethods = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  const { control: profileControl, register: profileRegister, handleSubmit: handleProfileSubmit, reset: profileReset, watch: watchProfile, formState: { errors: profileErrors, isDirty: isProfileDirty, isSubmitting: isProfileSubmitting } } = profileMethods;
  const { register: passwordRegister, handleSubmit: handlePasswordSubmit, reset: passwordReset, trigger: triggerPassword, getValues: getPasswordValues, formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting } } = passwordMethods;

  const watchedRole = watchProfile('role');

  useEffect(() => {
    if (isOpen) {
      if (user) {
        profileReset({
          email: user.email,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          role: user.role,
          gender: user.gender || null,
          nickname: user.nickname || '',
          age_group: user.age_group || undefined,
        });
      } else {
        profileReset({
          email: '', first_name: '', last_name: '', role: 'client', birth_date: null, phone: '',
          gender: null, nickname: '', age_group: undefined,
        });
      }
      setShowPasswordForm(false);
      passwordReset({ password: '', confirmPassword: '' });
      // No need to set tab anymore
    }
  }, [user, isOpen, profileReset, passwordReset]);

  const isCurrentUser = (): boolean => !!currentUser && !!user && user.id === Number(currentUser.id);

  const onProfileSubmit = async (data: UserProfileFormData) => {
    if (!user) return;
    try {
      // Prevent changing role to lawyer or from lawyer to any other role
      if (user.role === 'lawyer' || data.role === 'lawyer') {
        data.role = user.role; // Keep original role if trying to change to/from lawyer
      }
      
      await updateUser(user.id, data as UpdateUserRequest);
      if (data.role && data.role !== user.role && !isCurrentUser()) {
        await updateUserRole(user.id, data.role);
      }
      toast.success(t('adminUsers.updateSuccess'));
      onSave();
    } catch (err) {
      console.error('Error saving user:', err);
      toast.error(t('errors.unexpectedError'));
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (!user) return;
    try {
      await updateUserPassword(user.id, { new_password: data.password });
      toast.success(t('adminUsers.passwordUpdateSuccess'));
      setShowPasswordForm(false);
      passwordReset();
    } catch (err) {
      console.error('Error updating password:', err);
      toast.error(t('errors.unexpectedError'));
    }
  };

  const handlePasswordSave = async () => {
    const isValid = await triggerPassword();
    if (isValid) {
      onPasswordSubmit(getPasswordValues());
    } else {
      toast.error(t('adminUsers.validation.fixErrors'));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="bg-primary/10 p-2.5 rounded-full mr-3">
              {user ? <FiEdit2 className="w-5 h-5 text-primary"/> : <FiUser className="w-5 h-5 text-primary"/>}
            </span>
            {user ? t('adminUsers.editUser') : t('adminUsers.addUser')}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Close">
            <FiX className="w-5 h-5 text-gray-500"/>
          </Button>
        </div>

        {/* Removed tab navigation */}

        <FormProvider {...profileMethods}>
          <form id="profile-form" onSubmit={handleProfileSubmit(onProfileSubmit)} className="p-6 overflow-y-auto max-h-[calc(90vh-14rem)]">
              <div className="space-y-6">
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center"><FiMail className="w-4 h-4 mr-1.5 text-gray-500"/>{t('adminUsers.form.email')}<span className="text-red-500 ml-1">*</span></label>
                  <div className="relative mt-1">
                    <input id="email" type="email" {...profileRegister('email')} disabled className={`block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm transition-all sm:text-sm bg-gray-100 cursor-not-allowed`}/>
                  </div>
                </div>

                {watchedRole === 'lawyer' && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 flex items-center"><FiUser className="w-4 h-4 mr-1.5 text-gray-500"/>{t('adminUsers.form.firstName')}<span className="text-red-500 ml-1">*</span></label>
                      <input id="first_name" type="text" {...profileRegister('first_name')} className={`block w-full px-4 py-2.5 rounded-lg border shadow-sm focus:ring-primary focus:border-primary transition-all sm:text-sm ${profileErrors.first_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}/>
                      {profileErrors.first_name && <p className="mt-1.5 text-sm text-red-600">{t(profileErrors.first_name.message as string)}</p>}
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 flex items-center"><FiUser className="w-4 h-4 mr-1.5 text-gray-500"/>{t('adminUsers.form.lastName')}<span className="text-red-500 ml-1">*</span></label>
                      <input id="last_name" type="text" {...profileRegister('last_name')} className={`block w-full px-4 py-2.5 rounded-lg border shadow-sm focus:ring-primary focus:border-primary transition-all sm:text-sm ${profileErrors.last_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}/>
                      {profileErrors.last_name && <p className="mt-1.5 text-sm text-red-600">{t(profileErrors.last_name.message as string)}</p>}
                    </div>
                  </div>
                )}
                {watchedRole !== 'lawyer' && (
                  <div className="space-y-1">
                    <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 flex items-center"><FiUser className="w-4 h-4 mr-1.5 text-gray-500"/>{t('profile.nickname')}<span className="text-red-500 ml-1">*</span></label>
                    <input id="nickname" type="text" {...profileRegister('nickname')} placeholder={t('profile.enterNickname')} className={`block w-full px-4 py-2.5 rounded-lg border shadow-sm focus:ring-primary focus:border-primary transition-all sm:text-sm ${profileErrors.nickname ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}/>
                    {profileErrors.nickname && <p className="mt-1.5 text-sm text-red-600">{t(profileErrors.nickname.message as string)}</p>}
                  </div>
                )}
                {watchedRole !== 'lawyer' && (
                  <div className="space-y-1">
                    <label htmlFor="age_group" className="block text-sm font-medium text-gray-700">{t('profile.ageGroup')}</label>
                    <select id="age_group" {...profileRegister('age_group')} className="block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-primary focus:border-primary transition-all sm:text-sm">
                      <option value="10代">10s</option><option value="20代">20s</option><option value="30代">30s</option><option value="40代">40s</option><option value="50代以上">50s and above</option>
                    </select>
                  </div>
                )}
                <div className="space-y-1">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 flex items-center">{t('profile.gender')}</label>
                  <select id="gender" {...profileRegister('gender')} className="block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-primary focus:border-primary transition-all sm:text-sm">
                    <option value="male">{t('profile.male')}</option><option value="female">{t('profile.female')}</option>
                  </select>
                </div>
                {/* Only show role selector if user is not a lawyer */}
                {user?.role !== 'lawyer' && (
                  <div className="space-y-1">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 flex items-center"><FiShield className="w-4 h-4 mr-1.5 text-gray-500"/>{t('adminUsers.form.role')}</label>
                    <select id="role" {...profileRegister('role')} disabled={isCurrentUser()} className={`block w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 shadow-sm focus:ring-primary focus:border-primary transition-all sm:text-sm appearance-none ${isCurrentUser() ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                      <option value="client">{t('common.roles.client')}</option>
                      <option value="admin">{t('common.roles.admin')}</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{t('adminUsers.roleChangeHint')}</p>
                  </div>
                )}
                
                {/* Password section moved from advanced tab */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex">
                    <div className="flex-shrink-0"><FiLock className="h-5 w-5 text-blue-600"/></div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">{t('adminUsers.passwordReset')}</h3>
                      {!showPasswordForm ? (
                        <div className="mt-4"><Button type="button" variant="outline" onClick={() => setShowPasswordForm(true)} className="inline-flex items-center text-blue-700 border-blue-300 hover:bg-blue-50"><FiLock className="mr-2 h-4 w-4"/>{t('adminUsers.changePassword')}</Button></div>
                      ) : (
                        <div className="mt-3 space-y-4">
                          <div className="space-y-1">
                            <label htmlFor="password">{t('adminUsers.form.password')}<span className="text-red-500 ml-1">*</span></label>
                            <input id="password" type="password" {...passwordRegister('password')} className={`block w-full px-4 py-2 rounded-lg border shadow-sm transition-all sm:text-sm ${passwordErrors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}/>
                            {passwordErrors.password && <p className="mt-1 text-sm text-red-600">{t(passwordErrors.password.message as string)}</p>}
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="confirmPassword">{t('adminUsers.form.confirmPassword')}<span className="text-red-500 ml-1">*</span></label>
                            <input id="confirmPassword" type="password" {...passwordRegister('confirmPassword')} className={`block w-full px-4 py-2 rounded-lg border shadow-sm transition-all sm:text-sm ${passwordErrors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}/>
                            {passwordErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{t(passwordErrors.confirmPassword.message as string)}</p>}
                          </div>
                          <div className="flex space-x-3 pt-2">
                            <Button type="button" variant="secondary" onClick={() => { setShowPasswordForm(false); passwordReset(); }}>{t('common.cancel')}</Button>
                            <Button type="button" variant="primary" onClick={handlePasswordSave} disabled={isPasswordSubmitting} isLoading={isPasswordSubmitting}><FiSave className="w-4 h-4 mr-1.5"/>{t('common.save')}</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
          </form>
        </FormProvider>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div>{isProfileDirty && <div className="flex items-center text-amber-600 text-sm"><FiAlertCircle className="w-4 h-4 mr-1.5"/>{t('adminUsers.unsavedChanges')}</div>}</div>
          <div className="flex space-x-3">
            <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
            <Button type="submit" form="profile-form" variant="primary" disabled={isProfileSubmitting || !isProfileDirty} isLoading={isProfileSubmitting}><FiSave className="w-4 h-4 mr-1.5"/>{t('common.save')}</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}