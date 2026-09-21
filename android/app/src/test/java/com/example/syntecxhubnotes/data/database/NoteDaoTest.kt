package com.example.syntecxhubnotes.data.database

import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.example.syntecxhubnotes.data.model.Note
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import java.io.IOException

/**
 * Unit tests for Room Database DAO operations using an in-memory database.
 * Verifies insertion, retrieval, update, deletion, search, category filter, pinning, and archiving.
 */
@RunWith(AndroidJUnit4::class)
class NoteDaoTest {

    private lateinit var db: NoteDatabase
    private lateinit var noteDao: NoteDao

    @Before
    fun createDb() {
        val context = ApplicationProvider.getApplicationContext<android.content.Context>()
        db = Room.inMemoryDatabaseBuilder(context, NoteDatabase::class.java)
            .allowMainThreadQueries()
            .build()
        noteDao = db.noteDao()
    }

    @After
    @Throws(IOException::class)
    fun closeDb() {
        db.close()
    }

    @Test
    fun insertAndRetrieveNote() = runBlocking {
        val note = Note(
            title = "Android Development",
            content = "Learning Room Database and ViewModel.",
            category = "Study"
        )
        val id = noteDao.insert(note)
        assertTrue(id > 0)

        val retrieved = noteDao.getNoteById(id)
        assertNotNull(retrieved)
        assertEquals("Android Development", retrieved?.title)
        assertEquals("Learning Room Database and ViewModel.", retrieved?.content)
        assertEquals("Study", retrieved?.category)
    }

    @Test
    fun updateNote() = runBlocking {
        val note = Note(
            title = "Initial Title",
            content = "Initial Content",
            category = "Personal"
        )
        val id = noteDao.insert(note)
        val inserted = noteDao.getNoteById(id)!!

        val updated = inserted.copy(
            title = "Updated Title",
            content = "Updated Content"
        )
        noteDao.update(updated)

        val retrieved = noteDao.getNoteById(id)
        assertEquals("Updated Title", retrieved?.title)
        assertEquals("Updated Content", retrieved?.content)
    }

    @Test
    fun deleteNote() = runBlocking {
        val note = Note(
            title = "To be deleted",
            content = "Delete test content",
            category = "Work"
        )
        val id = noteDao.insert(note)
        val inserted = noteDao.getNoteById(id)!!

        noteDao.delete(inserted)
        val retrieved = noteDao.getNoteById(id)
        assertNull(retrieved)
    }

    @Test
    fun searchNotesByTitleAndContent() = runBlocking {
        noteDao.insert(Note(title = "Android Coroutines", content = "Flow basics", category = "Study"))
        noteDao.insert(Note(title = "Shopping List", content = "Apples, Milk, Bread", category = "Personal"))

        val searchResult = noteDao.searchNotes("Android", isArchived = false).first()
        assertEquals(1, searchResult.size)
        assertEquals("Android Coroutines", searchResult[0].title)

        val contentSearchResult = noteDao.searchNotes("Milk", isArchived = false).first()
        assertEquals(1, contentSearchResult.size)
        assertEquals("Shopping List", contentSearchResult[0].title)
    }

    @Test
    fun filterByCategory() = runBlocking {
        noteDao.insert(Note(title = "Task A", content = "...", category = "Work"))
        noteDao.insert(Note(title = "Task B", content = "...", category = "Study"))
        noteDao.insert(Note(title = "Task C", content = "...", category = "Work"))

        val workNotes = noteDao.getActiveNotesByCategory("Work").first()
        assertEquals(2, workNotes.size)

        val studyNotes = noteDao.getActiveNotesByCategory("Study").first()
        assertEquals(1, studyNotes.size)
    }

    @Test
    fun pinNotePrioritizesInOrder() = runBlocking {
        val id1 = noteDao.insert(Note(title = "First Note", content = "Old note", category = "General", isPinned = false))
        val id2 = noteDao.insert(Note(title = "Second Note", content = "New note", category = "General", isPinned = false))

        // Pin the first note
        noteDao.updatePinStatus(id1, isPinned = true)

        val activeNotes = noteDao.getActiveNotes().first()
        assertEquals(2, activeNotes.size)
        assertEquals(id1, activeNotes[0].id)
        assertTrue(activeNotes[0].isPinned)
    }

    @Test
    fun archiveNoteHidesFromActiveList() = runBlocking {
        val id = noteDao.insert(Note(title = "Archived Note", content = "Hidden", category = "Ideas", isArchived = false))

        // Archive the note
        noteDao.updateArchiveStatus(id, isArchived = true)

        val activeNotes = noteDao.getActiveNotes().first()
        assertEquals(0, activeNotes.size)

        val archivedNotes = noteDao.getArchivedNotes().first()
        assertEquals(1, archivedNotes.size)
        assertEquals(id, archivedNotes[0].id)
    }
}
