import { getArticle, getAllSlugs } from '@/lib/articles'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { Metadata } from 'next'
import ArticleClient from './ArticleClient'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticle(params.slug)
  if (!article) return {}
  return {
    title: article.meta.title,
    description: article.meta.description,
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticle(params.slug)
  if (!article) notFound()

  return (
    <ArticleClient slug={params.slug} meta={article.meta}>
      <MDXRemote source={article.content} />
    </ArticleClient>
  )
}
