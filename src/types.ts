/**
 * TypeScript definitions mirroring the Room Entity and Android application models.
 */

export interface NoteItem {
  id: number;
  title: string;
  content: string;
  category: 'Personal' | 'Work' | 'Study' | 'Ideas';
  isPinned: boolean;
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
}

export type CategoryFilter = 'All' | 'Personal' | 'Work' | 'Study' | 'Ideas';

export type CurrentScreen = 
  | { type: 'LIST' }
  | { type: 'DETAIL'; noteId: number }
  | { type: 'ADD' }
  | { type: 'EDIT'; noteId: number };

export interface ProjectFile {
  path: string;
  name: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'markdown' | 'properties';
  content: string;
}

export interface TestCaseResult {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  log?: string;
}
