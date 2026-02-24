export const DEFAULT_IMAGES = {
  AVATAR: "/images/default-avatar.png",
  LAWYER: "/images/default-avatar.png",
  USER: "/images/default-avatar.png",
  PLACEHOLDER: "/images/default-avatar.png",
} as const;

export type DefaultImageType = keyof typeof DEFAULT_IMAGES;

export const getImageUrl = (url?: string, type: DefaultImageType = 'AVATAR') => {
  if (!url) return DEFAULT_IMAGES[type];
  
  // Handle different types of image URLs
  if (url.startsWith('http')) {
    return url;
  }
  
  // If it's a relative path, prepend with /images
  if (!url.startsWith('/')) {
    return `/images/${url}`;
  }
  
  return url;
};
