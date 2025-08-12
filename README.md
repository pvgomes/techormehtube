# TechOrMehTube - YouTube Downloader

A fast, secure, and free YouTube video and audio downloader web application. Download your favorite content in multiple formats with time range cutting capabilities, all without storing files on our servers.

![TechOrMehTube Banner](https://via.placeholder.com/800x300/e53e3e/ffffff?text=TechOrMehTube)

## ✨ Features

- **🎥 Video Downloads**: MP4, WebM, AVI formats with quality selection
- **🎵 Audio Extraction**: MP3, WAV formats with bitrate options  
- **✂️ Time Range Cutting**: Trim videos and audio to specific time segments
- **📱 Mobile Responsive**: Optimized for all device sizes
- **🔒 Privacy Focused**: No file storage on servers - direct streaming downloads
- **⚡ Real-time Progress**: Animated progress indicators with stage visualization
- **🚀 Fast Processing**: Powered by FFmpeg for efficient media processing
- **⏱️ Duration Limit**: 10-minute maximum to prevent abuse

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- FFmpeg (automatically handled in production)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd techormehtube
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

That's it! The app will be running locally with both frontend and backend services.

## 🛠️ Development

### Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── services/      # API service layer
│   │   ├── utils/         # Utility functions
│   │   ├── constants/     # App constants and configurations
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Core utilities and configurations
│   │   └── types/         # TypeScript type definitions
├── server/                # Express.js backend
│   ├── controllers/       # Request handlers
│   ├── services/          # Business logic layer
│   ├── utils/             # Server utilities
│   ├── middleware/        # Express middleware
│   ├── config/            # Configuration files
│   ├── routes/            # API route definitions
│   └── storage.ts         # Data storage interface
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database and validation schemas
├── tests/                 # Comprehensive test suite
│   ├── server/            # Server-side tests
│   ├── client/            # Client-side tests
│   └── shared/            # Shared code tests
└── README.md              # Project documentation
```

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS + shadcn/ui components
- TanStack Query for state management
- Wouter for routing
- React Hook Form with Zod validation

**Backend:**
- Express.js with TypeScript
- @distube/ytdl-core for YouTube integration
- FFmpeg for media processing
- Drizzle ORM for database operations
- Streaming downloads (no file storage)

**Development:**
- Vite for fast builds and HMR
- ESBuild for TypeScript compilation
- Hot module replacement in development

### Available Scripts

```bash
# Start development server (frontend + backend)
npm run dev

# Build for production
npm run build

# Run database migrations
npm run db:push

# Generate database migrations
npm run db:generate

# Run unit tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI/CD (no watch, with coverage)
npm run test:ci
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Optional - uses in-memory storage by default)
DATABASE_URL=postgresql://username:password@localhost:5432/database

# Node Environment
NODE_ENV=development
```

## 📡 API Endpoints

### `POST /api/video-info`
Extract YouTube video metadata and available formats.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "videoId": "VIDEO_ID",
  "title": "Video Title",
  "duration": "180",
  "thumbnail": "thumbnail_url",
  "videoFormats": [...],
  "audioFormats": [...]
}
```

### `POST /api/download`
Stream video or audio download with optional time range cutting.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "format": "mp4",
  "quality": "720p",
  "startTime": 30,
  "endTime": 120
}
```

**Response:** Direct file stream with appropriate headers.

## 🐳 Deployment

The application is containerized and ready for deployment on multiple platforms.

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t techormehtube .
   ```

2. **Run the container**
   ```bash
   docker run -p 5000:5000 techormehtube
   ```

### Platform Deployment

**Railway (Recommended):**
- Connect your GitHub repository
- Railway auto-detects the Node.js environment
- Automatic deployments on git push

**Digital Ocean App Platform:**
- Import from GitHub
- Configure build/run commands
- Auto-scaling enabled

**Digital Ocean Droplets:**
- Use provided Dockerfile
- Configure reverse proxy with Nginx
- SSL certificate setup required

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🔒 Security & Privacy

- **No File Storage**: All downloads stream directly through the server without disk storage
- **Duration Limits**: 10-minute maximum video length prevents server abuse  
- **URL Validation**: Strict YouTube URL validation and sanitization
- **Rate Limiting**: Built-in protection against excessive requests
- **CORS Security**: Properly configured cross-origin request handling

## 🧪 Testing

### Running Tests

The project includes comprehensive unit tests for both server and client code:

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

### Test Structure

- **Server Tests** (`tests/server/`): API endpoints, services, utilities, and middleware
- **Client Tests** (`tests/client/`): React components, utilities, and services  
- **Shared Tests** (`tests/shared/`): Validation schemas and shared utilities

### Coverage Goals

- **Server Code**: 90%+ coverage for critical paths (YouTube service, download logic)
- **Client Code**: 80%+ coverage for utilities and services
- **Shared Code**: 95%+ coverage for validation schemas

### Test Examples

```bash
# Test specific file
npm test -- youtube.test.ts

# Test with verbose output
npm test -- --verbose

# Test in watch mode with coverage
npm run test:watch -- --coverage
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Write tests for new functionality
4. Ensure all tests pass: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive unit tests for new features
- Maintain test coverage above 80%
- Use the existing ESLint/Prettier configuration
- Write meaningful commit messages
- Test your changes across different devices
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ytdl-core](https://github.com/distube/ytdl-core) for YouTube integration
- [FFmpeg](https://ffmpeg.org/) for media processing
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📧 Contact

**Developer**: [@_pvgomes](https://x.com/_pvgomes)

**GitHub**: [github.com/pvgomes](https://github.com/pvgomes)

**YouTube**: [@tech-or-meh](https://www.youtube.com/@tech-or-meh)

---

Built with ❤️ for the community • [Report Issues](https://github.com/pvgomes/techormehtube/issues)