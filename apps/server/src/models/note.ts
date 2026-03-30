// Type definitions for Notes API

export type Category = 'General' | 'Work' | 'Personal' | 'Ideas' | 'Urgent' | 'Study';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  category: Category;
}

export interface UpdateNoteInput {
  title: string;
  content: string;
  category: Category;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}