import Link from 'next/link'
import { getChapterList } from '@/lib/books'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface PageProps {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const chapters = getChapterList(params.slug)
  if (chapters.length === 0) return {}
  return {
    title: chapters[0].book_title,
    description: chapters[0].description,
  }
}

export default function BookDetailPage({ params }: PageProps) {
  const chapters = getChapterList(params.slug)
  if (chapters.length === 0) notFound()

  const { book_title, author } = chapters[0]

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        href="/books"
        className="inline-flex items-center gap-1 text-sm text-ink-lt hover:text-greek transition-colors mb-8"
      >
        <span aria-hidden="true">→</span>
        الكتب
      </Link>

      {/* Book header */}
      <header className="mb-12">
        {author && (
          <span className="block text-sm font-medium text-modern mb-2">{author}</span>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight mb-4">
          {book_title}
        </h1>
        <div className="w-12 h-px bg-rule mt-6" />
      </header>

      {/* Chapter list */}
      <section>
        <p className="text-xs font-semibold text-ink-lt tracking-widest mb-6">
          المَقَالَاتُ — {chapters.length}
        </p>
        <div className="space-y-3">
          {chapters.map((chapter, i) => (
            <Link
              key={chapter.slug}
              href={`/books/${params.slug}/${chapter.slug}`}
              className="flex items-start gap-5 p-5 bg-surface border border-rule rounded-xl hover:shadow-md transition-all group"
            >
              {/* Order number */}
              <span className="text-xl font-bold text-rule group-hover:text-greek transition-colors min-w-[2rem] text-center mt-0.5">
                {i + 1}
              </span>

              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-ink leading-snug mb-1 group-hover:text-greek transition-colors">
                  {chapter.title}
                </h2>
                {chapter.description && (
                  <p className="text-sm text-ink-lt leading-relaxed line-clamp-2">
                    {chapter.description}
                  </p>
                )}
                {chapter.date && (
                  <time
                    dateTime={chapter.date}
                    className="text-xs text-ink-lt mt-2 block"
                  >
                    {new Date(chapter.date).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </time>
                )}
              </div>

              <span className="text-greek opacity-0 group-hover:opacity-100 transition-opacity self-center text-lg">
                ←
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
