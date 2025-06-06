import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import Department from '@/models/Department';
import User from '@/models/User';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    const dbConnection = await connectToDatabase();
    
    // Test collections
    const collections = await Promise.all([
      Complaint.countDocuments(),
      Department.countDocuments(),
      User.countDocuments()
    ]);

    // Get database stats
    const db = dbConnection.db;
    const stats = await db.stats();

    // Get recent complaints
    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('complaintId title status createdAt')
      .lean();

    // Get departments
    const departments = await Department.find()
      .select('name category isActive')
      .lean();

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      connectionStatus: 'Connected',
      database: {
        name: db.databaseName,
        size: stats.dataSize,
        collections: stats.collections,
        indexes: stats.indexes
      },
      collections: {
        complaints: collections[0],
        departments: collections[1],
        users: collections[2]
      },
      data: {
        recentComplaints,
        departments
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Database test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 