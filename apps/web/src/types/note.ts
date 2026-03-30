export type Category = 'General' | 'Work' | 'Personal' | 'Ideas' | 'Urgent' | 'Study';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}