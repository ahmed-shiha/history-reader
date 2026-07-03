import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'مكتبة القراءة العميقة',
  description: 'مكتبة رقمية للقراءة العميقة في التاريخ والفلسفة والعلوم، مع إمكانية تمييز النصوص وكتابة الملاحظات',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-paper text-ink font-arabic">
        <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur border-b border-rule">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="text-lg font-bold text-ink hover:text-greek transition-colors"
            >
              مكتبة القراءة
            </Link>
            <Link
              href="/notes"
              className="text-sm text-ink-mid hover:text-greek transition-colors px-3 py-1.5 rounded-md hover:bg-greek-light"
            >
              الملاحظات
            </Link>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
