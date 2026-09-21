# SyntecxHub Android Development Internship — Week 2
## Project 2: Notes App (Room Database & MVVM Architecture)

A clean, practical, and fully functional Android application developed using **Kotlin**, **XML Layouts**, **Room Database (SQLite)**, **ViewModel**, **Kotlin Coroutines / Flow**, and **RecyclerView**.

---

## 1. Overview & Goal

This project satisfies all requirements for **SyntecxHub Android Development Internship — Week 2 (Project 2: Notes App)**. It implements complete CRUD persistence with offline local storage, search, categorization, pin prioritization, archiving, and reactive UI updates.

### Key Highlights
* **Native Android (No Compose)**: 100% Kotlin with XML layouts, ViewBinding, and Material Components.
* **Human-Made Design**: Realistic, clean, and restrained student-developer UI. No neon colors, no decorative glassmorphism, no artificial gradients or bloated cards.
* **Modern MVVM Architecture**: Strict separation of concerns between UI (Activities), State (ViewModel), Business Logic (Repository), and Data Layer (Room DAO & Database).
* **Asynchronous Database Operations**: Non-blocking database calls running inside lifecycle-aware `viewModelScope` with Kotlin Coroutines and reactive `Flow`.
* **Safe Database Migrations**: Configured for schema evolution without destructive data loss.

---

## 2. Technologies & Libraries

* **Language**: Kotlin 1.9.23
* **Min SDK**: 24 (Android 7.0 Nougat)
* **Target & Compile SDK**: 34 (Android 14)
* **Local Persistence**: Android Jetpack Room 2.6.1 (`androidx.room:room-runtime`, `room-ktx`, `room-compiler`)
* **Architecture Components**:
  * `ViewModel` & `LiveData` / `StateFlow`
  * ViewBinding enabled
* **Concurrency**: Kotlinx Coroutines (1.8.0)
* **UI Controls**:
  * `RecyclerView` with `ListAdapter` and `DiffUtil.ItemCallback`
  * Material Components (`MaterialToolbar`, `MaterialCardView`, `ChipGroup`, `TextInputLayout`, `FloatingActionButton`)
* **Testing**:
  * JUnit 4
  * AndroidX Test Core & AndroidJUnit4 Runner
  * Room In-Memory Testing (`androidx.room:room-testing`)
  * `kotlinx-coroutines-test`

---

## 3. Application Architecture

The project follows standard Android Architecture Components guidelines:

```
app/src/main/java/com/example/syntecxhubnotes/
│
├── NotesApplication.kt             # Application class providing DB & Repo singletons
│
├── data/
│   ├── model/
│   │   └── Note.kt                 # Room @Entity (id, title, content, category, isPinned, isArchived, timestamps)
│   ├── database/
│   │   ├── NoteDao.kt              # Room DAO with Flow queries & suspend methods
│   │   └── NoteDatabase.kt         # RoomDatabase with Migration definitions
│   └── repository/
│       └── NoteRepository.kt       # Repository routing queries & mutations
│
└── ui/
    ├── adapter/
    │   └── NoteAdapter.kt          # ListAdapter with DiffUtil and custom ViewHolder
    ├── viewmodel/
    │   ├── NoteViewModel.kt        # ViewModel exposing StateFlow/LiveData to UI
    │   └── NoteViewModelFactory.kt # ViewModelProvider Factory
    ├── MainActivity.kt             # Main note list, search, chips filter, and FAB
    ├── AddEditNoteActivity.kt      # Create and update screen with input validation
    └── NoteDetailActivity.kt       # Full note view with pin, archive, edit, and delete
```

---

## 4. Room Database Schema & Migrations

### Room Entity (`notes` table)
```kotlin
@Entity(tableName = "notes")
data class Note(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val content: String,
    val category: String,
    val isPinned: Boolean = false,
    val isArchived: Boolean = false,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
```

### Migration Strategy
In compliance with the internship requirement to avoid destructive migration in production:
* The database is initialized at `version = 1`.
* `NoteDatabase.kt` defines migration strategies (such as `MIGRATION_1_2`) that utilize standard SQL `ALTER TABLE` statements rather than calling `.fallbackToDestructiveMigration()`.
* Schema files are exported into `app/schemas` via `ksp { arg("room.schemaLocation", "$projectDir/schemas") }` to track schema history in source control.

---

## 5. Feature Breakdown

1. **Create Note**:
   * Opens `AddEditNoteActivity`.
   * Allows title input, content input, and category selection (`Personal`, `Work`, `Study`, `Ideas`).
   * **Input Validation**: Automatically rejects blank submissions where both title and content are empty, with user feedback. Whitespace is safely trimmed.
2. **Read / View Note**:
   * Tapping any note opens `NoteDetailActivity`.
   * Displays the complete note title, full body text, category badge, pinned badge, and formatted timestamp.
   * Simple back button returns to the list.
3. **Update Note**:
   * Tapping Edit loads existing values into `AddEditNoteActivity`.
   * Updates `updatedAt` timestamp and persists changes to SQLite.
   * Automatically updates the RecyclerView through reactive `Flow`.
4. **Delete Note**:
   * Includes an `AlertDialog` confirmation dialog (`dialog_confirm_delete.xml`) to prevent accidental deletion.
   * On confirmation, removes the note from the database and finishes the detail screen.
5. **Search Notes**:
   * Integrated search bar in `MainActivity`.
   * Real-time query execution matching against both `title` and `content`.
   * Case-insensitive substring matching.
   * Clear button restores the active list instantly.
6. **Categorization**:
   * Predefined categories: `Personal`, `Work`, `Study`, `Ideas`.
   * Filterable chips row at the top of the main screen with an `All` filter.
   * Distinct, restrained accent colors for each category badge.
7. **Pin Notes**:
   * Pinning prioritizes the note to appear at the very top of the list.
   * Visually marked with a subtle amber badge and pin icon.
   * Pin state persists across device restarts in Room.
8. **Archive Notes**:
   * Archiving removes the note from the active notes list without deleting it.
   * Main menu option lets users toggle between **Active Notes** and **Archived Notes**.
   * Notes can be unarchived at any time from the detail screen.
9. **Sorting**:
   * SQL Query: `ORDER BY isPinned DESC, updatedAt DESC`. Pinned notes are always displayed first, followed by the most recently updated notes.

---

## 6. How to Open & Run in Android Studio

1. **Prerequisites**:
   * Android Studio Hedgehog (2023.1.1) or newer / Iguana / Jellyfish.
   * JDK 17 configured in Android Studio (`Settings > Build, Execution, Deployment > Build Tools > Gradle > Gradle JDK`).
   * Android SDK 34 installed.
2. **Steps**:
   * Open Android Studio.
   * Select **File > Open...** and navigate to the project directory containing `settings.gradle.kts`.
   * Wait for Gradle Sync to complete.
   * Select an emulator (e.g., Pixel 7 running API 33 or 34) or a connected physical device.
   * Click the green **Run** button (`Shift + F10`) or select `Run > Run 'app'`.

---

## 7. Running Unit Tests

Unit tests are located in `app/src/test/java/com/example/syntecxhubnotes/data/database/NoteDaoTest.kt`.

To execute:
```bash
./gradlew testDebugUnitTest
```
Or right-click `NoteDaoTest` in the Android Studio project tree and select **Run 'NoteDaoTest'**.

### Tests Included:
* `insertAndRetrieveNote`: Verifies insertion and retrieval of note fields.
* `updateNote`: Verifies in-place modification of note title and content.
* `deleteNote`: Verifies removal of note from Room.
* `searchNotesByTitleAndContent`: Tests case-insensitive title and body matching.
* `filterByCategory`: Verifies category-specific filtering.
* `pinNotePrioritizesInOrder`: Verifies that pinned notes appear first.
* `archiveNoteHidesFromActiveList`: Verifies that archived notes are excluded from active list.
