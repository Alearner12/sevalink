# SevaLink Setup Guide

## Prerequisites

1. **Node.js** (v18 or later)
2. **MongoDB** (Local or MongoDB Atlas)
3. **Cloudinary Account** (for file uploads)
4. **Email Service** (Gmail/SMTP for notifications)

## Quick Setup

### 1. Environment Configuration

Create a `.env.local` file in the root directory with these variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sevalink?retryWrites=true&w=majority
MONGODB_DB=sevalink

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters-long

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (for notifications)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=noreply@yourdomain.com
EMAIL_SERVER_PASSWORD=your-app-password

# SMS Configuration (optional)
TEXTLOCAL_API_KEY=your-textlocal-api-key

# Application Configuration
NODE_ENV=development
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Option A: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and add to `MONGODB_URI`
4. Whitelist your IP address

#### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/sevalink`

### 4. Cloudinary Setup (for file uploads)

1. Create account at [Cloudinary](https://cloudinary.com)
2. Get API credentials from dashboard
3. Add to environment variables

### 5. Email Setup (for notifications)

#### Gmail Setup:
1. Enable 2FA on your Gmail account
2. Generate App Password
3. Use app password in `EMAIL_SERVER_PASSWORD`

### 6. Initialize Database

```bash
npm run dev
```

Then visit: `http://localhost:3001/api/seed` to initialize the database with sample data.

### 7. Access the Application

- **Main Site**: http://localhost:3001
- **Admin Panel**: http://localhost:3001/admin
- **Public Dashboard**: http://localhost:3001/dashboard
- **File Complaint**: http://localhost:3001/complaints/new
- **Track Complaint**: http://localhost:3001/complaints/track

## Features

### Core Functionality
- ✅ Complaint Filing System
- ✅ Real-time Tracking
- ✅ File Upload Support
- ✅ Smart Department Routing
- ✅ Admin Dashboard
- ✅ Public Transparency Dashboard
- ✅ Email/SMS Notifications
- ✅ Multi-language Support (Hindi/English)
- ✅ Mobile Responsive Design
- ✅ PWA Support

### Government Departments Supported
- Bihar State Electricity Board (BSEB)
- Patna Municipal Corporation
- Indian Railways
- Bihar Police
- Public Health Department
- Education Department
- Roads & Transport
- Water Supply Department

## API Endpoints

### Complaints
- `POST /api/complaints` - File new complaint
- `GET /api/complaints` - List complaints (with filters)
- `GET /api/complaints/[id]` - Get specific complaint
- `PATCH /api/complaints/[id]` - Update complaint status

### File Upload
- `POST /api/upload` - Upload files (images, PDFs, documents)

### Database
- `POST /api/seed` - Initialize database with sample data
- `GET /api/test-db` - Test database connection

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check `MONGODB_URI` format
   - Ensure IP is whitelisted in Atlas
   - Verify credentials

2. **File Upload Not Working**
   - Check Cloudinary credentials
   - Ensure file size is under 10MB
   - Verify supported file types

3. **Email Notifications Failing**
   - Check SMTP credentials
   - Use app passwords for Gmail
   - Verify port and host settings

4. **Port 3000 in Use**
   - App automatically uses port 3001
   - Or set custom port: `PORT=3002 npm run dev`

## Development

### Database Schema

The application uses the following models:
- **Complaint**: Main complaint entity with status tracking
- **Department**: Government departments and their details
- **User**: Admin users and authentication

### Key Features Implementation

1. **Smart Routing**: AI-powered complaint categorization
2. **Real-time Updates**: Live status tracking with notifications
3. **File Management**: Secure file upload with Cloudinary
4. **Analytics**: Public dashboard with department performance
5. **Security**: Input validation, file type restrictions, rate limiting

## Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
# ... other variables with production values
```

### Build for Production
```bash
npm run build
npm start
```

## Support

For issues or questions:
1. Check this setup guide
2. Review error logs in browser console
3. Verify environment variables
4. Test database connectivity at `/api/test-db`

---

**SevaLink** - Connecting Citizens to Government Services 