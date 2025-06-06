# SevaLink - Public Grievance Redressal System

SevaLink is a comprehensive public grievance redressal system that connects citizens with government departments for efficient complaint resolution.

## Features

- **Citizen Portal**
  - File new complaints with attachments
  - Track complaint status in real-time
  - View complaint history and updates
  - Rate and provide feedback on resolved complaints

- **Department Portal**
  - Manage assigned complaints
  - Update complaint status
  - Escalate issues when necessary
  - Communicate with citizens

- **Admin Dashboard**
  - Monitor all complaints
  - Assign complaints to departments
  - Generate reports and analytics
  - Manage system users

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **File Storage**: Local file system (can be extended to AWS S3/Cloudinary)
- **Deployment**: Vercel (Frontend) + MongoDB Atlas (Database)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account or local MongoDB instance
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Alearner12/sevalink.git
   cd sevalink
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Update the values in `.env.local` with your configuration.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=sevalink

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Other
NODE_ENV=development
```

## Project Structure

```
sevalink/
├── src/
│   ├── app/                  # Next.js 13+ App Router
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # User dashboard
│   │   └── admin/            # Admin dashboard
│   ├── components/           # Reusable components
│   ├── lib/                  # Utility functions
│   ├── models/               # Database models
│   └── types/                # TypeScript type definitions
├── public/                   # Static files
└── scripts/                  # Utility scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with ❤️ for better governance and citizen services
- Inspired by the need for transparent grievance redressal systems
