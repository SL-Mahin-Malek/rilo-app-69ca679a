import { create } from 'zustand';
import { api } from '@/lib/api';
import type { Category } from '@/types/note';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

interface NoteState {
  notes: Note[];
  searchQuery: string;
  selectedCategory: Category | 'All';
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchNotes: () => Promise<void>;
  addNote: (title: string, content: string, category: Category) => Promise<void>;
  updateNote: (id: string, title: string, content: string, category: Category) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: Category | 'All') => void;
}

export const useNoteStore = create<NoteState>()((set, _get) => ({
  notes: [],
  searchQuery: '',
  selectedCategory: 'All',
  isLoading: false,
  error: null,

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<{ data: Note[] }>('/notes');
      set({ notes: data || [], isLoading: false });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to fetch notes', 
        isLoading: false 
      });
    }
  },

  addNote: async (title: string, content: string, category: Category) => {
    set({ error: null });
    try {
      const { data } = await api.post<{ data: Note }>('/notes', { 
        title, 
        content, 
        category 
      });
      
      if (data) {
        set((state) => ({ 
          notes: [data, ...state.notes] 
        }));
      }
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to add note' 
      });
      throw err;
    }
  },

  updateNote: async (id: string, title: string, content: string, category: Category) => {
    set({ error: null });
    try {
      const { data } = await api.put<{ data: Note }>(`/notes/${id}`, { 
        title, 
        content, 
        category 
      });
      
      if (data) {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? data : note
          ),
        }));
      }
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to update note' 
      });
      throw err;
    }
  },

  deleteNote: async (id: string) => {
    set({ error: null });
    try {
      await api.delete(`/notes/${id}`);
      
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      }));
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to delete note' 
      });
      throw err;
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setSelectedCategory: (category: Category | 'All') => {
    set({ selectedCategory: category });
  },
}));