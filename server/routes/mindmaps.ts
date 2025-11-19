import express from 'express';
import { getDatabase } from '../db.js';
import { ObjectId } from 'mongodb';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const db = await getDatabase();
    // Students can see all mind maps, teachers see only their own
    const query = req.userRole === 'STUDENT' ? {} : { user_id: req.userId };
    const mindMaps = await db.collection('mind_maps')
      .find(query)
      .sort({ created_at: -1 })
      .toArray();
    res.json(mindMaps);
  } catch (error) {
    console.error('Get mind maps error:', error);
    res.status(500).json({ error: 'Failed to fetch mind maps' });
  }
});

router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const db = await getDatabase();
    // Students can view any mind map, teachers can only view their own
    const query = req.userRole === 'STUDENT' 
      ? { _id: new ObjectId(req.params.id) }
      : { _id: new ObjectId(req.params.id), user_id: req.userId };
    
    const mindMap = await db.collection('mind_maps').findOne(query);
    
    if (!mindMap) {
      return res.status(404).json({ error: 'Mind map not found' });
    }
    
    res.json(mindMap);
  } catch (error) {
    console.error('Get mind map error:', error);
    res.status(500).json({ error: 'Failed to fetch mind map' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { title, nodes, edges } = req.body;
    const db = await getDatabase();
    
    const result = await db.collection('mind_maps').insertOne({
      user_id: req.userId,
      title,
      nodes,
      edges,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    res.json({ _id: result.insertedId });
  } catch (error) {
    console.error('Create mind map error:', error);
    res.status(500).json({ error: 'Failed to create mind map' });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { title, nodes, edges } = req.body;
    const db = await getDatabase();
    
    const result = await db.collection('mind_maps').updateOne(
      { _id: new ObjectId(req.params.id), user_id: req.userId },
      { $set: { title, nodes, edges, updated_at: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Mind map not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Update mind map error:', error);
    res.status(500).json({ error: 'Failed to update mind map' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const db = await getDatabase();
    const result = await db.collection('mind_maps').deleteOne({
      _id: new ObjectId(req.params.id),
      user_id: req.userId
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Mind map not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete mind map error:', error);
    res.status(500).json({ error: 'Failed to delete mind map' });
  }
});

export default router;
