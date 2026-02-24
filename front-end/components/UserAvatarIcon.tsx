import React from 'react'
import { User } from '@/lib/types'
import {getImageUrl} from "@/lib/utils/images";

interface UserAvatarProps {
  user?: User | null
  profileImage?: string
  size?: number
}

export default function UserAvatarIcon({ user, profileImage, size = 12 }: UserAvatarProps) {
  if (user?.profile_image || profileImage) {
    return (
      <img
        src={getImageUrl(user?.profile_image || profileImage, 'USER')}
        className={`h-${size} w-${size} rounded-full object-cover`}
      />
    )
  }
}
