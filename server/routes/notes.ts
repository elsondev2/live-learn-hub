import express from 'express';
import { getDatabase } from '../db.js';
import { ObjectId } from 'mongodb';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const db = await getDatabase();
    // Students can see all notes, teachers see only their own
    const query = req.userRole === 'STUDENT' ? {} : { user_id: req.userId };
    const notes = await db.collection('notes')
      .find(query)
      .sort({ created_at: -1 })
      .toArray();
    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const db = await getDatabase();
    // Students can view any note, teachers can only view their own
    const query = req.userRole === 'STUDENT' 
      ? { _id: new ObjectId(req.params.id) }
      : { _id: new ObjectId(req.params.id), user_id: req.userId };
    
    const note = await db.collection('notes').findOne(query);
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { title, content } = req.body;
    const db = await getDatabase();
    
    const result = await db.collection('notes').insertOne({
      user_id: req.userId,
      title,
      content,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    res.json({ _id: result.insertedId });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { title, content } = req.body;
    const db = await getDatabase();
    
    const result = await db.collection('notes').updateOne(
      { _id: new ObjectId(req.params.id), user_id: req.userId },
      { $set: { title, content, updated_at: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const db = await getDatabase();
    const result = await db.collection('notes').deleteOne({
      _id: new ObjectId(req.params.id),
      user_id: req.userId
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;
