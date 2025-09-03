# Cloudinary Setup Guide

To enable media uploads to Cloudinary, you need to configure the following environment variables:

## Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=pov_events
NEXT_PUBLIC_CLOUDINARY_API_KEY=your-api-key

# Backend API URL
NEXT_PUBLIC_API_URL=https://pxfbackend.onrender.com/api/v1
```

## Cloudinary Setup Steps

1. **Create a Cloudinary Account**

   - Go to [cloudinary.com](https://cloudinary.com) and sign up
   - Get your Cloud Name from the dashboard

2. **Create an Upload Preset**

   - Go to Settings > Upload
   - Scroll down to "Upload presets"
   - Click "Add upload preset"
   - Set the preset name to `pov_events`
   - Set signing mode to "Unsigned"
   - In the "Upload manipulations" section, you can optionally add:
     - For images: `f_auto,q_auto` (auto format, auto quality)
     - For videos: `f_auto` (auto format)
   - Save the preset

3. **Get Your API Key**

   - Go to Settings > Access Keys
   - Copy your API Key

4. **Update Environment Variables**
   - Replace `your-cloud-name` with your actual Cloudinary cloud name
   - Replace `your-api-key` with your actual API key
   - The upload preset should be `pov_events`

## How It Works

1. When a user uploads media files, they are first uploaded to Cloudinary
2. Cloudinary returns secure URLs for the uploaded files
3. These URLs are then sent to your backend API
4. Your backend stores the URLs in the database

## Security Notes

- The upload preset is set to "unsigned" for client-side uploads
- Files are organized in a "pov-events" folder in Cloudinary
- Files are tagged with "pov-events" for better organization
- Transformations should be configured in the upload preset, not in the client code
- Videos are uploaded as-is for better quality control
