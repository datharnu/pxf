# Azure Face API Integration Guide

This guide explains how to use the Azure Face API integration that has been added to your POV web application.

## 🎯 Overview

The Azure Face API integration provides automatic face detection and identification in event photos, allowing users to:

1. **Enroll their face** for an event
2. **Automatically find photos** containing their face
3. **View personalized photo collections** in the "My PXF" tab
4. **Access admin analytics** for face detection statistics

## 🚀 Features Implemented

### 1. Face Enrollment System

- **FaceEnrollment Component**: Users can upload a clear photo to enroll their face
- **FaceStatus Component**: Shows enrollment status and confidence levels
- **Automatic validation**: Ensures only one face per enrollment photo

### 2. My PXF Tab

- **MyFacesView Component**: Displays photos containing the user's face
- **Face detection overlays**: Shows detected face rectangles with confidence scores
- **Pagination support**: Handles large collections of face-detected photos

### 3. Face Detection Overlays

- **FaceDetectionOverlay Component**: Shows face rectangles on photos
- **Multiple overlay types**: Standard, percentage-based, and compact versions
- **Confidence indicators**: Displays detection confidence percentages

### 4. Admin Dashboard

- **FaceStatsDashboard Component**: Real-time face detection statistics
- **Training management**: Retrain face identification system
- **Performance insights**: Success rates and user engagement metrics

### 5. Enhanced Upload Flow

- **Face processing status**: Shows when photos are being analyzed
- **Automatic detection**: All uploaded photos are processed for faces
- **Status indicators**: Visual feedback during face processing

## 📁 File Structure

```
my-app/
├── types/
│   └── face.ts                    # TypeScript types for face detection
├── app/
│   ├── utils/
│   │   └── faceApi.ts            # Face API service functions
│   └── event/
│       └── components/
│           ├── FaceEnrollment.tsx     # Face enrollment component
│           ├── FaceStatus.tsx         # Face status display
│           ├── MyFacesView.tsx        # My PXF tab content
│           ├── FaceDetectionOverlay.tsx # Face detection overlays
│           └── FaceStatsDashboard.tsx # Admin dashboard
└── AZURE_FACE_INTEGRATION_GUIDE.md   # This guide
```

## 🔧 API Endpoints Used

The integration uses these backend endpoints:

### Face Management

- `POST /api/v1/faces/events/:eventId/enroll` - Enroll user face
- `GET /api/v1/faces/events/:eventId/profile` - Get user face profile
- `DELETE /api/v1/faces/events/:eventId/profile` - Delete face profile
- `GET /api/v1/faces/events/:eventId/stats` - Get face statistics (admin)

### Media Filtering

- `GET /api/v1/media/event/:eventId/my-faces` - Get photos with user's face
- `GET /api/v1/media/event/:eventId/face-detections` - Get all face detections (admin)
- `POST /api/v1/media/event/:eventId/retrain-faces` - Retrain system (admin)

## 🎨 User Experience Flow

### 1. First-Time User

1. User visits event page
2. Clicks "My PXF" tab
3. Sees face enrollment prompt
4. Uploads clear photo of themselves
5. Face is enrolled and system starts training
6. Can now view photos with their face

### 2. Returning User

1. User visits event page
2. Clicks "My PXF" tab
3. Sees their personalized photo collection
4. Photos show face detection overlays
5. Can download or share their photos

### 3. Event Creator/Admin

1. Access face statistics dashboard
2. View detection performance metrics
3. Monitor user engagement
4. Retrain system if needed

## 🛠️ Technical Implementation

### Face Enrollment Process

```typescript
// 1. User uploads photo
const file = selectedFile;

// 2. Upload to Cloudinary
const cloudinaryData = await uploadToCloudinary(file, signatureData);

// 3. Submit to backend
const mediaResponse = await submitMediaUrls([
  {
    url: cloudinaryData.secure_url,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
    publicId: cloudinaryData.public_id,
  },
]);

// 4. Enroll face
const enrollResult = await enrollUserFace(eventId, mediaId);
```

### Face Detection Display

```typescript
// Show face detection overlays
<FaceDetectionOverlay
  faceDetections={media.faceDetections}
  showConfidence={true}
  className="absolute inset-0"
/>
```

### My PXF Tab Integration

```typescript
// In event page component
const renderContent = () => {
  if (activeFilter === "my" && hasFaceProfile === false) {
    return <FaceStatus eventId={eventId} onStatusChange={setHasFaceProfile} />;
  } else if (activeFilter === "my" && hasFaceProfile === true) {
    return <MyFacesView eventId={eventId} />;
  }
  return null;
};
```

## 🎯 Key Components

### FaceEnrollment

- **Purpose**: Allows users to enroll their face for an event
- **Features**: File validation, preview, confidence display
- **Validation**: Single face detection, file size limits

### FaceStatus

- **Purpose**: Shows current face enrollment status
- **Features**: Status indicators, profile details, delete option
- **States**: Loading, enrolled, not enrolled, error

### MyFacesView

- **Purpose**: Displays photos containing the user's face
- **Features**: Grid/list view, pagination, face overlays
- **Actions**: Download, share, preview

### FaceStatsDashboard

- **Purpose**: Admin interface for face detection analytics
- **Features**: Statistics, training status, retrain button
- **Metrics**: Detection count, identification rate, user engagement

## 🔒 Security & Privacy

### Data Protection

- Face data stored securely in Azure
- Event-specific face profiles
- User can delete their face profile
- No cross-event data sharing

### Access Control

- Face enrollment requires authentication
- Face statistics only for event creators
- Media access respects existing permissions

## 🚀 Getting Started

### 1. Environment Setup

Ensure your backend has Azure Face API configured:

```env
AZURE_FACE_ENDPOINT=https://your-region.cognitiveservices.azure.com/
AZURE_FACE_KEY=your-azure-face-api-key
```

### 2. Database Setup

Run the face detection migrations to create required tables:

- `face_detections` - Stores face detection data
- `user_face_profiles` - Stores user face enrollment data

### 3. Backend API

Implement the face detection endpoints as documented in the backend integration guide.

### 4. Frontend Integration

The components are already integrated into your event page. The "My PXF" tab will automatically show face detection features when available.

## 🎨 Customization

### Styling

All components use your existing design system:

- Tailwind CSS classes
- Shadcn UI components
- Consistent color scheme (amber/zinc)
- Responsive design

### Configuration

Modify these files to customize behavior:

- `faceApi.ts` - API endpoints and parameters
- Component props - Customize display options
- Type definitions - Add new fields as needed

## 📊 Performance Considerations

### Optimization Tips

1. **Lazy loading**: Face detection overlays only render when needed
2. **Pagination**: Large photo collections are paginated
3. **Caching**: Face profiles are cached client-side
4. **Async processing**: Face detection doesn't block uploads

### Azure Limits

- **Free Tier**: 20 calls/minute, 30,000 calls/month
- **Standard Tier**: 10 calls/second, unlimited calls
- **Image size**: Minimum 36x36 pixels, maximum 6MB

## 🐛 Troubleshooting

### Common Issues

#### Face Not Detected

- Ensure image quality is good
- Check image format (JPEG, PNG supported)
- Verify image size requirements

#### Low Identification Rate

- Retrain the face identification system
- Check if users have enrolled clear photos
- Verify Azure Face API configuration

#### Upload Errors

- Check Cloudinary configuration
- Verify file size limits
- Ensure proper authentication

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

## 🔮 Future Enhancements

### Planned Features

1. **Video face detection**: Extract frames and detect faces in videos
2. **Bulk operations**: Batch face enrollment and processing
3. **Advanced analytics**: More detailed face detection insights
4. **Mobile optimization**: Better mobile face enrollment experience

### Integration Opportunities

1. **Social features**: Tag friends in photos
2. **AI recommendations**: Suggest best photos based on face quality
3. **Export features**: Create personalized photo albums
4. **Notification system**: Alert users when new photos with their face are uploaded

## 📞 Support

For issues related to:

- **Azure Face API**: Check [Azure documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/face/)
- **Integration Issues**: Check browser console and network tabs
- **Performance**: Monitor API usage and database queries

## 🎉 Conclusion

The Azure Face API integration provides a powerful way to enhance user experience by automatically organizing photos based on face detection. Users can easily find photos of themselves, while event creators get valuable insights into photo engagement.

The implementation is fully integrated into your existing codebase and follows your design patterns. All components are responsive, accessible, and optimized for performance.
