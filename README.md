# Picha - Event Photo & Video Sharing Platform

Picha is a cloud-based event photo and video sharing platform that uses QR code technology to enable instant guest uploads and downloads. Perfect for weddings, conferences, parties, concerts, and corporate events.

## Features

- **QR Code Integration**: Generate unique QR codes for each event
- **Instant Photo Sharing**: Guests can upload photos and videos instantly
- **Cloud Storage**: Secure cloud-based storage for all event media
- **Real-time Updates**: Live photo feeds for event organizers
- **Mobile Optimized**: Responsive design for all devices
- **Face Recognition**: Advanced face detection and organization
- **Event Management**: Create and manage multiple events
- **Guest Access**: Easy guest access via QR code scanning

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Google OAuth, JWT
- **Cloud Storage**: Cloudinary, AWS S3
- **Face Recognition**: Azure Face API
- **State Management**: Zustand
- **UI Components**: Radix UI, Lucide React
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Google OAuth credentials
- Cloudinary account
- Azure Face API subscription

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd pov-web/my-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Add your environment variables:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
AZURE_FACE_API_KEY=your_azure_face_key
AZURE_FACE_ENDPOINT=your_azure_face_endpoint
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
my-app/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (landing-page)/    # Landing page components
│   ├── admin/             # Admin dashboard
│   ├── create-event/      # Event creation flow
│   ├── event/             # Event viewing and management
│   ├── my-events/         # User's events
│   └── utils/             # Utility functions
├── components/            # Reusable components
│   ├── shared/           # Shared components
│   ├── ui/               # UI components
│   └── icons/            # Custom icons
├── lib/                  # Library utilities
├── store/                # State management
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Key Features Implementation

### Event Creation

- Multi-step event creation wizard
- Event type selection (wedding, conference, party, etc.)
- QR code generation for guest access
- Event settings and permissions

### Photo Upload & Management

- Drag-and-drop photo uploads
- Real-time upload progress
- Face detection and organization
- Photo approval workflow

### Guest Experience

- QR code scanning for event access
- Mobile-optimized upload interface
- Photo viewing and downloading
- Social sharing capabilities

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Environment Variables

| Variable                            | Description             | Required |
| ----------------------------------- | ----------------------- | -------- |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`      | Google OAuth client ID  | Yes      |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name   | Yes      |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY`    | Cloudinary API key      | Yes      |
| `CLOUDINARY_API_SECRET`             | Cloudinary API secret   | Yes      |
| `AZURE_FACE_API_KEY`                | Azure Face API key      | Yes      |
| `AZURE_FACE_ENDPOINT`               | Azure Face API endpoint | Yes      |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@picha.fun or join our Discord community.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Video streaming capabilities
- [ ] AI-powered photo curation
- [ ] Multi-language support
- [ ] Enterprise features

---

Built with ❤️ by the Picha Team
