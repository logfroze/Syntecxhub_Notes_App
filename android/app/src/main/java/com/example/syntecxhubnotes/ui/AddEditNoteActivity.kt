package com.example.syntecxhubnotes.ui

import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.syntecxhubnotes.NotesApplication
import com.example.syntecxhubnotes.R
import com.example.syntecxhubnotes.data.model.Note
import com.example.syntecxhubnotes.databinding.ActivityAddEditNoteBinding
import com.example.syntecxhubnotes.ui.viewmodel.NoteViewModel
import com.example.syntecxhubnotes.ui.viewmodel.NoteViewModelFactory
import kotlinx.coroutines.launch

/**
 * Activity for both creating a new note and editing an existing note.
 */
class AddEditNoteActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_NOTE_ID = "extra_note_id"
    }

    private lateinit var binding: ActivityAddEditNoteBinding
    private val viewModel: NoteViewModel by viewModels {
        NoteViewModelFactory((application as NotesApplication).repository)
    }

    private var existingNoteId: Long = -1L
    private var existingNote: Note? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAddEditNoteBinding.inflate(layoutInflater)
        setContentView(binding.root)

        existingNoteId = intent.getLongExtra(EXTRA_NOTE_ID, -1L)

        setupToolbar()
        setupListeners()

        if (existingNoteId != -1L) {
            loadExistingNote(existingNoteId)
        }
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.toolbar.setNavigationOnClickListener {
            finish()
        }
        binding.toolbar.title = if (existingNoteId != -1L) {
            getString(R.string.edit_note)
        } else {
            getString(R.string.add_note)
        }
    }

    private fun loadExistingNote(id: Long) {
        lifecycleScope.launch {
            val note = (application as NotesApplication).repository.getNoteById(id)
            if (note != null) {
                existingNote = note
                binding.etTitle.setText(note.title)
                binding.etContent.setText(note.content)
                selectCategoryChip(note.category)
            } else {
                Toast.makeText(this@AddEditNoteActivity, "Note not found", Toast.LENGTH_SHORT).show()
                finish()
            }
        }
    }

    private fun selectCategoryChip(category: String) {
        when (category) {
            "Personal" -> binding.chipEditPersonal.isChecked = true
            "Work" -> binding.chipEditWork.isChecked = true
            "Study" -> binding.chipEditStudy.isChecked = true
            "Ideas" -> binding.chipEditIdeas.isChecked = true
            else -> binding.chipEditStudy.isChecked = true
        }
    }

    private fun getSelectedCategory(): String {
        return when (binding.chipGroupEditCategory.checkedChipId) {
            R.id.chip_edit_personal -> "Personal"
            R.id.chip_edit_work -> "Work"
            R.id.chip_edit_study -> "Study"
            R.id.chip_edit_ideas -> "Ideas"
            else -> "Study"
        }
    }

    private fun setupListeners() {
        binding.btnCancel.setOnClickListener {
            finish()
        }

        binding.btnSave.setOnClickListener {
            saveNote()
        }
    }

    private fun saveNote() {
        val title = binding.etTitle.text?.toString()?.trim().orEmpty()
        val content = binding.etContent.text?.toString()?.trim().orEmpty()
        val category = getSelectedCategory()

        // Validation: prevent completely empty notes
        if (title.isBlank() && content.isBlank()) {
            Toast.makeText(this, getString(R.string.error_empty_note), Toast.LENGTH_LONG).show()
            return
        }

        if (existingNote != null) {
            // Update existing note
            viewModel.updateNote(existingNote!!, title, content, category) {
                Toast.makeText(this@AddEditNoteActivity, getString(R.string.note_updated), Toast.LENGTH_SHORT).show()
                finish()
            }
        } else {
            // Insert new note
            viewModel.insertNote(title, content, category) {
                Toast.makeText(this@AddEditNoteActivity, getString(R.string.note_saved), Toast.LENGTH_SHORT).show()
                finish()
            }
        }
    }
}
