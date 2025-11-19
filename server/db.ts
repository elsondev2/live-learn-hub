import { MongoClient, Db } from 'mongodb';
import { config } from './config.js';

const uri = config.mongodbUri;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('live-learn-hub');
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}
