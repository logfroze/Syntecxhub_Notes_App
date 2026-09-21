import { ProjectFile } from '../types';

export const ANDROID_FILES: ProjectFile[] = [
  {
    path: 'android/build.gradle.kts',
    name: 'build.gradle.kts (Project)',
    language: 'kotlin',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.ksp) apply false
}`
  },
  {
    path: 'android/settings.gradle.kts',
    name: 'settings.gradle.kts',
    language: 'kotlin',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "SyntecxHubNotes"
include(":app")`
  },
  {
    path: 'android/gradle.properties',
    name: 'gradle.properties',
    language: 'properties',
    content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official`
  },
  {
    path: 'android/gradle/libs.versions.toml',
    name: 'libs.versions.toml',
    language: 'properties',
    content: `[versions]
agp = "8.4.1"
kotlin = "1.9.23"
coreKtx = "1.13.1"
appcompat = "1.6.1"
material = "1.12.0"
activity = "1.9.0"
constraintlayout = "2.1.4"
lifecycle = "2.7.0"
room = "2.6.1"
ksp = "1.9.23-1.0.20"
coroutines = "1.8.0"
junit = "4.13.2"
androidxJunit = "1.1.5"
espresso = "3.5.1"
coreTesting = "2.2.0"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-appcompat = { group = "androidx.appcompat", name = "appcompat", version.ref = "appcompat" }
material = { group = "com.google.android.material", name = "material", version.ref = "material" }
androidx-activity = { group = "androidx.activity", name = "activity-ktx", version.ref = "activity" }
androidx-constraintlayout = { group = "androidx.constraintlayout", name = "constraintlayout", version.ref = "constraintlayout" }

androidx-lifecycle-viewmodel-ktx = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-ktx", version.ref = "lifecycle" }
androidx-lifecycle-livedata-ktx = { group = "androidx.lifecycle", name = "lifecycle-livedata-ktx", version.ref = "lifecycle" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycle" }

androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
androidx-room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
androidx-room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }

kotlinx-coroutines-core = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-core", version.ref = "coroutines" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }
kotlinx-coroutines-test = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-test", version.ref = "coroutines" }

junit = { group = "junit", name = "junit", version.ref = "junit" }
androidx-junit = { group = "androidx.test.ext", name = "junit", version.ref = "androidxJunit" }
androidx-espresso-core = { group = "androidx.test.espresso", name = "espresso-core", version.ref = "espresso" }
androidx-core-testing = { group = "androidx.arch.core", name = "core-testing", version.ref = "coreTesting" }
androidx-room-testing = { group = "androidx.room", name = "room-testing", version.ref = "room" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }`
  },
  {
    path: 'android/app/build.gradle.kts',
    name: 'build.gradle.kts (App)',
    language: 'kotlin',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.example.syntecxhubnotes"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.syntecxhubnotes"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        ksp {
            arg("room.schemaLocation", "$projectDir/schemas")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.constraintlayout)

    // Room
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // Lifecycle / ViewModel
    implementation(libs.androidx.lifecycle.viewmodel.ktx)
    implementation(libs.androidx.lifecycle.livedata.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)

    // Coroutines
    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.kotlinx.coroutines.android)

    // Testing
    testImplementation(libs.junit)
    testImplementation(libs.kotlinx.coroutines.test)
    testImplementation(libs.androidx.core.testing)
    testImplementation(libs.androidx.room.testing)
}`
  },
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    language: 'xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:name=".NotesApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.SyntecxHubNotes">

        <activity
            android:name=".ui.MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <activity
            android:name=".ui.AddEditNoteActivity"
            android:exported="false"
            android:parentActivityName=".ui.MainActivity" />

        <activity
            android:name=".ui.NoteDetailActivity"
            android:exported="false"
            android:parentActivityName=".ui.MainActivity" />

    </application>

</manifest>`
  },
  {
    path: 'android/app/src/main/java/com/example/syntecxhubnotes/data/model/Note.kt',
    name: 'Note.kt (Entity)',
    language: 'kotlin',
    content: `package com.example.syntecxhubnotes.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.io.Serializable

@Entity(tableName = "notes")
data class Note(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val content: String,
    val category: String, // "Personal", "Work", "Study", "Ideas"
    val isPinned: Boolean = false,
    val isArchived: Boolean = false,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
) : Serializable`
  },
  {
    path: 'android/app/src/main/java/com/example/syntecxhubnotes/data/database/NoteDao.kt',
    name: 'NoteDao.kt (DAO)',
    language: 'kotlin',
    content: `package com.example.syntecxhubnotes.data.database

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.syntecxhubnotes.data.model.Note
import kotlinx.coroutines.flow.Flow

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

    @Query("SELECT * FROM notes WHERE isArchived = 0 ORDER BY isPinned DESC, updatedAt DESC")
    fun getActiveNotes(): Flow<List<Note>>

    @Query("SELECT * FROM notes WHERE isArchived = 1 ORDER BY isPinned DESC, updatedAt DESC")
    fun getArchivedNotes(): Flow<List<Note>>

    @Query("SELECT * FROM notes WHERE isArchived = 0 AND category = :category ORDER BY isPinned DESC, updatedAt DESC")
    fun getActiveNotesByCategory(category: String): Flow<List<Note>>

    @Query("SELECT * FROM notes WHERE isArchived = 1 AND category = :category ORDER BY isPinned DESC, updatedAt DESC")
    fun getArchivedNotesByCategory(category: String): Flow<List<Note>>

    @Query("""
        SELECT * FROM notes 
        WHERE isArchived = :isArchived 
          AND (title LIKE '%' || :query || '%' OR content LIKE '%' || :query || '%')
        ORDER BY isPinned DESC, updatedAt DESC
    """)
    fun searchNotes(query: String, isArchived: Boolean): Flow<List<Note>>

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
}`
  },
  {
    path: 'android/app/src/main/java/com/example/syntecxhubnotes/data/database/NoteDatabase.kt',
    name: 'NoteDatabase.kt (Room)',
    language: 'kotlin',
    content: `package com.example.syntecxhubnotes.data.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.syntecxhubnotes.data.model.Note

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

        val MIGRATION_1_2 = object : Migration(1, 2) {
            override fun migrate(db: SupportSQLiteDatabase) {
                // Non-destructive schema migration implementation
            }
        }

        fun getDatabase(context: Context): NoteDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    NoteDatabase::class.java,
                    DATABASE_NAME
                )
                    .addMigrations(MIGRATION_1_2)
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}`
  },
  {
    path: 'android/app/src/main/java/com/example/syntecxhubnotes/data/repository/NoteRepository.kt',
    name: 'NoteRepository.kt',
    language: 'kotlin',
    content: `package com.example.syntecxhubnotes.data.repository

import com.example.syntecxhubnotes.data.database.NoteDao
import com.example.syntecxhubnotes.data.model.Note
import kotlinx.coroutines.flow.Flow

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

    suspend fun getNoteById(id: Long) = noteDao.getNoteById(id)
    fun getNoteByIdFlow(id: Long) = noteDao.getNoteByIdFlow(id)
    suspend fun insert(note: Note) = noteDao.insert(note)
    suspend fun update(note: Note) = noteDao.update(note)
    suspend fun delete(note: Note) = noteDao.delete(note)
    suspend fun deleteById(id: Long) = noteDao.deleteById(id)
    suspend fun togglePin(id: Long, currentPinState: Boolean) = noteDao.updatePinStatus(id, !currentPinState)
    suspend fun toggleArchive(id: Long, currentArchiveState: Boolean) = noteDao.updateArchiveStatus(id, !currentArchiveState)
}`
  },
  {
    path: 'android/app/src/main/java/com/example/syntecxhubnotes/ui/viewmodel/NoteViewModel.kt',
    name: 'NoteViewModel.kt',
    language: 'kotlin',
    content: `package com.example.syntecxhubnotes.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.asLiveData
import androidx.lifecycle.viewModelScope
import com.example.syntecxhubnotes.data.model.Note
import com.example.syntecxhubnotes.data.repository.NoteRepository
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.launch

@OptIn(ExperimentalCoroutinesApi::class)
class NoteViewModel(private val repository: NoteRepository) : ViewModel() {

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedCategory = MutableStateFlow("All")
    val selectedCategory: StateFlow<String> = _selectedCategory.asStateFlow()

    private val _isArchivedMode = MutableStateFlow(false)
    val isArchivedMode: StateFlow<Boolean> = _isArchivedMode.asStateFlow()

    val notes = combine(_isArchivedMode, _selectedCategory, _searchQuery) { isArchived, category, query ->
        Triple(isArchived, category, query)
    }.flatMapLatest { (isArchived, category, query) ->
        repository.getNotes(isArchived, category, query)
    }.asLiveData()

    fun setSearchQuery(query: String) { _searchQuery.value = query }
    fun setSelectedCategory(category: String) { _selectedCategory.value = category }
    fun setArchivedMode(isArchived: Boolean) { _isArchivedMode.value = isArchived }

    fun insertNote(title: String, content: String, category: String, onComplete: ((Long) -> Unit)? = null) {
        viewModelScope.launch {
            val note = Note(title = title.trim(), content = content.trim(), category = category)
            val id = repository.insert(note)
            onComplete?.invoke(id)
        }
    }

    fun updateNote(note: Note, newTitle: String, newContent: String, newCategory: String, onComplete: (() -> Unit)? = null) {
        viewModelScope.launch {
            val updated = note.copy(title = newTitle.trim(), content = newContent.trim(), category = newCategory, updatedAt = System.currentTimeMillis())
            repository.update(updated)
            onComplete?.invoke()
        }
    }

    fun deleteNote(note: Note, onComplete: (() -> Unit)? = null) {
        viewModelScope.launch {
            repository.delete(note)
            onComplete?.invoke()
        }
    }

    fun togglePin(note: Note, onComplete: (() -> Unit)? = null) {
        viewModelScope.launch {
            repository.togglePin(note.id, note.isPinned)
            onComplete?.invoke()
        }
    }

    fun toggleArchive(note: Note, onComplete: (() -> Unit)? = null) {
        viewModelScope.launch {
            repository.toggleArchive(note.id, note.isArchived)
            onComplete?.invoke()
        }
    }

    fun getNoteByIdFlow(id: Long) = repository.getNoteByIdFlow(id)
}`
  },
  {
    path: 'android/app/src/main/java/com/example/syntecxhubnotes/ui/adapter/NoteAdapter.kt',
    name: 'NoteAdapter.kt (RecyclerView)',
    language: 'kotlin',
    content: `package com.example.syntecxhubnotes.ui.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.syntecxhubnotes.R
import com.example.syntecxhubnotes.data.model.Note
import com.example.syntecxhubnotes.databinding.ItemNoteBinding
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class NoteAdapter(
    private val onNoteClick: (Note) -> Unit
) : ListAdapter<Note, NoteAdapter.NoteViewHolder>(NoteDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NoteViewHolder {
        val binding = ItemNoteBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return NoteViewHolder(binding)
    }

    override fun onBindViewHolder(holder: NoteViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class NoteViewHolder(private val binding: ItemNoteBinding) : RecyclerView.ViewHolder(binding.root) {
        private val dateFormat = SimpleDateFormat("MMM d, yyyy • h:mm a", Locale.getDefault())

        fun bind(note: Note) {
            val context = binding.root.context
            binding.tvItemTitle.text = if (note.title.isNotBlank()) note.title else "(Untitled Note)"
            binding.tvItemContentPreview.text = if (note.content.isNotBlank()) note.content else "(No content)"
            binding.tvItemCategory.text = note.category

            val categoryColorRes = when (note.category.lowercase(Locale.ROOT)) {
                "personal" -> R.color.category_personal
                "work" -> R.color.category_work
                "study" -> R.color.category_study
                "ideas" -> R.color.category_ideas
                else -> R.color.category_default
            }
            binding.tvItemCategory.setTextColor(ContextCompat.getColor(context, categoryColorRes))
            binding.layoutPinnedBadge.visibility = if (note.isPinned) View.VISIBLE else View.GONE
            binding.tvItemArchivedBadge.visibility = if (note.isArchived) View.VISIBLE else View.GONE
            binding.tvItemDate.text = dateFormat.format(Date(note.updatedAt))

            binding.root.setOnClickListener { onNoteClick(note) }
        }
    }

    class NoteDiffCallback : DiffUtil.ItemCallback<Note>() {
        override fun areItemsTheSame(oldItem: Note, newItem: Note) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: Note, newItem: Note) = oldItem == newItem
    }
}`
  },
  {
    path: 'android/app/src/main/res/layout/activity_main.xml',
    name: 'activity_main.xml',
    language: 'xml',
    content: `<!-- Main layout with CoordinatorLayout, Search bar, Category chips, and RecyclerView -->`
  },
  {
    path: 'android/app/src/main/res/layout/item_note.xml',
    name: 'item_note.xml',
    language: 'xml',
    content: `<!-- Compact note item card with category badge, pinned indicator, title, and 2-line preview -->`
  },
  {
    path: 'android/app/src/main/res/layout/activity_add_edit_note.xml',
    name: 'activity_add_edit_note.xml',
    language: 'xml',
    content: `<!-- Add/Edit layout with category chips, title input, and content textarea -->`
  },
  {
    path: 'android/app/src/main/res/layout/activity_note_detail.xml',
    name: 'activity_note_detail.xml',
    language: 'xml',
    content: `<!-- Detail layout showing full title, body, status chips, and action toolbar -->`
  },
  {
    path: 'android/app/src/main/res/values/colors.xml',
    name: 'colors.xml',
    language: 'xml',
    content: `<!-- Clean, restrained student palette: Slate Indigo primary, soft neutral surfaces -->`
  },
  {
    path: 'android/app/src/test/java/com/example/syntecxhubnotes/data/database/NoteDaoTest.kt',
    name: 'NoteDaoTest.kt (Unit Tests)',
    language: 'kotlin',
    content: `// In-memory Room persistence tests for insert, retrieve, update, delete, search, pin, archive`
  },
  {
    path: 'android/README.md',
    name: 'README.md',
    language: 'markdown',
    content: `# SyntecxHub Android Development Internship — Week 2: Notes App Documentation`
  }
];
