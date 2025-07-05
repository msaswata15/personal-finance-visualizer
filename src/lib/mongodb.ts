import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'personal_finance';

// Don't modify the URI - use it as provided
const connectionUri = uri;

// Use MongoDB Atlas compatible connection options for serverless environments
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
  tls: true, // Enable TLS
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  retryWrites: true
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(connectionUri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(connectionUri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function getDatabase(): Promise<Db> {
  try {
    console.log('Attempting to connect to MongoDB...');
    const client = await clientPromise;
    console.log('MongoDB client connected successfully');
    const db = client.db(dbName);
    console.log('Database selected:', dbName);
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Connection details:', {
      uri: process.env.MONGODB_URI ? 'Set' : 'Not set',
      dbName: dbName,
      nodeEnv: process.env.NODE_ENV
    });
    throw error;
  }
}
