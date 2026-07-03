import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ArticleMeta } from './types'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

/**
 * Read all MDX files from the articles directory and parse their frontmatter.
 * Returns an array of ArticleMeta objects (no body content).
 */
export function getArticleList(): ArticleMeta[] {
  if (!fs.existsSync(ARTICLES_DIR)) {
    return []
  }

  const filenames = fs
    .readdirSync(ARTICLES_DIR)
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))

  const articles: ArticleMeta[] = filenames
    .map((filename) => {
      const filePath = path.join(ARTICLES_DIR, filename)
      const rawContent = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(rawContent)

      // Derive slug from filename if not explicitly set in frontmatter
      const slugFromFile = filename.replace(/\.(mdx|md)$/, '')

      const meta: ArticleMeta = {
        slug: typeof data.slug === 'string' ? data.slug : slugFromFile,
        title: typeof data.title === 'string' ? data.title : slugFromFile,
        description: typeof data.description === 'string' ? data.description : '',
        author_style: typeof data.author_style === 'string' ? data.author_style : '',
        date: typeof data.date === 'string' ? data.date : '',
        sections: Array.isArray(data.sections) ? (data.sections as string[]) : [],
      }

      return meta
    })
    // Sort by date descending, then by title alphabetically as a tiebreaker
    .sort((a, b) => {
      if (b.date && a.date) return b.date.localeCompare(a.date)
      return a.title.localeCompare(b.title)
    })

  return articles
}

/**
 * Return the metadata and raw MDX content string for a single article by slug.
 * Returns null if no matching file is found.
 */
export async function getArticle(
  slug: string
): Promise<{ meta: ArticleMeta; content: string } | null> {
  if (!fs.existsSync(ARTICLES_DIR)) {
    return null
  }

  const filenames = fs
    .readdirSync(ARTICLES_DIR)
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))

  for (const filename of filenames) {
    const filePath = path.join(ARTICLES_DIR, filename)
    const rawContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(rawContent)

    const slugFromFile = filename.replace(/\.(mdx|md)$/, '')
    const articleSlug = typeof data.slug === 'string' ? data.slug : slugFromFile

    if (articleSlug !== slug) continue

    const meta: ArticleMeta = {
      slug: articleSlug,
      title: typeof data.title === 'string' ? data.title : slugFromFile,
      description: typeof data.description === 'string' ? data.description : '',
      author_style: typeof data.author_style === 'string' ? data.author_style : '',
      date: typeof data.date === 'string' ? data.date : '',
      sections: Array.isArray(data.sections) ? (data.sections as string[]) : [],
    }

    return { meta, content }
  }

  return null
}

/**
 * Return all article slugs — useful for Next.js static path generation
 * (e.g. inside generateStaticParams or getStaticPaths).
 */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) {
    return []
  }

  const filenames = fs
    .readdirSync(ARTICLES_DIR)
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))

  return filenames.map((filename) => {
    const filePath = path.join(ARTICLES_DIR, filename)
    const rawContent = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(rawContent)

    const slugFromFile = filename.replace(/\.(mdx|md)$/, '')
    return typeof data.slug === 'string' ? data.slug : slugFromFile
  })
}
