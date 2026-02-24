/**
 * Server API Services
 * 
 * This file exports all server-side API services for easy importing
 * Example usage:
 * import { articlesService, lawyersService } from '@/lib/server'
 */

import articlesService from './articles'
import lawyersService from './lawyers'
import questionsService from './questions'

// Re-export the API utilities for direct access if needed
export * from './api'

// Export all services
export {
  articlesService,
  lawyersService,
  questionsService
}
