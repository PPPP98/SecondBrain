package com.example.secondbrain.ui.search

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.example.secondbrain.R
import com.example.secondbrain.data.model.NoteSearchResult

class SearchResultAdapter(
    private val onItemClick: (Long) -> Unit
) : RecyclerView.Adapter<SearchResultAdapter.SearchResultViewHolder>() {

    private var searchResults: List<NoteSearchResult> = emptyList()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SearchResultViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_search_result, parent, false)
        return SearchResultViewHolder(view, onItemClick)
    }

    override fun onBindViewHolder(holder: SearchResultViewHolder, position: Int) {
        holder.bind(searchResults[position])
    }

    override fun getItemCount(): Int = searchResults.size

    fun updateResults(newResults: List<NoteSearchResult>) {
        val diffCallback = NoteSearchDiffCallback(searchResults, newResults)
        val diffResult = DiffUtil.calculateDiff(diffCallback)

        searchResults = newResults
        diffResult.dispatchUpdatesTo(this)
    }

    private class NoteSearchDiffCallback(
        private val oldList: List<NoteSearchResult>,
        private val newList: List<NoteSearchResult>
    ) : DiffUtil.Callback() {

        override fun getOldListSize(): Int = oldList.size

        override fun getNewListSize(): Int = newList.size

        override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
            return oldList[oldItemPosition].id == newList[newItemPosition].id
        }

        override fun areContentsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
            return oldList[oldItemPosition] == newList[newItemPosition]
        }
    }

    class SearchResultViewHolder(
        itemView: View,
        private val onItemClick: (Long) -> Unit
    ) : RecyclerView.ViewHolder(itemView) {

        private val tvNoteTitle: TextView = itemView.findViewById(R.id.tvNoteTitle)
        private val tvNotePreview: TextView = itemView.findViewById(R.id.tvNotePreview)
        private val tvUpdatedAt: TextView = itemView.findViewById(R.id.tvUpdatedAt)

        fun bind(result: NoteSearchResult) {
            tvNoteTitle.text = result.title
            tvNotePreview.text = result.content.take(100) // 100자까지만 미리보기
            tvUpdatedAt.text = formatDateTime(result.updatedAt)

            itemView.setOnClickListener {
                onItemClick(result.id)
            }
        }

        private fun formatDateTime(dateTime: String): String {
            return try {
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                    // Android 8.0 (API 26) 이상: DateTimeFormatter 사용
                    val inputFormatter = java.time.format.DateTimeFormatter.ISO_DATE_TIME
                    val outputFormatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")
                    val dateTimeParsed = java.time.LocalDateTime.parse(dateTime, inputFormatter)
                    dateTimeParsed.format(outputFormatter)
                } else {
                    // Android 7.x 이하: SimpleDateFormat 사용
                    val inputFormat = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", java.util.Locale.getDefault())
                    val outputFormat = java.text.SimpleDateFormat("yyyy-MM-dd HH:mm", java.util.Locale.getDefault())
                    val date = inputFormat.parse(dateTime.substringBefore("."))
                    if (date != null) {
                        outputFormat.format(date)
                    } else {
                        dateTime
                    }
                }
            } catch (e: Exception) {
                android.util.Log.w("SearchResultAdapter", "Date parsing failed: $dateTime", e)
                dateTime // 파싱 실패 시 원본 반환
            }
        }
    }
}
