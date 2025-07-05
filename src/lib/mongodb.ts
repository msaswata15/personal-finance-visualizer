import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'personal_finance';

// Optimized connection options for Vercel serverless environment
const options = {
  maxPoolSize: 1, // Use minimal pool size for serverless
  serverSelectionTimeoutMS: 5000, // Reduced timeout for faster failures
  socketTimeoutMS: 45000, // 45 second socket timeout
  connectTimeoutMS: 10000, // 10 second connection timeout
  maxIdleTimeMS: 30000, // Close connections after 30 seconds
  retryWrites: true,
};

let client: MongoClient;

// Use global variable to persist connection across function calls
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalWithMongo._mongoClientPromise) {
  client = new MongoClient(uri, options);
  globalWithMongo._mongoClientPromise = client.connect();
}

const clientPromise = globalWithMongo._mongoClientPromise;

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function getDatabase(): Promise<Db> {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
    console.log('DB Name:', dbName);
    
    const client = await Promise.race([
      clientPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB connection timeout')), 15000)
      )
    ]) as MongoClient;
    
    console.log('MongoDB client connected successfully');
    
    const db = client.db(dbName);
    console.log('Database selected:', dbName);
    
    // Test the connection with a simple operation
    await db.admin().ping();
    console.log('MongoDB ping successful');
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Connection details:', {
      uri: process.env.MONGODB_URI ? 'Set' : 'Not set',
      uriLength: process.env.MONGODB_URI?.length || 0,
      dbName: dbName,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorStack: error instanceof Error ? error.stack : 'No stack'
    });
    
    // Reset the client promise for next attempt
    if (globalWithMongo._mongoClientPromise) {
      globalWithMongo._mongoClientPromise = undefined;
    }
    
    throw error;
  }
}
