package com.example.syntecxhubnotes.data.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.syntecxhubnotes.data.model.Note

/**
 * Room Database for SyntecxHub Notes application.
 * Version 1 represents the initial schema.
 * Configured with proper migration support for future schema alterations.
 */
@Database(
    entities = [Note::class],
    version = 1,
    exportSchema = true
)
abstract class NoteDatabase : RoomDatabase() {

    abstract fun noteDao(): NoteDao

    companion object {
        private const val DATABASE_NAME = "syntecxhub_notes_database.db"

        @Volatile
        private var INSTANCE: NoteDatabase? = null

        /**
         * Example template for future schema migration from version 1 to 2.
         * Demonstrates non-destructive table alteration in compliance with internship standards.
         */
        val MIGRATION_1_2 = object : Migration(1, 2) {
            override fun migrate(db: SupportSQLiteDatabase) {
                // Example future schema alteration:
                // db.execSQL("ALTER TABLE notes ADD COLUMN colorTag TEXT NOT NULL DEFAULT '#FFFFFF'")
            }
        }

        fun getDatabase(context: Context): NoteDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    NoteDatabase::class.java,
                    DATABASE_NAME
                )
                    // Add migrations here to prevent destructive data loss
                    .addMigrations(MIGRATION_1_2)
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
