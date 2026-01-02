# Training & Enrollment Management System - Frontend

React + TypeScript + TailwindCSS frontend for the Training & Enrollment Management System.

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   # OR
   yarn install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # OR
   yarn dev
   ```

The app will be available at http://localhost:3000

## Build

```bash
npm run build
# OR
yarn build
```

## Project Structure

```
frontend/
├── src/
│   ├── api/          # API client and endpoints
│   ├── components/   # Reusable components
│   ├── pages/        # Page components
│   ├── store/        # Zustand state management
│   ├── utils/        # Utility functions
│   └── App.tsx       # Main app component
├── public/           # Static assets
└── package.json      # Dependencies
```

## Features

- **Home Page**: Landing page with hero section, features, and login CTAs
- **Authentication**: Login and signup with role-based routing
- **Applicant Onboarding**: Multi-step form for profile completion
- **Dashboards**: Role-specific dashboards (Applicant, Centre, Admin)
- **Protected Routes**: Route protection based on authentication and role

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- TailwindCSS
- Framer Motion
- Zustand
- React Hook Form
- Zod
- Axios

