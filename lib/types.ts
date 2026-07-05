export interface Note {
  id: string
  article_slug: string
  section_heading: string | null
  selected_text: string
  note_content: string
  char_start: number | null
  char_end: number | null
  created_at: string
  updated_at: string
}

export interface CreateNoteInput {
  article_slug: string
  section_heading?: string
  selected_text: string
  note_content: string
  char_start?: number
  char_end?: number
}

export interface ArticleMeta {
  slug: string
  title: string
  description: string
  author_style: string
  date: string
  sections: string[]
}

export interface BookSummary {
  slug: string
  book_title: string
  author: string
  description: string
  chapter_count: number
}

export interface ChapterMeta {
  slug: string
  book_slug: string
  book_title: string
  author: string
  title: string
  description: string
  date: string
  order: number
  sections: string[]
}
