import { get, post, put, patch, del } from '../api'
import { ApiResponse } from '../types/api'
import {User, UpdateUserRequest, UpdateUserStatusRequest, CreateUserRequest} from '../types/users'

// Get all users with pagination
export async function getUsers(
  page = 1, 
  limit = 10, 
  search?: string, 
  sort: string = 'id',
  order: 'asc' | 'desc' = 'asc'
): Promise<ApiResponse<User[]>> {
  const params: Record<string, any> = { page, limit, sort, order };
  if (search) {
    params.search = search;
  }
  return get('/users', params);
}

// Get user by ID
export async function getUserById(id: number): Promise<ApiResponse<User>> {
  return get(`/users/${id}`)
}

// Update user
export async function updateUser(id: number, data: UpdateUserRequest): Promise<ApiResponse<User>> {
  return put(`/users/${id}`, data)
}

export async function createUser(data: CreateUserRequest): Promise<ApiResponse<User>> {
  return post('/users/create-user', data)
}

// Update user status
export async function updateUserStatus(id: number, data: UpdateUserStatusRequest): Promise<ApiResponse<User>> {
  return patch(`/users/${id}/status`, data)
}

// Update user role
export async function updateUserRole(id: number, role: string): Promise<ApiResponse<User>> {
  return patch(`/users/${id}/role`, { role })
}

// Delete user
export async function deleteUser(id: number): Promise<ApiResponse<void>> {
  return del(`/users/${id}`)
}

// Get current user's profile
export async function getMyProfile(): Promise<ApiResponse<User>> {
  return get('/me')
}

// Update user password
export async function updateUserPassword(id: number, data: { new_password: string; current_password?: string }): Promise<ApiResponse<void>> {
  return patch(`/users/${id}/password`, data)
}

// Update user profile image
export async function updateUserProfileImage(formData: FormData): Promise<ApiResponse<User>> {
  return post('/users/profile/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export default {
  updateUser,
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getMyProfile,
  updateUserPassword,
  updateUserProfileImage
}