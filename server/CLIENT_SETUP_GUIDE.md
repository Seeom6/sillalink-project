# SillaLink Client Setup Guide

## Quick Start

This guide will help you set up the SillaLink frontend application that complements the modular NestJS server.

## Prerequisites

- Node.js 18+ and npm/yarn
- The SillaLink NestJS server running on `http://localhost:5000`
- Basic knowledge of React, Next.js, and TypeScript

## Initial Setup

### 1. Create Next.js Project

```bash
# Navigate to the project root (same level as server/)
cd ..

# Create the client application
npx create-next-app@latest client --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navigate to client directory
cd client
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install next-auth
npm install axios
npm install zustand
npm install react-hook-form @hookform/resolvers
npm install zod
npm install framer-motion
npm install lucide-react
npm install react-hot-toast
npm install recharts

# UI Components (Shadcn/ui)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label form dialog table badge avatar dropdown-menu navigation-menu sheet

# Development dependencies
npm install -D @types/node
npm install -D prettier prettier-plugin-tailwindcss
npm install -D eslint-config-prettier eslint-plugin-prettier
npm install -D husky lint-staged
```

### 3. Environment Configuration

Create `.env.local`:
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-change-in-production
JWT_SECRET=your-jwt-secret-key-change-in-production

# Application
NEXT_PUBLIC_APP_NAME=SillaLink
NEXT_PUBLIC_APP_DESCRIPTION=Business Portfolio & Management Platform
```

### 4. Basic Folder Structure

Create the following directories:
```bash
mkdir -p app/\(admin\)/admin/{dashboard,users,employees,projects,technologies,services,health}
mkdir -p app/\(public\)/{about,services,projects,team,contact}
mkdir -p app/auth/{login,register,forgot-password}
mkdir -p components/{admin,public,auth,shared,layout}
mkdir -p lib/{api,auth,hooks,stores,types,utils,config}
mkdir -p public/{images,icons}
```

## Core Implementation

### 1. API Client Setup

Create `lib/api/client.ts`:
```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. Authentication Setup

Create `lib/auth/config.ts`:
```typescript
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import apiClient from '@/lib/api/client';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const response = await apiClient.post('/website/auth/log-in', {
            email: credentials?.email,
            password: credentials?.password,
          });

          if (response.success && response.data.user) {
            return {
              id: response.data.user._id,
              email: response.data.user.email,
              name: `${response.data.user.firstName} ${response.data.user.lastName}`,
              role: response.data.user.role,
              accessToken: response.data.accessToken,
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
};
```

### 3. Query Client Setup

Create `lib/providers/query-provider.tsx`:
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes
            retry: 3,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 4. Root Layout

Update `app/layout.tsx`:
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/providers/query-provider';
import { AuthProvider } from '@/lib/providers/auth-provider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SillaLink - Business Portfolio & Management',
  description: 'Professional business portfolio and management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            {children}
            <Toaster position="top-right" />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 5. Admin Layout

Create `app/(admin)/layout.tsx`:
```typescript
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import AdminSidebar from '@/components/admin/layout/sidebar';
import AdminHeader from '@/components/admin/layout/header';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    redirect('/auth/login');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type checking
npm run type-check
```

## Next Steps

1. **Implement Authentication Pages**: Create login, register, and forgot password pages
2. **Build Admin Components**: Start with user management module
3. **Create Public Website**: Implement homepage and portfolio sections
4. **Add Testing**: Set up Jest and React Testing Library
5. **Configure Deployment**: Set up Vercel or similar platform

## Integration with Server

The client is designed to work seamlessly with the NestJS server:

- **Admin routes** connect to `/api/v1/admin/*` endpoints
- **Public routes** connect to `/api/v1/website/*` endpoints
- **Authentication** uses the server's JWT system
- **Error handling** matches server error codes
- **Type safety** mirrors server DTOs and interfaces

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure server CORS is configured for `http://localhost:3000`
2. **Auth Issues**: Check JWT secrets match between client and server
3. **API Errors**: Verify server is running on `http://localhost:5000`
4. **Build Errors**: Ensure all dependencies are installed correctly

### Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [NextAuth.js Documentation](https://next-auth.js.org/)

For detailed architecture information, see [CLIENT_ARCHITECTURE.md](./CLIENT_ARCHITECTURE.md).
