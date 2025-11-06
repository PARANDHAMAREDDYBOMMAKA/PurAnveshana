# Image Verification App

A comprehensive Next.js application for uploading and verifying images using EXIF metadata. This app allows users to upload images, automatically verifies if they were captured with a camera, extracts location data, and provides role-based access control.

## Features

- **Authentication System**: Email/password signup and login with mobile number collection
- **Role-Based Access Control**: Admin and normal user roles
- **Image Upload**: Upload images with title, description, and location
- **Image Verification**: Automatically verify images using EXIF metadata
  - Detects if image was captured with a camera
  - Extracts camera model information
  - Extracts GPS coordinates
  - Reverse geocodes GPS to location names
- **Verified Badge**: Images captured with cameras get a verified badge
- **Image Compression**: Automatic image compression before upload
- **Cloud Storage**: Images stored in Cloudinary
- **Dashboard**:
  - Admin: View all users' images
  - Users: View only their own images
- **Multi-Language Support**: Supports English, Spanish, French, German, Hindi, and Telugu

## Tech Stack

- **Frontend & Backend**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Image Storage**: Cloudinary
- **Styling**: Tailwind CSS
- **Image Processing**:
  - `exifr` for EXIF metadata extraction
  - `browser-image-compression` for client-side compression
- **Internationalization**: next-intl

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- A Cloudinary account

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

#### Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details and wait for creation (~2 minutes)

#### Get Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Run the Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Set your admin email first:
```sql
ALTER DATABASE postgres SET app.admin_email = 'your_email@example.com';
```
4. Open `supabase-schema.sql` and copy ALL contents
5. Paste into SQL Editor and click **Run**

### 3. Set Up Cloudinary

1. Create account at [https://cloudinary.com](https://cloudinary.com)
2. Copy Cloud Name, API Key, and API Secret from dashboard
3. Go to **Settings** → **Upload** → **Upload presets**
4. Click **Add upload preset**:
   - Preset name: `ml_default`
   - Signing Mode: **Unsigned**
5. Click **Save**

### 4. Configure Environment Variables

Edit `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Cloudinary (already filled in your file)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=daxzimh2f
CLOUDINARY_API_KEY=298829675738495
CLOUDINARY_API_SECRET=mDKgZiVaf2ScpvM6x2cEb66vLs4

# Admin Email (use the same email you set in Supabase)
ADMIN_EMAIL=your_email@example.com
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

### First Time Setup

1. **Create Admin Account**: Sign up with the email you set as `ADMIN_EMAIL`
2. **Create Regular Users**: Sign up with any other email

### Features

- **Admin**: View all images from all users
- **Users**: Upload and view only their own images
- **Image Verification**: Camera-captured images get a verified badge
- **Location Detection**: Automatic GPS extraction and reverse geocoding
- **Language Selection**: Switch languages in top-right corner

## How Image Verification Works

The app uses EXIF metadata:
1. Checks for camera make/model
2. Verified badge for images with camera info
3. Extracts GPS coordinates
4. Converts GPS to readable addresses

**Note**: Screenshots/downloaded images lack camera EXIF data and won't be verified.

## Project Structure

```
anilmammaproj/
├── app/                 # Pages and API routes
├── components/          # React components
├── lib/                 # Utilities (Supabase, Cloudinary, EXIF)
├── messages/            # Translation files
├── types/               # TypeScript types
├── middleware.ts        # Auth middleware
├── i18n.ts             # i18n config
└── supabase-schema.sql # Database schema
```

## Troubleshooting

- **Images not uploading**: Check Cloudinary `ml_default` preset is Unsigned
- **Database errors**: Ensure SQL schema was run in Supabase
- **Admin role not working**: Email must match exactly (case-sensitive)
- **Location not detected**: Images need GPS EXIF data from camera

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own images
- Admins have read-only access to all images

## Deploy on Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables from `.env.local`
4. Deploy
