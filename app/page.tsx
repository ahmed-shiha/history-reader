import Link from 'next/link'

const articles = [
  {
    slug: 'pythagoras-monochord',
    title: 'فيثاغورس والوتر المشدود',
    description: 'رحلة عميقة في اكتشاف الأعداد الموسيقيَّة — بين نظرة الإغريق ونظرة العلم الحديث، وما أبدع كلٌّ منهما وما أخفق',
    author_style: 'أسلوب أبي حيان التوحيدي',
    readTime: '٣٥ دقيقة',
  },
]

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Page header */}
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold text-ink mb-4 leading-tight">
          مكتبة القراءة العميقة
        </h1>
        <p className="text-ink-lt text-lg max-w-xl mx-auto leading-relaxed">
          مقالات في التاريخ والفلسفة والعلوم، تُقرأ بتأمُّل وتُحفظ بتمييز
        </p>
        <div className="mt-6 w-16 h-px bg-rule mx-auto" />
      </header>

      {/* Article grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="bg-surface border border-rule rounded-xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
          >
            {/* Author style chip */}
            <span className="self-start text-xs font-medium text-greek bg-greek-light px-2.5 py-1 rounded-full border border-greek/20">
              {article.author_style}
            </span>

            <h2 className="text-xl font-bold text-ink leading-snug">
              {article.title}
            </h2>

            <p className="text-ink-mid text-sm leading-relaxed flex-1">
              {article.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-rule">
              <span className="text-xs text-ink-lt">
                وقت القراءة: {article.readTime}
              </span>
              <Link
                href={`/articles/${article.slug}`}
                className="text-sm font-medium text-modern hover:text-modern/80 bg-modern-light hover:bg-modern/10 px-4 py-1.5 rounded-lg transition-colors"
              >
                اقرأ المقالة
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* Highlighting hint */}
      <footer className="text-center">
        <div className="inline-flex items-center gap-3 bg-highlight/40 border border-rule rounded-lg px-5 py-3 text-sm text-ink-mid">
          <span className="text-base">✍️</span>
          <span>
            حدِّد أي نص أثناء القراءة لتمييزه وإضافة ملاحظة عليه
          </span>
        </div>
      </footer>
    </div>
  )
}
