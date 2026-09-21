package com.example.syntecxhubnotes.ui.viewmodel

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

/**
 * ViewModel for managing Notes UI state and database operations via coroutines.
 */
@OptIn(ExperimentalCoroutinesApi::class)
class NoteViewModel(private val repository: NoteRepository) : ViewModel() {

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedCategory = MutableStateFlow("All")
    val selectedCategory: StateFlow<String> = _selectedCategory.asStateFlow()

    private val _isArchivedMode = MutableStateFlow(false)
    val isArchivedMode: StateFlow<Boolean> = _isArchivedMode.asStateFlow()

    /**
     * Combined flow producing the filtered list of notes based on search query,
     * category selection, and archive mode.
     */
    val notes = combine(_isArchivedMode, _selectedCategory, _searchQuery) { isArchived, category, query ->
        Triple(isArchived, category, query)
    }.flatMapLatest { (isArchived, category, query) ->
        repository.getNotes(isArchived, category, query)
    }.asLiveData()

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setSelectedCategory(category: String) {
        _selectedCategory.value = category
    }

    fun setArchivedMode(isArchived: Boolean) {
        _isArchivedMode.value = isArchived
    }

    fun insertNote(title: String, content: String, category: String, onComplete: ((Long) -> Unit)? = null) {
        viewModelScope.launch {
            val note = Note(
                title = title.trim(),
                content = content.trim(),
                category = category,
                isPinned = false,
                isArchived = false,
                createdAt = System.currentTimeMillis(),
                updatedAt = System.currentTimeMillis()
            )
            val id = repository.insert(note)
            onComplete?.invoke(id)
        }
    }

    fun updateNote(note: Note, newTitle: String, newContent: String, newCategory: String, onComplete: (() -> Unit)? = null) {
        viewModelScope.launch {
            val updated = note.copy(
                title = newTitle.trim(),
                content = newContent.trim(),
                category = newCategory,
                updatedAt = System.currentTimeMillis()
            )
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

    fun deleteNoteById(id: Long, onComplete: (() -> Unit)? = null) {
        viewModelScope.launch {
            repository.deleteById(id)
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
}
