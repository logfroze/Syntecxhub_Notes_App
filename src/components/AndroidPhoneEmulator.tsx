import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  X, 
  Pin, 
  Archive, 
  ArchiveRestore, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  AlertCircle,
  FolderArchive
} from 'lucide-react';
import { CategoryFilter, CurrentScreen, NoteItem } from '../types';
import { getStoredNotes, saveStoredNotes, INITIAL_NOTES } from '../utils/notesStorage';

interface Props {
  onNoteSelected?: (note: NoteItem) => void;
  externalScreen?: CurrentScreen;
  setExternalScreen?: (s: CurrentScreen) => void;
}

export const AndroidPhoneEmulator: React.FC<Props> = ({ externalScreen, setExternalScreen }) => {
  const [internalScreen, setInternalScreen] = useState<CurrentScreen>({ type: 'LIST' });
  const currentScreen = externalScreen ?? internalScreen;
  const setScreen = setExternalScreen ?? setInternalScreen;

  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [isArchivedMode, setIsArchivedMode] = useState(false);

  // Form State for Add / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<NoteItem['category']>('Study');
  const [formError, setFormError] = useState<string | null>(null);

  // Toast / Snack notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete Confirmation Dialog State
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<NoteItem | null>(null);

  // Load from local storage Room simulator on mount
  useEffect(() => {
    setNotes(getStoredNotes());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Filtered notes based on Room query
  const displayedNotes = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    return notes
      .filter(n => {
        if (n.isArchived !== isArchivedMode) return false;
        if (selectedCategory !== 'All' && n.category !== selectedCategory) return false;
        if (trimmed) {
          const titleMatch = n.title.toLowerCase().includes(trimmed);
          const contentMatch = n.content.toLowerCase().includes(trimmed);
          if (!titleMatch && !contentMatch) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return b.updatedAt - a.updatedAt;
      });
  }, [notes, isArchivedMode, selectedCategory, searchQuery]);

  // Currently viewed note for Detail
  const activeDetailNote = useMemo(() => {
    if (currentScreen.type === 'DETAIL') {
      return notes.find(n => n.id === currentScreen.noteId) || null;
    }
    return null;
  }, [currentScreen, notes]);

  // Handlers
  const handleOpenAdd = () => {
    setFormTitle('');
    setFormContent('');
    setFormCategory('Study');
    setFormError(null);
    setScreen({ type: 'ADD' });
  };

  const handleOpenEdit = (note: NoteItem) => {
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormCategory(note.category);
    setFormError(null);
    setScreen({ type: 'EDIT', noteId: note.id });
  };

  const handleSaveNote = () => {
    const trimmedTitle = formTitle.trim();
    const trimmedContent = formContent.trim();

    // Prevent empty note
    if (!trimmedTitle && !trimmedContent) {
      setFormError('Cannot save empty note. Please add title or content.');
      return;
    }

    if (currentScreen.type === 'ADD') {
      const newNote: NoteItem = {
        id: Date.now(),
        title: trimmedTitle,
        content: trimmedContent,
        category: formCategory,
        isPinned: false,
        isArchived: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const updated = [newNote, ...notes];
      setNotes(updated);
      saveStoredNotes(updated);
      showToast('Note saved successfully');
      setScreen({ type: 'LIST' });
    } else if (currentScreen.type === 'EDIT') {
      const updated = notes.map(n => {
        if (n.id === currentScreen.noteId) {
          return {
            ...n,
            title: trimmedTitle,
            content: trimmedContent,
            category: formCategory,
            updatedAt: Date.now(),
          };
        }
        return n;
      });
      setNotes(updated);
      saveStoredNotes(updated);
      showToast('Note updated');
      setScreen({ type: 'DETAIL', noteId: currentScreen.noteId });
    }
  };

  const handleTogglePin = (note: NoteItem) => {
    const nextPinState = !note.isPinned;
    const updated = notes.map(n => {
      if (n.id === note.id) {
        return {
          ...n,
          isPinned: nextPinState,
          updatedAt: Date.now(),
        };
      }
      return n;
    });
    setNotes(updated);
    saveStoredNotes(updated);
    showToast(nextPinState ? 'Note pinned to top' : 'Note unpinned');
  };

  const handleToggleArchive = (note: NoteItem) => {
    const nextArchiveState = !note.isArchived;
    const updated = notes.map(n => {
      if (n.id === note.id) {
        return {
          ...n,
          isArchived: nextArchiveState,
          updatedAt: Date.now(),
        };
      }
      return n;
    });
    setNotes(updated);
    saveStoredNotes(updated);
    showToast(nextArchiveState ? 'Note moved to archive' : 'Note restored to active list');
    setScreen({ type: 'LIST' });
  };

  const handleConfirmDelete = () => {
    if (!noteToDelete) return;
    const updated = notes.filter(n => n.id !== noteToDelete.id);
    setNotes(updated);
    saveStoredNotes(updated);
    setShowDeleteDialog(false);
    setNoteToDelete(null);
    showToast('Note deleted');
    setScreen({ type: 'LIST' });
  };

  const getCategoryBadgeStyle = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'personal':
        return 'text-[#0369A1] bg-[#E0F2FE] border-[#7DD3FC]';
      case 'work':
        return 'text-[#15803D] bg-[#DCFCE7] border-[#86EFAC]';
      case 'study':
        return 'text-[#6D28D9] bg-[#EDE9FE] border-[#C4B5FD]';
      case 'ideas':
        return 'text-[#B45309] bg-[#FEF3C7] border-[#FCD34D]';
      default:
        return 'text-[#334155] bg-[#F1F5F9] border-[#CBD5E1]';
    }
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + 
           d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    /* Restored Smooth Rounded Mobile Device Frame */
    <div className="relative mx-auto w-full max-w-[400px] h-[min(840px,94vh)] bg-white rounded-[38px] shadow-2xl border-[8px] border-[#1E293B] overflow-hidden flex flex-col select-none font-sans">
      {/* Android Top Bezel / Status Bar */}
      <div className="h-7.5 bg-[#0F172A] text-white flex items-center justify-between px-5 text-[11px] font-bold tracking-wider z-30 border-b border-[#1E293B]">
        <span>09:41</span>
        {/* Rounded Camera Notch Pill */}
        <div className="w-16 h-4 bg-black/60 rounded-full mx-auto flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-[#1E293B] rounded-full" />
        </div>
        <div className="flex items-center gap-1.5 opacity-90">
          <span className="text-[10px] font-mono">LTE</span>
          <div className="w-4 h-2.5 border border-white rounded-[2px] p-[1px] flex items-center">
            <div className="h-full w-2.5 bg-white rounded-[1px]" />
          </div>
        </div>
      </div>

      {/* Main Screen Container */}
      <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden relative">

        {/* 1. LIST SCREEN */}
        {currentScreen.type === 'LIST' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Solid Toolbar */}
            <div className="bg-white border-b-2 border-[#0F172A] px-4 pt-3 pb-3 z-10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h1 className="text-[17px] font-bold text-[#0F172A] uppercase tracking-wider leading-none">
                    {isArchivedMode ? 'ARCHIVED NOTES' : 'SYNTECXHUB NOTES'}
                  </h1>
                  <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mt-1">
                    {isArchivedMode ? 'ROOM DATABASE ARCHIVE' : 'ROOM DB • MVVM • RECYCLERVIEW'}
                  </p>
                </div>

                <button
                  id="btn-toggle-archive-mode"
                  onClick={() => setIsArchivedMode(!isArchivedMode)}
                  className={`px-3 py-1.5 text-xs rounded-[5px] font-bold uppercase tracking-wider transition-colors border flex items-center gap-1.5 ${
                    isArchivedMode 
                      ? 'bg-[#0F172A] text-white border-[#0F172A]' 
                      : 'bg-[#F1F5F9] text-[#1E293B] border-[#CBD5E1] hover:bg-[#E2E8F0]'
                  }`}
                  title={isArchivedMode ? 'View Active Notes' : 'View Archived Notes'}
                >
                  <FolderArchive className="w-3.5 h-3.5" />
                  <span>{isArchivedMode ? 'ACTIVE' : 'ARCHIVE'}</span>
                </button>
              </div>

              {/* Search Bar with subtle micro-rounding */}
              <div className="relative flex items-center mb-2.5">
                <Search className="absolute left-3 w-4 h-4 text-[#475569]" />
                <input
                  id="input-notes-search"
                  type="text"
                  placeholder="SEARCH TITLE OR CONTENT..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-8 bg-[#FFFFFF] border-2 border-[#CBD5E1] rounded-[6px] text-xs font-semibold text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0F172A] transition-colors uppercase"
                />
                {searchQuery && (
                  <button
                    id="btn-clear-search"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 p-1 text-[#475569] hover:text-[#0F172A] rounded-[3px]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Chips with subtle micro-rounded buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {(['All', 'Personal', 'Work', 'Study', 'Ideas'] as CategoryFilter[]).map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      id={`chip-cat-${cat.toLowerCase()}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-[5px] border transition-all ${
                        isActive
                          ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-2xs'
                          : 'bg-[#FFFFFF] text-[#475569] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Archived Mode Banner */}
            {isArchivedMode && (
              <div className="bg-[#FEF2F2] border-b-2 border-[#DC2626] px-4 py-2 flex items-center justify-between text-xs text-[#991B1B]">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                  <Archive className="w-4 h-4" />
                  <span>VIEWING ARCHIVED NOTES</span>
                </div>
                <button
                  onClick={() => setIsArchivedMode(false)}
                  className="text-xs font-bold text-[#0F172A] uppercase tracking-wider underline hover:text-[#DC2626]"
                >
                  EXIT ARCHIVE
                </button>
              </div>
            )}

            {/* Notes List (Tastefully micro-rounded solid cards) */}
            <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3">
              {displayedNotes.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-white border-2 border-dashed border-[#CBD5E1] rounded-[8px]">
                  <div className="w-12 h-12 bg-[#F1F5F9] border-2 border-[#94A3B8] rounded-[6px] flex items-center justify-center text-[#475569] mb-3">
                    <Edit3 className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                    {searchQuery ? 'NO MATCHING NOTES' : isArchivedMode ? 'ARCHIVE IS EMPTY' : 'NO NOTES IN DATABASE'}
                  </p>
                  <p className="text-[11px] text-[#64748B] mt-1 max-w-[220px]">
                    {searchQuery 
                      ? 'No items matched your query. Clear search to show all.' 
                      : isArchivedMode 
                      ? 'Archived notes will be stored here.' 
                      : 'Press the + button below to create your first note.'}
                  </p>
                </div>
              ) : (
                displayedNotes.map((note) => {
                  const badgeClasses = getCategoryBadgeStyle(note.category);
                  return (
                    <div
                      key={note.id}
                      id={`note-card-${note.id}`}
                      onClick={() => setScreen({ type: 'DETAIL', noteId: note.id })}
                      className="bg-white border-2 border-[#CBD5E1] hover:border-[#0F172A] rounded-[6px] p-3.5 shadow-2xs transition-colors cursor-pointer group"
                    >
                      {/* Top Badges Row */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-[3px] ${badgeClasses}`}>
                            {note.category}
                          </span>

                          {note.isPinned && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B] rounded-[3px]">
                              <Pin className="w-3 h-3 fill-current" />
                              PINNED
                            </span>
                          )}

                          {note.isArchived && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#F1F5F9] text-[#334155] border border-[#94A3B8] rounded-[3px]">
                              ARCHIVED
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-[#64748B]">
                          {formatDate(note.updatedAt)}
                        </span>
                      </div>

                      {/* Note Title */}
                      <h3 className="text-sm font-bold text-[#0F172A] leading-snug line-clamp-1 group-hover:text-[#0284C7] transition-colors">
                        {note.title || '(UNTITLED NOTE)'}
                      </h3>

                      {/* Note Content Preview (max 2 lines) */}
                      <p className="text-xs text-[#475569] line-clamp-2 mt-1.5 leading-relaxed font-normal">
                        {note.content || '(No content recorded)'}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Micro-rounded Solid FAB Add Note Button */}
            {!isArchivedMode && (
              <button
                id="fab-add-note"
                onClick={handleOpenAdd}
                className="absolute bottom-6 right-5 w-13 h-13 bg-[#0F172A] hover:bg-[#1E293B] active:scale-95 text-white rounded-[10px] border-2 border-black shadow-lg flex items-center justify-center transition-all z-20"
                title="Add Note"
              >
                <Plus className="w-6.5 h-6.5 stroke-[2.5]" />
              </button>
            )}
          </div>
        )}

        {/* 2. DETAIL SCREEN */}
        {currentScreen.type === 'DETAIL' && activeDetailNote && (
          <div className="flex-1 flex flex-col h-full bg-white">
            {/* Solid Toolbar */}
            <div className="h-12 bg-white border-b-2 border-[#0F172A] px-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  id="btn-detail-back"
                  onClick={() => setScreen({ type: 'LIST' })}
                  className="p-1.5 text-[#0F172A] hover:bg-[#F1F5F9] border border-transparent hover:border-[#CBD5E1] rounded-[4px] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">NOTE DETAILS</span>
              </div>

              {/* Action Icons with micro-rounded borders */}
              <div className="flex items-center gap-1.5">
                {/* Pin / Unpin */}
                <button
                  id="btn-detail-pin"
                  onClick={() => handleTogglePin(activeDetailNote)}
                  className={`p-1.5 rounded-[4px] border transition-colors ${
                    activeDetailNote.isPinned 
                      ? 'text-[#92400E] bg-[#FEF3C7] border-[#F59E0B]' 
                      : 'text-[#475569] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                  }`}
                  title={activeDetailNote.isPinned ? 'Unpin Note' : 'Pin Note'}
                >
                  <Pin className={`w-4 h-4 ${activeDetailNote.isPinned ? 'fill-current' : ''}`} />
                </button>

                {/* Archive / Unarchive */}
                <button
                  id="btn-detail-archive"
                  onClick={() => handleToggleArchive(activeDetailNote)}
                  className={`p-1.5 rounded-[4px] border transition-colors ${
                    activeDetailNote.isArchived 
                      ? 'text-[#0F172A] bg-[#E2E8F0] border-[#0F172A]' 
                      : 'text-[#475569] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                  }`}
                  title={activeDetailNote.isArchived ? 'Restore from Archive' : 'Archive Note'}
                >
                  {activeDetailNote.isArchived ? (
                    <ArchiveRestore className="w-4 h-4" />
                  ) : (
                    <Archive className="w-4 h-4" />
                  )}
                </button>

                {/* Edit */}
                <button
                  id="btn-detail-edit"
                  onClick={() => handleOpenEdit(activeDetailNote)}
                  className="p-1.5 text-[#475569] border border-[#CBD5E1] hover:bg-[#F1F5F9] rounded-[4px] transition-colors"
                  title="Edit Note"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  id="btn-detail-delete"
                  onClick={() => {
                    setNoteToDelete(activeDetailNote);
                    setShowDeleteDialog(true);
                  }}
                  className="p-1.5 text-[#DC2626] border border-[#DC2626] hover:bg-[#FEF2F2] rounded-[4px] transition-colors"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Note Content Area */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* Badges & Meta */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border rounded-[3px] ${getCategoryBadgeStyle(activeDetailNote.category)}`}>
                    {activeDetailNote.category}
                  </span>

                  {activeDetailNote.isPinned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B] rounded-[3px]">
                      <Pin className="w-3 h-3 fill-current" />
                      PINNED
                    </span>
                  )}

                  {activeDetailNote.isArchived && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-[#F1F5F9] text-[#334155] border border-[#94A3B8] rounded-[3px]">
                      ARCHIVED
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-mono text-[#64748B]">
                  {formatDate(activeDetailNote.updatedAt)}
                </span>
              </div>

              <div className="h-0.5 bg-[#0F172A] my-3" />

              {/* Title */}
              <h2 className="text-lg font-bold text-[#0F172A] leading-snug mb-3">
                {activeDetailNote.title || '(UNTITLED NOTE)'}
              </h2>

              {/* Body */}
              <p className="text-xs sm:text-sm text-[#1E293B] whitespace-pre-wrap leading-relaxed font-normal">
                {activeDetailNote.content || '(No content recorded)'}
              </p>
            </div>
          </div>
        )}

        {/* 3. ADD / EDIT SCREEN */}
        {(currentScreen.type === 'ADD' || currentScreen.type === 'EDIT') && (
          <div className="flex-1 flex flex-col h-full bg-white">
            {/* Toolbar */}
            <div className="h-12 bg-white border-b-2 border-[#0F172A] px-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  id="btn-edit-back"
                  onClick={() => {
                    if (currentScreen.type === 'EDIT') {
                      setScreen({ type: 'DETAIL', noteId: currentScreen.noteId });
                    } else {
                      setScreen({ type: 'LIST' });
                    }
                  }}
                  className="p-1.5 text-[#0F172A] hover:bg-[#F1F5F9] border border-transparent hover:border-[#CBD5E1] rounded-[4px] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                  {currentScreen.type === 'ADD' ? 'ADD NOTE' : 'EDIT NOTE'}
                </span>
              </div>

              <button
                id="btn-save-note"
                onClick={handleSaveNote}
                className="px-4 py-1.5 bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider rounded-[4px] hover:bg-[#1E293B] transition-colors border border-black"
              >
                SAVE
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                  CATEGORY
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {(['Personal', 'Work', 'Study', 'Ideas'] as NoteItem['category'][]).map(cat => {
                    const isSelected = formCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        id={`btn-select-category-${cat.toLowerCase()}`}
                        onClick={() => setFormCategory(cat)}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-[4px] border transition-all ${
                          isSelected
                            ? 'bg-[#0F172A] text-white border-[#0F172A]'
                            : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                  TITLE
                </label>
                <input
                  id="input-note-title"
                  type="text"
                  placeholder="NOTE TITLE..."
                  value={formTitle}
                  onChange={e => {
                    setFormTitle(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  className="w-full px-3 py-2 text-sm font-bold text-[#0F172A] bg-[#FFFFFF] border-2 border-[#CBD5E1] rounded-[5px] focus:outline-none focus:border-[#0F172A] transition-colors uppercase placeholder-[#94A3B8]"
                />
              </div>

              {/* Content Field */}
              <div className="flex-1 flex flex-col">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                  CONTENT
                </label>
                <textarea
                  id="input-note-content"
                  rows={9}
                  placeholder="Write your note content here..."
                  value={formContent}
                  onChange={e => {
                    setFormContent(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  className="w-full px-3 py-2 text-xs font-normal text-[#0F172A] bg-[#FFFFFF] border-2 border-[#CBD5E1] rounded-[5px] focus:outline-none focus:border-[#0F172A] resize-none leading-relaxed transition-colors flex-1 placeholder-[#94A3B8]"
                />
              </div>

              {/* Validation Warning Message */}
              {formError && (
                <div className="p-3 bg-[#FEF2F2] border-2 border-[#DC2626] rounded-[5px] flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DC2626]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t-2 border-[#0F172A] flex justify-end gap-2 bg-[#F8FAFC]">
              <button
                id="btn-cancel-edit"
                onClick={() => {
                  if (currentScreen.type === 'EDIT') {
                    setScreen({ type: 'DETAIL', noteId: currentScreen.noteId });
                  } else {
                    setScreen({ type: 'LIST' });
                  }
                }}
                className="px-4 py-2 text-xs text-[#0F172A] border border-[#CBD5E1] hover:bg-[#E2E8F0] rounded-[4px] font-bold uppercase tracking-wider transition-colors"
              >
                CANCEL
              </button>
              <button
                id="btn-save-bottom"
                onClick={handleSaveNote}
                className="px-5 py-2 text-xs bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold uppercase tracking-wider rounded-[4px] border border-black transition-colors"
              >
                SAVE NOTE
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog with Subtle micro-rounded box */}
        {showDeleteDialog && noteToDelete && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[8px] border-3 border-[#0F172A] w-full max-w-[300px] p-5 shadow-2xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] mb-2">
                DELETE NOTE
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed mb-5 font-normal">
                Are you sure you want to permanently delete "{noteToDelete.title || 'this note'}" from Room database? This operation cannot be reversed.
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  id="btn-dialog-cancel-delete"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setNoteToDelete(null);
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0F172A] border border-[#CBD5E1] hover:bg-[#F1F5F9] rounded-[4px] transition-colors"
                >
                  CANCEL
                </button>
                <button
                  id="btn-dialog-confirm-delete"
                  onClick={handleConfirmDelete}
                  className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#DC2626] hover:bg-[#B91C1C] border border-[#991B1B] rounded-[4px] transition-colors shadow-none"
                >
                  DELETE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Android Toast Snackbar Overlay with Subtle micro-rounded box */}
        {toastMessage && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-[5px] border-2 border-white shadow-xl z-40 transition-all text-center whitespace-nowrap">
            {toastMessage}
          </div>
        )}

      </div>

      {/* Android Bottom Navigation Pill */}
      <div className="h-5 bg-white flex items-center justify-center border-t border-[#E2E8F0]">
        <div className="w-24 h-1 bg-[#94A3B8] rounded-full" />
      </div>
    </div>
  );
};
