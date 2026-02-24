[![Build and Deploy](https://github.com/linnoedge/lawyer/actions/workflows/build-and-deploy.yml/badge.svg)](https://github.com/linnoedge/lawyer/actions/workflows/build-and-deploy.yml)

# Lawyer Platform Frontend

This is the frontend for the Lawyer Platform, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Server-side rendering with Next.js
- TypeScript for type safety
- Tailwind CSS for styling
- Responsive design for all device sizes
- Multi-language support (English and Japanese)
- State management with Zustand
- API integration with Axios

## Pages

- Questions: View, ask, and answer legal questions
- Lawyers: Find and connect with legal professionals
- Appointments: Schedule consultations with lawyers
  - View all appointments
  - Book new appointments
  - View appointment details
  - Cancel or reschedule appointments
- Authentication: Login, register, and manage user profiles

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory:

```bash
cd front-end
```

3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app`: Next.js App Router pages and layouts
  - `/appointments`: Appointment-related pages
  - `/questions`: Question-related pages
  - `/lawyers`: Lawyer profile pages
  - `/auth`: Authentication pages
- `/components`: Reusable React components
  - `/layout`: Layout components (Header, Footer, etc.)
  - `/ui`: UI components (Button, Input, Card, Alert, etc.)
- `/lib`: Utility functions and hooks
  - `utils.ts`: Common utility functions
  - `api.ts`: API service with Axios
- `/store`: State management with Zustand
  - `auth-store.ts`: Authentication state management
- `/public`: Static assets

## UI Components

The application includes the following reusable UI components:

- `Button`: Customizable button with variants, sizes, loading states, and icons
- `Input`: Form input with label, helper text, error states, and icons
- `Card`: Content container with optional header, body, and footer sections
- `Alert`: Message component with different variants (info, success, warning, error)

## State Management

The application uses Zustand for state management:

- `auth-store.ts`: Manages authentication state including user info, login, and registration

## API Integration

API requests are handled using Axios:

- `api.ts`: Provides methods for GET, POST, PUT, and DELETE requests with authentication

## Building for Production

```bash
npm run build
# or
yarn build
```

## Deployment

The application can be deployed using any service that supports Next.js, such as Vercel or Netlify.

```bash
npm run start
# or
yarn start
``` 