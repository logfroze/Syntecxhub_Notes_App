package com.example.syntecxhubnotes.data.repository

import com.example.syntecxhubnotes.data.database.NoteDao
import com.example.syntecxhubnotes.data.model.Note
import kotlinx.coroutines.flow.Flow

/**
 * Repository layer abstracting database operations for the ViewModel.
 */
class NoteRepository(private val noteDao: NoteDao) {

    fun getNotes(isArchived: Boolean, category: String?, query: String?): Flow<List<Note>> {
        val trimmedQuery = query?.trim()
        val hasQuery = !trimmedQuery.isNullOrBlank()
        val hasCategory = !category.isNullOrBlank() && category != "All"

        return when {
            hasQuery && hasCategory -> noteDao.searchNotesWithCategory(trimmedQuery!!, category!!, isArchived)
            hasQuery -> noteDao.searchNotes(trimmedQuery!!, isArchived)
            hasCategory -> {
                if (isArchived) noteDao.getArchivedNotesByCategory(category!!)
                else noteDao.getActiveNotesByCategory(category!!)
            }
            else -> {
                if (isArchived) noteDao.getArchivedNotes()
                else noteDao.getActiveNotes()
            }
        }
    }

    suspend fun getNoteById(id: Long): Note? {
        return noteDao.getNoteById(id)
    }

    fun getNoteByIdFlow(id: Long): Flow<Note?> {
        return noteDao.getNoteByIdFlow(id)
    }

    suspend fun insert(note: Note): Long {
        return noteDao.insert(note)
    }

    suspend fun update(note: Note): Int {
        return noteDao.update(note)
    }

    suspend fun delete(note: Note): Int {
        return noteDao.delete(note)
    }

    suspend fun deleteById(id: Long): Int {
        return noteDao.deleteById(id)
    }

    suspend fun togglePin(id: Long, currentPinState: Boolean): Int {
        return noteDao.updatePinStatus(id, !currentPinState)
    }

    suspend fun toggleArchive(id: Long, currentArchiveState: Boolean): Int {
        return noteDao.updateArchiveStatus(id, !currentArchiveState)
    }
}
