export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  nickname?: string;
  gender?: 'male' | 'female' | null;
  age_group?: '10代' | '20代' | '30代' | '40代' | '50代以上';
  role: 'client' | 'lawyer' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profile_image?: string;
  phone?: string;
  birth_date?: string;
  postal_code?: string;
  country?: string;
  prefecture?: string;
  city?: string;
  address?: string;
  notes?: string;
  has_new_appointment?: boolean;
}

// Helper function to get full name from user object
export function getFullName(user: User): string {
  if (!user) return '';
  if (user.role === 'client' || user.role === 'admin') {
    return user.nickname || user.email || '';
  }

  const firstName = user.first_name || '';
  const lastName = user.last_name || '';
  
  if (firstName && lastName) {
    return `${lastName} ${firstName}`;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  } else if (user.nickname) {
    return user.nickname;
  }

  return user.email || '';
}

// Helper function to get user initials
export function getUserInitials(user: User): string {
  if (!user) return '';
  
  const firstName = user.first_name || '';
  const lastName = user.last_name || '';
  
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`;
  } else if (firstName) {
    return firstName[0];
  } else if (lastName) {
    return lastName[0];
  } else if (user.email) {
    return user.email[0].toUpperCase();
  } else {
    return '';
  }
}

export interface CreateUserRequest {
  email: string
  password: string
  role: 'client' | 'lawyer' | 'admin'
  first_name?: string
  last_name?: string
}

export interface UpdateUserRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  nickname?: string;
  gender?: 'male' | 'female' | null;
  age_group?: '10代' | '20代' | '30代' | '40代' | '50代以上';
  phone?: string;
  birth_date?: string;
  postal_code?: string;
  country?: string;
  prefecture?: string;
  city?: string;
  address?: string;
  notes?: string;
  role?: 'client' | 'lawyer' | 'admin';
  password?: string;
}

export interface UpdateUserStatusRequest {
  is_active: boolean;
}
