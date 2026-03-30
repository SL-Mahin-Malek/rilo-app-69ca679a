import { Router } from 'express';
import type { Request, Response } from 'express';
import { db } from '../lib/db.js';
import type { Note, Category, CreateNoteInput, UpdateNoteInput } from '../models/note.js';

const router = Router();

// Collection name for notes
const NOTES_COLLECTION = 'notes';

// GET /api/notes - Get all notes
router.get('/', async (_req: Request, res: Response) => {
  try {
    const notesCollection = db.collection<Note>(NOTES_COLLECTION);
    const notes = await notesCollection.find();
    res.json({ data: notes });
  } catch (error) {
    console.error('[notes] Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// GET /api/notes/:id - Get a single note by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notesCollection = db.collection<Note>(NOTES_COLLECTION);
    const note = await notesCollection.findById(id);
    
    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }
    
    res.json({ data: note });
  } catch (error) {
    console.error('[notes] Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// POST /api/notes - Create a new note
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body as CreateNoteInput;
    
    // Validate required fields
    if (!body.title && !body.content) {
      res.status(400).json({ error: 'Title or content is required' });
      return;
    }
    
    const now = new Date().toISOString();
    const newNote = {
      id: crypto.randomUUID(),
      title: body.title || '',
      content: body.content || '',
      category: body.category || 'General',
      createdAt: now,
      updatedAt: now,
    };
    
    const notesCollection = db.collection<Note>(NOTES_COLLECTION);
    const insertedId = await notesCollection.insertOne(newNote);
    
    const createdNote: Note = {
      ...newNote,
      id: insertedId,
    };
    
    res.status(201).json({ data: createdNote });
  } catch (error) {
    console.error('[notes] Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// PUT /api/notes/:id - Update an existing note
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body as UpdateNoteInput;
    
    // Validate required fields
    if (!body.title && !body.content) {
      res.status(400).json({ error: 'Title or content is required' });
      return;
    }
    
    const notesCollection = db.collection<Note>(NOTES_COLLECTION);
    const existingNote = await notesCollection.findById(id);
    
    if (!existingNote) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }
    
    const updatedNote = {
      title: body.title ?? existingNote.title,
      content: body.content ?? existingNote.content,
      category: body.category ?? existingNote.category,
      updatedAt: new Date().toISOString(),
    };
    
    const success = await notesCollection.updateOne(id, updatedNote);
    
    if (!success) {
      res.status(500).json({ error: 'Failed to update note' });
      return;
    }
    
    const updated = await notesCollection.findById(id);
    res.json({ data: updated });
  } catch (error) {
    console.error('[notes] Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notesCollection = db.collection<Note>(NOTES_COLLECTION);
    
    const existingNote = await notesCollection.findById(id);
    if (!existingNote) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }
    
    const success = await notesCollection.deleteOne(id);
    
    if (!success) {
      res.status(500).json({ error: 'Failed to delete note' });
      return;
    }
    
    res.json({ data: { success: true } });
  } catch (error) {
    console.error('[notes] Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;