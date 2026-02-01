# QuickCart Identity Console v2.0

A premium, high-performance E-commerce platform built with Next.js 15, React 19, and MongoDB. Designed with a focus on restrained aesthetics, editorial typography, and production-grade security.

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd E-comer-webside
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file with:
   ```env
   MONGODB_URI=your_mongodb_uri
   MONGODB_DB=your_db_name
   JWT_SECRET=your_secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   STRIPE_SECRET_KEY=your_stripe_key
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
   ```

3. **Run Development**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture Overview

- **Frontend**: Next.js (App Router), Framer Motion, Tailwind CSS
- **State Management**: Redux Toolkit (Cart), React Query (Data Fetching)
- **Backend**: Next.js Route Handlers
- **Database**: MongoDB (Service Layer abstraction)
- **Security**: JWT, Rate Limiting (Upstash/Redis), strict CSP

## 🛠️ Tech Stack

- **Core**: React 19, Next.js 15
- **Styling**: Vanilla CSS + Tailwind
- **Database**: MongoDB Driver
- **Authentication**: Custom JWT-based Auth
- **Validation**: Zod
- **Icons**: Lucide React

## 📄 Documentation

- [Architecture Guide](./ARCHITECTURE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Testing Guide](./TESTING.md)