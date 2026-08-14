import type { Metadata } from 'next'
import Link from 'next/link'
import { Tajawal } from 'next/font/google'
import './globals.css'
import 'katex/dist/katex.min.css'
import ThemeToggle from '@/components/ThemeToggle'
import ReadingTimer from '@/components/ReadingTimer'

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
})

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
    <html lang="ar" dir="rtl" className={tajawal.variable} suppressHydrationWarning>
      <head>
        {/* FOUC prevention: apply saved theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-paper text-ink font-tajawal">
        <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur border-b border-rule">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="text-lg font-bold text-ink hover:text-greek transition-colors"
            >
              مكتبة القراءة
            </Link>
            <div className="flex items-center gap-1">
              <Link
                href="/books"
                className="text-sm text-ink-mid hover:text-greek transition-colors px-3 py-1.5 rounded-md hover:bg-greek-light"
              >
                الكتب
              </Link>
              <Link
                href="/notes"
                className="text-sm text-ink-mid hover:text-greek transition-colors px-3 py-1.5 rounded-md hover:bg-greek-light"
              >
                الملاحظات
              </Link>
              <ReadingTimer />
              <ThemeToggle />
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
