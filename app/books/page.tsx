import Link from 'next/link'
import { getBookList } from '@/lib/books'

export default function BooksPage() {
  const books = getBookList()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold text-ink mb-4 leading-tight">
          قراءة الكتب
        </h1>
        <p className="text-ink-lt text-lg max-w-xl mx-auto leading-relaxed">
          ملاحظات وتأمُّلات في الكتب المقروءة، مرتَّبة ومحفوظة للرجوع إليها
        </p>
        <div className="mt-6 w-16 h-px bg-rule mx-auto" />
      </header>

      {books.length === 0 && (
        <div className="text-center py-24">
          <p className="text-5xl mb-5">📚</p>
          <p className="text-ink-mid text-base leading-relaxed">
            لم تُضَف كتب بعد
            <br />
            <span className="text-ink-lt text-sm">
              أضِف مجلداً داخل content/books مع ملفات المقالات
            </span>
          </p>
        </div>
      )}

      {books.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {books.map((book) => (
            <article
              key={book.slug}
              className="bg-surface border border-rule rounded-xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              {book.author && (
                <span className="self-start text-xs font-medium text-modern bg-modern-light px-2.5 py-1 rounded-full border border-modern/20">
                  {book.author}
                </span>
              )}

              <h2 className="text-xl font-bold text-ink leading-snug">
                {book.book_title}
              </h2>

              {book.description && (
                <p className="text-ink-mid text-sm leading-relaxed flex-1">
                  {book.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-rule">
                <span className="text-xs text-ink-lt">
                  {book.chapter_count} {book.chapter_count === 1 ? 'مقالة' : 'مقالات'}
                </span>
                <Link
                  href={`/books/${book.slug}`}
                  className="text-sm font-medium text-greek hover:text-greek/80 bg-greek-light hover:bg-greek/10 px-4 py-1.5 rounded-lg transition-colors"
                >
                  استعرض الكتاب
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}

      <footer className="text-center">
        <div className="inline-flex items-center gap-3 bg-highlight/40 border border-rule rounded-lg px-5 py-3 text-sm text-ink-mid">
          <span className="text-base">✍️</span>
          <span>حدِّد أي نص أثناء القراءة لتمييزه وإضافة ملاحظة</span>
        </div>
      </footer>
    </div>
  )
}
