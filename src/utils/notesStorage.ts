import { CategoryFilter, NoteItem } from '../types';

const STORAGE_KEY = 'syntecxhub_notes_room_db';

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 1,
    title: 'Android Development',
    content: 'Learning Room Database and ViewModel in Week 2 internship project.',
    category: 'Study',
    isPinned: true,
    isArchived: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    updatedAt: Date.now() - 1000 * 60 * 30, // 30 mins ago
  },
  {
    id: 2,
    title: 'Kotlin Coroutines Flow Notes',
    content: 'StateFlow versus SharedFlow in Android MVVM architecture. Collect flows within lifecycleScope.',
    category: 'Study',
    isPinned: true,
    isArchived: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 3,
    title: 'SyntecxHub Weekly Standup',
    content: 'Prepare demo of Room SQLite persistence, database migration support, and RecyclerView ListAdapter with DiffUtil.',
    category: 'Work',
    isPinned: false,
    isArchived: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    updatedAt: Date.now() - 1000 * 60 * 60 * 1,
  },
  {
    id: 4,
    title: 'Weekend Grocery Checklist',
    content: 'Almond milk, whole wheat bread, green apples, Greek yogurt, coffee beans.',
    category: 'Personal',
    isPinned: false,
    isArchived: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    updatedAt: Date.now() - 1000 * 60 * 60 * 4,
  },
  {
    id: 5,
    title: 'App Ideas: Offline Expense Tracker',
    content: 'Explore Room relations (1-to-many) between Expense Categories and Transaction entities.',
    category: 'Ideas',
    isPinned: false,
    isArchived: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 96,
    updatedAt: Date.now() - 1000 * 60 * 60 * 8,
  },
  {
    id: 6,
    title: 'Archive: Week 1 Kotlin Basics',
    content: 'Completed fundamentals of Kotlin syntax, null safety, sealed classes, and lambda expressions.',
    category: 'Study',
    isPinned: false,
    isArchived: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 200,
    updatedAt: Date.now() - 1000 * 60 * 60 * 150,
  }
];

export function getStoredNotes(): NoteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStoredNotes(INITIAL_NOTES);
      return INITIAL_NOTES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveStoredNotes(INITIAL_NOTES);
    return INITIAL_NOTES;
  } catch {
    return INITIAL_NOTES;
  }
}

export function saveStoredNotes(notes: NoteItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function queryStoredNotes(
  isArchived: boolean,
  category: CategoryFilter,
  search: string
): NoteItem[] {
  const notes = getStoredNotes();
  const trimmed = search.trim().toLowerCase();

  return notes
    .filter(n => {
      // Archive filter
      if (n.isArchived !== isArchived) return false;

      // Category filter
      if (category !== 'All' && n.category !== category) return false;

      // Search filter (title or content substring match)
      if (trimmed) {
        const titleMatch = n.title.toLowerCase().includes(trimmed);
        const contentMatch = n.content.toLowerCase().includes(trimmed);
        if (!titleMatch && !contentMatch) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // 1. Pinned first
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      // 2. Recently updated next
      return b.updatedAt - a.updatedAt;
    });
}
