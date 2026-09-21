package com.example.syntecxhubnotes.data.database

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.syntecxhubnotes.data.model.Note
import kotlinx.coroutines.flow.Flow

/**
 * Data Access Object (DAO) for the notes table.
 * Provides Room operations for insert, update, delete, search, filter, pin, and archive.
 */
@Dao
interface NoteDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(note: Note): Long

    @Update
    suspend fun update(note: Note): Int

    @Delete
    suspend fun delete(note: Note): Int

    @Query("DELETE FROM notes WHERE id = :id")
    suspend fun deleteById(id: Long): Int

    @Query("SELECT * FROM notes WHERE id = :id")
    suspend fun getNoteById(id: Long): Note?

    @Query("SELECT * FROM notes WHERE id = :id")
    fun getNoteByIdFlow(id: Long): Flow<Note?>

    /**
     * Get active (non-archived) notes ordered with pinned notes first, then latest updated.
     */
    @Query("SELECT * FROM notes WHERE isArchived = 0 ORDER BY isPinned DESC, updatedAt DESC")
    fun getActiveNotes(): Flow<List<Note>>

    /**
     * Get archived notes ordered with pinned notes first, then latest updated.
     */
    @Query("SELECT * FROM notes WHERE isArchived = 1 ORDER BY isPinned DESC, updatedAt DESC")
    fun getArchivedNotes(): Flow<List<Note>>

    /**
     * Filter active notes by category.
     */
    @Query("SELECT * FROM notes WHERE isArchived = 0 AND category = :category ORDER BY isPinned DESC, updatedAt DESC")
    fun getActiveNotesByCategory(category: String): Flow<List<Note>>

    /**
     * Filter archived notes by category.
     */
    @Query("SELECT * FROM notes WHERE isArchived = 1 AND category = :category ORDER BY isPinned DESC, updatedAt DESC")
    fun getArchivedNotesByCategory(category: String): Flow<List<Note>>

    /**
     * Search notes by title or content (case-insensitive substring match in SQLite).
     */
    @Query("""
        SELECT * FROM notes 
        WHERE isArchived = :isArchived 
          AND (title LIKE '%' || :query || '%' OR content LIKE '%' || :query || '%')
        ORDER BY isPinned DESC, updatedAt DESC
    """)
    fun searchNotes(query: String, isArchived: Boolean): Flow<List<Note>>

    /**
     * Search notes within a specific category.
     */
    @Query("""
        SELECT * FROM notes 
        WHERE isArchived = :isArchived 
          AND category = :category
          AND (title LIKE '%' || :query || '%' OR content LIKE '%' || :query || '%')
        ORDER BY isPinned DESC, updatedAt DESC
    """)
    fun searchNotesWithCategory(query: String, category: String, isArchived: Boolean): Flow<List<Note>>

    @Query("UPDATE notes SET isPinned = :isPinned, updatedAt = :updatedAt WHERE id = :id")
    suspend fun updatePinStatus(id: Long, isPinned: Boolean, updatedAt: Long = System.currentTimeMillis()): Int

    @Query("UPDATE notes SET isArchived = :isArchived, updatedAt = :updatedAt WHERE id = :id")
    suspend fun updateArchiveStatus(id: Long, isArchived: Boolean, updatedAt: Long = System.currentTimeMillis()): Int
}
