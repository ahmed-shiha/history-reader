import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { BookSummary, ChapterMeta } from './types'

const BOOKS_DIR = path.join(process.cwd(), 'content', 'books')

function parseChapterMeta(
  filename: string,
  data: Record<string, unknown>,
  bookSlug: string,
): ChapterMeta {
  const slugFromFile = filename.replace(/\.(mdx|md)$/, '')
  return {
    slug: typeof data.slug === 'string' ? data.slug : slugFromFile,
    book_slug: bookSlug,
    book_title: typeof data.book_title === 'string' ? data.book_title : '',
    author: typeof data.author === 'string' ? data.author : '',
    title: typeof data.title === 'string' ? data.title : slugFromFile,
    description: typeof data.description === 'string' ? data.description : '',
    date: typeof data.date === 'string' ? data.date : '',
    order: typeof data.order === 'number' ? data.order : 999,
    sections: Array.isArray(data.sections) ? (data.sections as string[]) : [],
  }
}

export function getChapterList(bookSlug: string): ChapterMeta[] {
  const bookDir = path.join(BOOKS_DIR, bookSlug)
  if (!fs.existsSync(bookDir)) return []

  const filenames = fs
    .readdirSync(bookDir)
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))

  return filenames
    .map((filename) => {
      const filePath = path.join(bookDir, filename)
      const rawContent = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(rawContent)
      return parseChapterMeta(filename, data, bookSlug)
    })
    .sort((a, b) => a.order - b.order)
}

export function getBookList(): BookSummary[] {
  if (!fs.existsSync(BOOKS_DIR)) return []

  const entries = fs.readdirSync(BOOKS_DIR, { withFileTypes: true })
  const bookDirs = entries.filter((e) => e.isDirectory())

  return bookDirs
    .map((dir) => {
      const chapters = getChapterList(dir.name)
      if (chapters.length === 0) return null
      const first = chapters[0]
      return {
        slug: dir.name,
        book_title: first.book_title || dir.name,
        author: first.author || '',
        description: first.description || '',
        chapter_count: chapters.length,
      } as BookSummary
    })
    .filter(Boolean) as BookSummary[]
}

export async function getChapter(
  bookSlug: string,
  chapterSlug: string,
): Promise<{ meta: ChapterMeta; content: string } | null> {
  const bookDir = path.join(BOOKS_DIR, bookSlug)
  if (!fs.existsSync(bookDir)) return null

  const filenames = fs
    .readdirSync(bookDir)
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))

  for (const filename of filenames) {
    const filePath = path.join(bookDir, filename)
    const rawContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(rawContent)
    const meta = parseChapterMeta(filename, data, bookSlug)
    if (meta.slug !== chapterSlug) continue
    return { meta, content }
  }

  return null
}
