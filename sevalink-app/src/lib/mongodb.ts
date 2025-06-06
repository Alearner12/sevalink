import mongoose, { ConnectOptions } from 'mongoose';

// Define the connection type
interface MongoConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Type-safe way to access environment variables
const getEnv = (key: string, defaultValue: string = ''): string => {
  // In browser environment, always return default value
  if (typeof window !== 'undefined') {
    return defaultValue;
  }
  
  // In Node.js environment, safely access process.env
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[key];
    return value !== undefined ? value : defaultValue;
  }
  
  return defaultValue;
};

// Get MongoDB URI from environment variables - ensure this is set in .env.local
const MONGODB_URI = getEnv(
  'MONGODB_URI',
  '' // No default value in production
);

// Get the database name from environment or use a default for development
const DB_NAME = getEnv('MONGODB_DB', 'sevalink');

if (!MONGODB_URI) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('MONGODB_URI environment variable is required in production');
  } else {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }
}

// Parse the MongoDB URI to ensure it's valid and extract components
let FINAL_MONGODB_URI: string;

try {
  // Create a new URL object from the connection string
  const url = new URL(MONGODB_URI);
  
  // Log the original connection details (without credentials)
  const originalSafeUrl = new URL(MONGODB_URI);
  originalSafeUrl.password = '*****';
  originalSafeUrl.username = '*****';
  console.log('🔗 Original connection string:', originalSafeUrl.toString());
  
  // Always use the database name from MONGODB_DB environment variable
  // Remove any existing database name from the path
  url.pathname = `/${DB_NAME}`;
  
  // Set the final connection string
  FINAL_MONGODB_URI = url.toString();
  
  // Log the final connection details (without credentials)
  const safeUrl = new URL(FINAL_MONGODB_URI);
  safeUrl.password = '*****';
  safeUrl.username = '*****';
  console.log(`🔗 Final connection string: ${safeUrl.toString()}`);
  console.log(`📊 Using database: ${DB_NAME}`);
  
} catch (error) {
  console.error('❌ Invalid MongoDB URI:', error);
  throw new Error('Invalid MongoDB connection string');
}

// Type for the database connection result
export interface DatabaseConnection {
  mongoose: typeof mongoose;
  db: typeof mongoose.connection.db;
  connection: mongoose.Connection;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

// Type-safe way to access global object
type GlobalWithMongoose = typeof globalThis & {
  _mongoose?: MongoConnection;
};

function getGlobal(): GlobalWithMongoose {
  if (typeof global !== 'undefined') {
    return global as GlobalWithMongoose;
  }
  return window as unknown as GlobalWithMongoose;
}

// Initialize cached connection
let cached: MongoConnection = {
  conn: null,
  promise: null
};

// Only use global in Node.js environment
if (typeof window === 'undefined') {
  const globalObj = getGlobal();
  // Use existing cached connection if available
  if (globalObj._mongoose) {
    cached = globalObj._mongoose;
  }
}

/**
 * Connects to the MongoDB database using the connection string from the environment variables.
 * Reuses existing connection if available.
 * @returns {Promise<DatabaseConnection>} Database connection object with mongoose instance and db reference
 */
async function connectToDatabase(): Promise<DatabaseConnection> {
  // Return cached connection if available
  if (cached.conn) {
    return {
      mongoose: cached.conn,
      db: cached.conn.connection.db,
      connection: cached.conn.connection
    };
  }

  // Create a new connection promise if none exists
  if (!cached.promise) {
    try {
      console.log('🔌 Connecting to MongoDB...');
      
      // Define connection options with proper typing
      const connectionOptions: ConnectOptions = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4, skip trying IPv6
        dbName: DB_NAME, // Explicitly set the database name
        retryWrites: true,
        w: 'majority',
        appName: 'sevalink-app',
      };
      
      console.log(`🔍 Attempting to connect to database: ${DB_NAME}`);
      console.log('🔧 Connection options:', JSON.stringify({
        ...connectionOptions,
        // Don't log sensitive info
        dbName: connectionOptions.dbName,
        appName: connectionOptions.appName
      }, null, 2));
      
      // Force a new connection to ensure no caching issues
      mongoose.connection.close();
      cached.promise = mongoose.connect(FINAL_MONGODB_URI, connectionOptions);
      
      // Get the mongoose connection
      const conn = await cached.promise;
      
      // Ensure we have a valid connection
      if (!conn || !conn.connection) {
        throw new Error('Failed to establish database connection');
      }
      
      // Get the database instance
      const db = conn.connection.db;
      if (!db) {
        throw new Error('Failed to get database instance');
      }
      
      console.log('✅ Connected to MongoDB');
      console.log(`📊 Database: ${db.databaseName}`);
      
      // Verify we're connected to the correct database
      if (db.databaseName !== DB_NAME) {
        console.warn(`⚠️  Warning: Connected to database '${db.databaseName}' but expected '${DB_NAME}'`);
        
        try {
          // Try to switch to the correct database
          await conn.connection.useDb(DB_NAME);
          console.log(`🔄 Switched to database: ${DB_NAME}`);
          
          // Return the updated connection
          return {
            mongoose: conn,
            db: conn.connection.db,
            connection: conn.connection
          };
        } catch (switchError) {
          console.error('❌ Failed to switch to database:', switchError);
          // Continue with the original connection if switch fails
        }
      }
      
      // Cache the connection
      const mongooseInstance = await cached.promise;
      console.log('✅ Successfully connected to MongoDB');
      
      // Cache the connection in development
      const isDev = getEnv('NODE_ENV', 'development') === 'development';
      if (isDev) {
        const globalObj = getGlobal();
        globalObj._mongoose = { conn: mongooseInstance, promise: cached.promise };
      }
      
      cached.conn = mongooseInstance;
      
      return {
        mongoose: mongooseInstance,
        db: mongooseInstance.connection.db,
        connection: mongooseInstance.connection
      };
      
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      cached.promise = null;
      throw error;
    }
  }

  try {
    // Wait for the existing connection promise
    const mongooseInstance = await cached.promise;
    if (!mongooseInstance) {
      throw new Error('Failed to establish database connection');
    }
    
    cached.conn = mongooseInstance;
    
    return {
      mongoose: mongooseInstance,
      db: mongooseInstance.connection.db,
      connection: mongooseInstance.connection
    };
  } catch (error) {
    // Clear the cached promise on error to allow retries
    cached.promise = null;
    throw error;
  }
}

// Export the function as both default and named export
export { connectToDatabase };
export default connectToDatabase;