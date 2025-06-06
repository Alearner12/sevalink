# SevaLink - सेवालिंक
## Unified Citizen Complaint Portal

**Connecting Citizens to Government Services**

SevaLink is a modern, unified platform that bridges the gap between citizens and government departments by providing a single portal for filing, tracking, and resolving complaints across all government services.

## 🚀 Features

### Week 1 MVP Features (Completed)
- ✅ **Unified Complaint Portal** - Single platform for all government departments
- ✅ **Smart Department Routing** - AI-powered automatic complaint routing
- ✅ **Real-time Tracking** - Track complaint status with unique IDs
- ✅ **Modern UI/UX** - Government-grade design with accessibility
- ✅ **MongoDB Integration** - Scalable database with proper schemas
- ✅ **Responsive Design** - Mobile-first approach for citizen convenience

### Supported Departments
- ⚡ Bihar State Electricity Board (BSEB)
- 🚂 Indian Railways
- 🏛️ Municipal Services
- 👮 Police Department
- 💧 Water Supply
- 🛣️ Roads & Transport
- 🏥 Health Services
- 📚 Education Department

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **UI Components**: Headless UI, Lucide React Icons
- **Styling**: Custom government color scheme with Indian flag colors

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (free tier works)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sevalink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://sid1618033:aYUuMxdFFdXQPHDy@cluster0.6dpushd.mongodb.net/sevalink?retryWrites=true&w=majority
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   ```

4. **Seed the database**
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

5. **Start the development server**
```bash
npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Usage

### For Citizens
1. **File a Complaint**: Visit `/complaints/new` to submit a new complaint
2. **Track Status**: Use `/complaints/track` with your complaint ID
3. **Get Updates**: Receive real-time status updates

### For Government Officials
1. **Admin Dashboard**: Access department-specific complaint management
2. **Update Status**: Change complaint status and add notes
3. **View Analytics**: Monitor department performance metrics

## 🗄️ Database Schema

### Complaints Collection
```javascript
{
  complaintId: "SVL2024123456",
  title: "Power outage in Gandhi Maidan",
  description: "Detailed complaint description...",
  category: "electricity",
  priority: "high",
  status: "in_progress",
  citizen: {
    name: "Rahul Kumar",
    email: "rahul@email.com",
    phone: "+91-9876543210",
    address: "Patna, Bihar"
  },
  department: {
    id: ObjectId,
    name: "BSEB"
  },
  timeline: [...],
  createdAt: Date,
  updatedAt: Date
}
```

### Departments Collection
```javascript
{
  name: "Bihar State Electricity Board",
  shortName: "BSEB",
  category: "utilities",
  location: ["patna", "bihar"],
  responseTime: 48,
  isActive: true
}
```

## 🔧 API Endpoints

- `POST /api/complaints` - File a new complaint
- `GET /api/complaints` - Get complaints list (with filters)
- `GET /api/complaints/[id]` - Get specific complaint details
- `PATCH /api/complaints/[id]` - Update complaint status
- `POST /api/seed` - Seed database with sample data

## 🎨 Design System

SevaLink uses a government-approved color scheme:
- **Primary Blue**: #3b82f6 (Digital India theme)
- **Saffron**: #f17a0e (Indian flag inspired)
- **Green**: #22c55e (Progress and success)

## 📈 Week-by-Week Development Plan

### ✅ Week 1: Foundation (Completed)
- Core complaint filing and tracking system
- Database models and API routes
- Responsive UI with government branding
- Smart department routing

### 🔄 Week 2: Smart Features (In Progress)
- SMS notifications integration
- Photo/document upload
- AI-powered categorization
- Public dashboard

### 📋 Week 3: Polish & Security
- Professional UI/UX refinements
- Security hardening
- Performance optimization
- User testing

### 🚀 Week 4: Launch & Outreach
- Government presentations
- Pilot program setup
- Media outreach
- Stakeholder engagement

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Government of Bihar for inspiration
- Digital India initiative
- Open source community
- Citizens of Bihar for their feedback

## 📞 Contact

- **Email**: help@sevalink.gov.in
- **Phone**: +91-612-2234567
- **Address**: Patna, Bihar, India

---

**SevaLink - Transforming Citizen-Government Interaction** 🇮🇳
