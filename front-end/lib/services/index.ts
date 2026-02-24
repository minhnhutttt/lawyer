import lawyersService from './lawyers'
import reviewsService from './reviews'
import appointmentsService from './appointments'
import questionsService from './questions'
import notificationsService from './notifications'
import articlesService from './articles'
import authService from './auth'
import userService from './users'
import supportService from './support'

export {
  lawyersService,
  reviewsService,
  appointmentsService,
  questionsService,
  notificationsService,
  articlesService,
  authService,
  userService,
  supportService,
}

// Export individual functions from each service
export * from './lawyers'
export * from './reviews'
export * from './appointments'
export * from './questions'
export * from './notifications'
export * from './articles'
export * from './auth'
export * from './users'
export * from './support'