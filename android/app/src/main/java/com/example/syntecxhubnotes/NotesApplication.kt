package com.example.syntecxhubnotes

import android.app.Application
import com.example.syntecxhubnotes.data.database.NoteDatabase
import com.example.syntecxhubnotes.data.repository.NoteRepository

/**
 * Application class providing application-scoped Room Database and Repository instances.
 */
class NotesApplication : Application() {

    val database by lazy { NoteDatabase.getDatabase(this) }
    val repository by lazy { NoteRepository(database.noteDao()) }

    override fun onCreate() {
        super.onCreate()
    }
}
