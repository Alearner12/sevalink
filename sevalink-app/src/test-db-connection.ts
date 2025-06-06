import { connectToDatabase } from './lib/mongodb';
import mongoose from 'mongoose';

async function testConnection() {
  try {
    console.log('🚀 Testing MongoDB connection...');
    const connection = await connectToDatabase();
    
    if (!connection || !connection.db) {
      throw new Error('Failed to establish database connection');
    }

    const db = connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('✅ Successfully connected to MongoDB');
    console.log(`📊 Database: ${db.databaseName}`);
    console.log(`📚 Collections (${collections.length}):`);
    collections.forEach((col: any, index: number) => {
      console.log(`  ${index + 1}. ${col.name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  } finally {
    // Close the connection when done
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
}

testConnection();
