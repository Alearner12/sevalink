import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Only allow this endpoint in development
const isDevelopment = process.env.NODE_ENV === 'development';

// Simple authentication check - in production, use a proper auth system
const isAuthorized = (request: NextRequest): boolean => {
  if (isDevelopment) return true;
  
  // Check for a secret token in production
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.API_TEST_TOKEN;
  
  if (!expectedToken) {
    console.warn('API_TEST_TOKEN environment variable is not set');
    return false;
  }
  
  return authHeader === `Bearer ${expectedToken}`;
};

export async function GET(request: NextRequest) {
  // In production, require authentication
  if (!isDevelopment && !isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Connect to the database
    console.log('🔌 Testing MongoDB connection...');
    const connection = await connectToDatabase();
    
    if (!connection) {
      throw new Error('Failed to establish database connection');
    }
    
    // Get the database instance safely
    if (!connection.db) {
      throw new Error('Database instance not available');
    }
    
    const db = connection.db;
    
    // In production, only return minimal information
    if (!isDevelopment) {
      return NextResponse.json({
        success: true,
        message: 'Successfully connected to MongoDB',
        database: { name: db.databaseName },
        connectionStatus: 'Connected'
      });
    }
    
    // Only in development, show more detailed information
    let additionalInfo = {};
    
    try {
      const [collections, dbStats] = await Promise.all([
        db.listCollections().toArray(),
        db.stats().catch(() => null)
      ]);
      
      const collectionNames = collections.map(c => ({
        name: c.name,
        type: 'type' in c && c.type ? String(c.type) : 'collection'
      }));
      
      additionalInfo = {
        collections: collectionNames,
        ...(dbStats && { 
          stats: {
            collections: dbStats.collections,
            objects: dbStats.objects,
            avgObjSize: dbStats.avgObjSize,
            storageSize: dbStats.storageSize
          } 
        })
      };
    } catch (infoError) {
      console.warn('Could not gather additional database info:', infoError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to MongoDB',
      database: {
        name: db.databaseName,
        ...additionalInfo
      },
      connectionStatus: 'Connected',
      environment: 'development',
      note: 'Detailed information is only shown in development mode'
    });
    
  } catch (error: unknown) {
    console.error('❌ Database connection error:', error);
    
    // In production, show minimal error details
    if (!isDevelopment) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed',
          message: 'Could not connect to the database'
        },
        { status: 500 }
      );
    }
    
    // In development, show more detailed error information
    let errorMessage = 'Unknown error occurred';
    let errorDetails: Record<string, unknown> = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        ...('code' in error && { code: (error as any).code }),
        stack: error.stack
      };
      
      // Handle common MongoDB connection errors
      if (error.name === 'MongoServerSelectionError') {
        errorMessage = 'Could not connect to MongoDB server. Please check your connection string and ensure the server is running.';
      } else if (error.name === 'MongoNetworkError') {
        errorMessage = 'Network error while connecting to MongoDB. Please check your network connection.';
      } else if (error.name === 'MongoError' && (error as any).code === 'ENOTFOUND') {
        errorMessage = 'Could not resolve MongoDB host. Please check your connection string.';
      } else if (error.name === 'MongoServerError' && (error as any).code === 8000) {
        errorMessage = 'Connected to MongoDB, but the user has limited permissions. Some features may not be available.';
        errorDetails.note = 'The database user does not have admin privileges. This is normal for restricted database users.';
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to connect to MongoDB',
        message: errorMessage,
        details: errorDetails,
        note: 'Detailed error information is only shown in development mode'
      },
      { status: 500 }
    );
  }
}
