/**
 * Utility function to get the appropriate page title in Japanese based on pathname
 * Format: べんごしっち｜[PAGE NAME]
 */
export function getPageTitle(pathname: string | null): string {
  if (!pathname) return 'ホーム' // Default to home page if pathname is null
  
  // Remove trailing slash and query params for consistent matching
  const normalizedPath = pathname.split('?')[0].replace(/\/$/, '')
  
  // Map paths to their corresponding Japanese titles
  switch (normalizedPath) {
    case '':
    case '/':
      return 'ホーム' // Home
    case '/lawyers':
      return '弁護士を探す' // Find Lawyer
    case '/questions':
      return 'みんなの法律相談' // Questions
    case '/about':
      return '会社情報' // Company Info
    case '/appointments':
      return 'チャット予約' // Appointment
    case '/profile':
      return 'プロファイル' // Profile
    case '/articles':
      return '法律ブログ' // Articles/Blog
    default:
      // Handle sub-paths
      if (normalizedPath.startsWith('/admin')) {
        return '管理画面' // Admin
      } else if (normalizedPath.startsWith('/lawyers/')) {
        return '弁護士を探す' // Lawyer detail pages
      } else if (normalizedPath.startsWith('/questions/')) {
        return 'みんなの法律相談' // Question detail pages
      } else if (normalizedPath.startsWith('/appointments/')) {
        return 'チャット予約' // Appointment detail pages
      } else if (normalizedPath.startsWith('/articles/')) {
        return '法律ブログ' // Article detail pages
      }
      
      // Default to home page for unknown paths
      return 'ホーム'
  }
}
