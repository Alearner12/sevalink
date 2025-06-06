const mongoose = require('mongoose');
require('dotenv').config();

async function checkConnection() {
  try {
    console.log('🔄 Checking MongoDB connection...');
    
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    console.log('🔗 Using connection string:', uri.replace(/:[^:]*@/, ':*****@'));
    console.log('🔍 Attempting to connect...');
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      dbName: process.env.MONGODB_DB || 'test'
    });
    
    console.log('✅ Connected to MongoDB!');
    console.log('📊 Database name:', conn.connection.db.databaseName);
    
    // List all collections (won't show anything if the database is empty)
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📚 Collections:', collections.map(c => c.name));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
}

checkConnection();
