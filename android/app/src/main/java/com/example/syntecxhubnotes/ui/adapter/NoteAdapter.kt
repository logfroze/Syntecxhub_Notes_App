package com.example.syntecxhubnotes.ui.adapter

import android.content.res.ColorStateList
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

/**
 * RecyclerView ListAdapter for displaying notes with DiffUtil.
 */
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

            // Title & Content
            binding.tvItemTitle.text = if (note.title.isNotBlank()) note.title else "(Untitled Note)"
            binding.tvItemContentPreview.text = if (note.content.isNotBlank()) note.content else "(No content)"

            // Category & color styling
            binding.tvItemCategory.text = note.category
            val categoryColorRes = when (note.category.lowercase(Locale.ROOT)) {
                "personal" -> R.color.category_personal
                "work" -> R.color.category_work
                "study" -> R.color.category_study
                "ideas" -> R.color.category_ideas
                else -> R.color.category_default
            }
            val color = ContextCompat.getColor(context, categoryColorRes)
            binding.tvItemCategory.setTextColor(color)

            // Pin badge visibility
            binding.layoutPinnedBadge.visibility = if (note.isPinned) View.VISIBLE else View.GONE

            // Archive badge visibility
            binding.tvItemArchivedBadge.visibility = if (note.isArchived) View.VISIBLE else View.GONE

            // Date
            binding.tvItemDate.text = dateFormat.format(Date(note.updatedAt))

            // Click listener
            binding.root.setOnClickListener {
                onNoteClick(note)
            }
        }
    }

    class NoteDiffCallback : DiffUtil.ItemCallback<Note>() {
        override fun areItemsTheSame(oldItem: Note, newItem: Note): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Note, newItem: Note): Boolean {
            return oldItem == newItem
        }
    }
}
