# SevaLink - Advanced Government Complaint Portal

**SevaLink (सेवालिंक)** is a comprehensive, enterprise-grade digital platform that revolutionizes citizen-government interaction by providing a unified portal for filing, tracking, and resolving complaints across all government departments.

## 🚀 Enhanced Features

### Core Functionality
- ✅ **Smart Complaint Filing** - AI-powered department routing with file upload support
- ✅ **Real-time Tracking** - Live status updates with detailed timeline
- ✅ **Multi-department Integration** - Unified portal for all government services
- ✅ **Advanced Search & Analytics** - Comprehensive filtering and reporting
- ✅ **Feedback & Rating System** - Citizen satisfaction tracking
- ✅ **Notification System** - Email/SMS alerts with status tracking
- ✅ **Admin Dashboard** - Complete management interface
- ✅ **Public Transparency Dashboard** - Real-time performance metrics
- ✅ **System Health Monitoring** - Comprehensive status monitoring

### Advanced Features
- 🔄 **Smart Department Routing** - Automatic complaint categorization
- 📊 **Analytics Engine** - Real-time statistics and performance metrics
- 🔍 **Advanced Search** - Multi-criteria filtering with pagination
- 📱 **Progressive Web App** - Mobile-first responsive design
- 🌐 **Multi-language Support** - Hindi and English interfaces
- 🔐 **Secure File Upload** - Cloudinary integration with validation
- 📧 **Notification Tracking** - Complete audit trail for all communications
- 🏥 **Health Monitoring** - Real-time system status dashboard

## 🏛️ Government Departments Supported

| Department | Category | Services |
|------------|----------|----------|
| Bihar State Electricity Board (BSEB) | Utilities | Power outages, billing, connections |
| Patna Municipal Corporation | Municipal | Sanitation, roads, permits |
| Indian Railways | Transportation | Booking, delays, facilities |
| Bihar Police | Police | Safety, crime reporting, traffic |
| Public Health Department | Health | Medical facilities, sanitation |
| Education Department | Education | Schools, scholarships, infrastructure |
| Roads & Transport | Transportation | Road maintenance, licensing |
| Water Supply Department | Utilities | Water supply, quality, billing |

## 📋 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (Atlas or local)
- Cloudinary account (for file uploads)
- Email service (Gmail/SMTP)

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd sevalink
   npm install
   ```

2. **Environment Setup**
   Create `.env.local`:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sevalink
   MONGODB_DB=sevalink
   
   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-32-characters-minimum
   
   # File Upload
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Notifications
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-email@gmail.com
   EMAIL_SERVER_PASSWORD=your-app-password
   
   # Optional SMS
   TEXTLOCAL_API_KEY=your-textlocal-key
   ```

3. **Database Setup**
   ```bash
   npm run dev
   # Visit http://localhost:3001/api/seed to initialize database
   ```

4. **Access Application**
   - Main site: http://localhost:3001
   - Admin panel: http://localhost:3001/admin
   - Dashboard: http://localhost:3001/dashboard
   - System status: http://localhost:3001/system-status

## 🛠️ API Endpoints

### Complaints Management
- `POST /api/complaints` - File new complaint
- `GET /api/complaints` - List complaints with filters
- `GET /api/complaints/[id]` - Get specific complaint
- `PATCH /api/complaints/[id]` - Update complaint status
- `GET /api/complaints/search` - Advanced search with filters
- `POST /api/complaints/[id]/feedback` - Submit citizen feedback

### Analytics & Reporting
- `GET /api/analytics` - Comprehensive system analytics
- `GET /api/analytics?timeframe=30` - Time-based analytics

### File Management
- `POST /api/upload` - Secure file upload to Cloudinary

### System Monitoring
- `GET /api/test-db` - Database connection health check
- `GET /api/notifications/status` - Notification system status
- `POST /api/seed` - Initialize database with sample data

## 📊 Dashboard Features

### Public Transparency Dashboard
- Real-time complaint statistics
- Department performance metrics
- Resolution rate tracking
- Monthly trend analysis
- Category breakdown
- Public accountability metrics

### Admin Management Console
- Complaint status management
- Department oversight
- Performance monitoring
- User management
- System configuration
- Export capabilities

### System Status Monitor
- Real-time health checks
- Service availability monitoring
- Response time tracking
- Error logging and alerts
- Performance metrics
- Auto-refresh functionality

## 🎯 Key Metrics Tracked

| Metric | Description |
|--------|-------------|
| Total Complaints | All complaints filed |
| Resolution Rate | Percentage of resolved complaints |
| Avg Response Time | Mean time to resolution |
| Department Performance | Individual department metrics |
| Citizen Satisfaction | Average rating from feedback |
| System Uptime | Service availability percentage |

## 🔧 Advanced Configuration

### Smart Routing Rules
The system automatically routes complaints based on:
- **Keywords** in title and description
- **Category** selection by user
- **Location** data (pincode, district)
- **Priority** level assessment
- **Department** availability and workload

### Notification Preferences
- **Email notifications** for all status updates
- **SMS alerts** for urgent complaints
- **Timeline updates** with detailed notes
- **Feedback requests** post-resolution
- **Escalation alerts** for delayed responses

### Performance Optimization
- **Database indexing** for fast queries
- **Caching** for frequently accessed data
- **Pagination** for large datasets
- **Load balancing** for high traffic
- **CDN integration** for file delivery

## 🌟 Technical Architecture

### Frontend
- **Next.js 15** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for form management
- **Lucide React** for icons

### Backend
- **Node.js** with Next.js API routes
- **MongoDB** with Mongoose ODM
- **Cloudinary** for file storage
- **JWT** for authentication
- **Email/SMS** integration

### Security Features
- Input validation and sanitization
- File type and size restrictions
- Rate limiting and CORS protection
- Secure environment variable handling
- Database connection encryption

## 📱 Mobile Experience

SevaLink is designed mobile-first with:
- **Responsive design** across all devices
- **Progressive Web App** capabilities
- **Offline functionality** for rural areas
- **Touch-optimized** interface
- **Fast loading** on slow connections

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check `MONGODB_URI` format
   - Verify IP whitelist in Atlas
   - Test connection at `/api/test-db`

2. **File Upload Failing**
   - Verify Cloudinary credentials
   - Check file size limits (10MB max)
   - Ensure supported file types

3. **Email Notifications Not Working**
   - Use app-specific passwords for Gmail
   - Check SMTP settings
   - Verify email server connectivity

4. **System Status Shows Errors**
   - Visit `/system-status` for detailed diagnostics
   - Check individual service endpoints
   - Review console logs for errors

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure production database
- [ ] Set up SSL certificates
- [ ] Configure environment variables
- [ ] Set up monitoring and logging
- [ ] Test all functionality
- [ ] Set up backup procedures

### Performance Monitoring
- Use `/system-status` for health checks
- Monitor `/api/analytics` for usage patterns
- Set up alerts for downtime
- Track response times and errors

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:
- Code style and standards
- Testing requirements
- Documentation updates
- Feature proposals
- Bug reporting

## 📞 Support

For technical support:
- **Documentation**: Check `SETUP.md` for detailed setup
- **System Status**: Visit `/system-status` for real-time monitoring
- **API Documentation**: Available at `/api` endpoints
- **Health Checks**: Use `/api/test-db` for diagnostics

---

**SevaLink** - Transforming citizen-government interaction through technology, transparency, and accountability.

Built with ❤️ for digital governance in Bihar, India.
