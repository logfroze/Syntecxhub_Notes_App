package com.example.syntecxhubnotes.ui

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.Menu
import android.view.MenuItem
import android.view.View
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.syntecxhubnotes.NotesApplication
import com.example.syntecxhubnotes.R
import com.example.syntecxhubnotes.databinding.ActivityMainBinding
import com.example.syntecxhubnotes.ui.adapter.NoteAdapter
import com.example.syntecxhubnotes.ui.viewmodel.NoteViewModel
import com.example.syntecxhubnotes.ui.viewmodel.NoteViewModelFactory

/**
 * Main Activity displaying the notes list, search bar, category chips, and FAB.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    private val viewModel: NoteViewModel by viewModels {
        NoteViewModelFactory((application as NotesApplication).repository)
    }

    private lateinit var noteAdapter: NoteAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)

        setupRecyclerView()
        setupSearch()
        setupCategoryChips()
        setupArchiveBanner()
        observeNotes()

        binding.fabAddNote.setOnClickListener {
            val intent = Intent(this, AddEditNoteActivity::class.java)
            startActivity(intent)
        }
    }

    private fun setupRecyclerView() {
        noteAdapter = NoteAdapter { note ->
            val intent = Intent(this, NoteDetailActivity::class.java).apply {
                putExtra(NoteDetailActivity.EXTRA_NOTE_ID, note.id)
            }
            startActivity(intent)
        }
        binding.recyclerViewNotes.apply {
            layoutManager = LinearLayoutManager(this@MainActivity)
            adapter = noteAdapter
            setHasFixedSize(true)
        }
    }

    private fun setupSearch() {
        binding.etSearch.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val query = s?.toString().orEmpty()
                viewModel.setSearchQuery(query)
                binding.btnClearSearch.visibility = if (query.isNotBlank()) View.VISIBLE else View.GONE
            }
            override fun afterTextChanged(s: Editable?) {}
        })

        binding.btnClearSearch.setOnClickListener {
            binding.etSearch.text?.clear()
            viewModel.setSearchQuery("")
        }
    }

    private fun setupCategoryChips() {
        binding.chipGroupCategories.setOnCheckedStateChangeListener { _, checkedIds ->
            if (checkedIds.isEmpty()) return@setOnCheckedStateChangeListener
            val selectedCategory = when (checkedIds.first()) {
                R.id.chip_category_personal -> "Personal"
                R.id.chip_category_work -> "Work"
                R.id.chip_category_study -> "Study"
                R.id.chip_category_ideas -> "Ideas"
                else -> "All"
            }
            viewModel.setSelectedCategory(selectedCategory)
        }
    }

    private fun setupArchiveBanner() {
        binding.btnExitArchive.setOnClickListener {
            toggleArchivedMode(false)
        }
    }

    private fun observeNotes() {
        viewModel.notes.observe(this) { notes ->
            noteAdapter.submitList(notes)

            val isEmpty = notes.isNullOrEmpty()
            binding.layoutEmptyState.visibility = if (isEmpty) View.VISIBLE else View.GONE
            binding.recyclerViewNotes.visibility = if (isEmpty) View.GONE else View.VISIBLE

            if (isEmpty) {
                val isArchived = viewModel.isArchivedMode.value
                val hasQuery = viewModel.searchQuery.value.isNotBlank()
                binding.tvEmptyMessage.text = when {
                    hasQuery -> getString(R.string.empty_search)
                    isArchived -> getString(R.string.empty_archived)
                    else -> getString(R.string.empty_notes)
                }
            }
        }
    }

    private fun toggleArchivedMode(archived: Boolean) {
        viewModel.setArchivedMode(archived)
        binding.layoutArchiveBanner.visibility = if (archived) View.VISIBLE else View.GONE
        binding.fabAddNote.visibility = if (archived) View.GONE else View.VISIBLE
        binding.toolbar.title = if (archived) getString(R.string.filter_archived) else getString(R.string.app_name)
        invalidateOptionsMenu()
    }

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        menuInflater.inflate(R.menu.main_menu, menu)
        val archiveItem = menu?.findItem(R.id.action_toggle_archive_view)
        if (viewModel.isArchivedMode.value) {
            archiveItem?.title = getString(R.string.filter_active)
        } else {
            archiveItem?.title = getString(R.string.filter_archived)
        }
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_toggle_archive_view -> {
                val newArchivedState = !viewModel.isArchivedMode.value
                toggleArchivedMode(newArchivedState)
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
}
