// Quick script to create MongoDB collections
// Run this with: node create-collections.js

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: 'server/.env' });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function createCollections() {
  const client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
  });

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('live-learn-hub');
    
    // Get existing collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('\n📊 Existing collections:', collectionNames);
    
    // Create conversations collection
    if (!collectionNames.includes('conversations')) {
      await db.createCollection('conversations');
      console.log('✅ Created conversations collection');
      
      await db.collection('conversations').createIndex({ 'participants.userId': 1 });
      await db.collection('conversations').createIndex({ updatedAt: -1 });
      console.log('✅ Created conversations indexes');
    } else {
      console.log('ℹ️  conversations collection already exists');
    }
    
    // Create messages collection
    if (!collectionNames.includes('messages')) {
      await db.createCollection('messages');
      console.log('✅ Created messages collection');
      
      await db.collection('messages').createIndex({ conversationId: 1 });
      await db.collection('messages').createIndex({ createdAt: 1 });
      await db.collection('messages').createIndex({ senderId: 1 });
      console.log('✅ Created messages indexes');
    } else {
      console.log('ℹ️  messages collection already exists');
    }
    
    // Create calls collection
    if (!collectionNames.includes('calls')) {
      await db.createCollection('calls');
      console.log('✅ Created calls collection');
      
      await db.collection('calls').createIndex({ conversationId: 1 });
      await db.collection('calls').createIndex({ status: 1 });
      console.log('✅ Created calls indexes');
    } else {
      console.log('ℹ️  calls collection already exists');
    }
    
    console.log('\n🎉 Database setup complete!');
    console.log('\n📋 Collections in database:');
    const finalCollections = await db.listCollections().toArray();
    finalCollections.forEach(c => console.log(`   - ${c.name}`));
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

createCollections();
