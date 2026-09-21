package com.example.syntecxhubnotes.ui

import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.example.syntecxhubnotes.NotesApplication
import com.example.syntecxhubnotes.R
import com.example.syntecxhubnotes.data.model.Note
import com.example.syntecxhubnotes.databinding.ActivityNoteDetailBinding
import com.example.syntecxhubnotes.ui.viewmodel.NoteViewModel
import com.example.syntecxhubnotes.ui.viewmodel.NoteViewModelFactory
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Activity displaying full details of a note with actions to Pin, Archive, Edit, and Delete.
 */
class NoteDetailActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_NOTE_ID = "extra_note_id"
    }

    private lateinit var binding: ActivityNoteDetailBinding
    private val viewModel: NoteViewModel by viewModels {
        NoteViewModelFactory((application as NotesApplication).repository)
    }

    private var currentNote: Note? = null
    private var noteId: Long = -1L
    private val dateFormat = SimpleDateFormat("MMM d, yyyy • h:mm a", Locale.getDefault())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityNoteDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        noteId = intent.getLongExtra(EXTRA_NOTE_ID, -1L)
        if (noteId == -1L) {
            Toast.makeText(this, "Invalid note ID", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        setupToolbar()
        observeNote()
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.toolbar.setNavigationOnClickListener {
            finish()
        }
    }

    private fun observeNote() {
        lifecycleScope.launch {
            viewModel.getNoteByIdFlow(noteId).collect { note ->
                if (note == null) {
                    // Note was deleted or does not exist
                    if (!isFinishing) {
                        finish()
                    }
                    return@collect
                }
                currentNote = note
                populateDetails(note)
                invalidateOptionsMenu()
            }
        }
    }

    private fun populateDetails(note: Note) {
        binding.tvDetailTitle.text = if (note.title.isNotBlank()) note.title else "(Untitled Note)"
        binding.tvDetailContent.text = note.content
        binding.tvDetailCategory.text = note.category

        val categoryColorRes = when (note.category.lowercase(Locale.ROOT)) {
            "personal" -> R.color.category_personal
            "work" -> R.color.category_work
            "study" -> R.color.category_study
            "ideas" -> R.color.category_ideas
            else -> R.color.category_default
        }
        binding.tvDetailCategory.setTextColor(ContextCompat.getColor(this, categoryColorRes))

        binding.layoutDetailPinned.visibility = if (note.isPinned) View.VISIBLE else View.GONE
        binding.tvDetailArchived.visibility = if (note.isArchived) View.VISIBLE else View.GONE

        binding.tvDetailTimestamp.text = "Last updated: " + dateFormat.format(Date(note.updatedAt))
    }

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        menuInflater.inflate(R.menu.detail_menu, menu)
        val note = currentNote ?: return true

        // Update Pin menu item title and icon
        val pinItem = menu?.findItem(R.id.action_pin)
        if (note.isPinned) {
            pinItem?.title = getString(R.string.unpin)
            pinItem?.setIcon(R.drawable.ic_unpin)
        } else {
            pinItem?.title = getString(R.string.pin)
            pinItem?.setIcon(R.drawable.ic_pin)
        }

        // Update Archive menu item title and icon
        val archiveItem = menu?.findItem(R.id.action_archive)
        if (note.isArchived) {
            archiveItem?.title = getString(R.string.unarchive)
            archiveItem?.setIcon(R.drawable.ic_unarchive)
        } else {
            archiveItem?.title = getString(R.string.archive)
            archiveItem?.setIcon(R.drawable.ic_archive)
        }

        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        val note = currentNote ?: return super.onOptionsItemSelected(item)

        return when (item.itemId) {
            R.id.action_pin -> {
                viewModel.togglePin(note) {
                    val message = if (!note.isPinned) getString(R.string.note_pinned) else getString(R.string.note_unpinned)
                    Toast.makeText(this@NoteDetailActivity, message, Toast.LENGTH_SHORT).show()
                }
                true
            }
            R.id.action_archive -> {
                viewModel.toggleArchive(note) {
                    val message = if (!note.isArchived) getString(R.string.note_archived) else getString(R.string.note_unarchived)
                    Toast.makeText(this@NoteDetailActivity, message, Toast.LENGTH_SHORT).show()
                }
                true
            }
            R.id.action_edit -> {
                val intent = Intent(this, AddEditNoteActivity::class.java).apply {
                    putExtra(AddEditNoteActivity.EXTRA_NOTE_ID, note.id)
                }
                startActivity(intent)
                true
            }
            R.id.action_delete -> {
                showDeleteConfirmationDialog(note)
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun showDeleteConfirmationDialog(note: Note) {
        AlertDialog.Builder(this)
            .setTitle(R.string.delete_confirm_title)
            .setMessage(R.string.delete_confirm_message)
            .setPositiveButton(R.string.delete) { _, _ ->
                viewModel.deleteNote(note) {
                    Toast.makeText(this@NoteDetailActivity, getString(R.string.note_deleted), Toast.LENGTH_SHORT).show()
                    finish()
                }
            }
            .setNegativeButton(R.string.cancel, null)
            .show()
    }
}
