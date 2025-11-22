import { getDatabase } from '../db.js';

export async function initializeCollections() {
  try {
    const db = await getDatabase();
    
    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Create conversations collection
    if (!collectionNames.includes('conversations')) {
      await db.createCollection('conversations');
      console.log('Created conversations collection');
      
      // Create indexes
      await db.collection('conversations').createIndex({ 'participants.userId': 1 });
      await db.collection('conversations').createIndex({ updatedAt: -1 });
      console.log('Created conversations indexes');
    }
    
    // Create messages collection
    if (!collectionNames.includes('messages')) {
      await db.createCollection('messages');
      console.log('Created messages collection');
      
      // Create indexes
      await db.collection('messages').createIndex({ conversationId: 1 });
      await db.collection('messages').createIndex({ createdAt: 1 });
      await db.collection('messages').createIndex({ senderId: 1 });
      console.log('Created messages indexes');
    }
    
    // Create calls collection
    if (!collectionNames.includes('calls')) {
      await db.createCollection('calls');
      console.log('Created calls collection');
      
      // Create indexes
      await db.collection('calls').createIndex({ conversationId: 1 });
      await db.collection('calls').createIndex({ status: 1 });
      console.log('Created calls indexes');
    }
    
    console.log('Database collections initialized successfully');
  } catch (error) {
    console.error('Error initializing collections:', error);
    // Don't throw - let the app continue even if this fails
  }
}
