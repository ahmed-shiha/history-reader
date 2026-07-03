import { getArticle, getAllSlugs } from '@/lib/articles'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { Metadata } from 'next'
import ArticleClient from './ArticleClient'
import Why12Table      from '@/components/viz/Why12Table'
import StringVis       from '@/components/viz/StringVis'
import ThreeMeans      from '@/components/viz/ThreeMeans'
import ScaleBuilder    from '@/components/viz/ScaleBuilder'
import CommaVis        from '@/components/viz/CommaVis'
import MathBlock       from '@/components/viz/MathBlock'
import AestheticNote   from '@/components/viz/AestheticNote'
import IrrationalProof from '@/components/viz/IrrationalProof'
import SqrtGrid        from '@/components/viz/SqrtGrid'
import PolygonExhaustion from '@/components/viz/PolygonExhaustion'
import GeometricAlgebra from '@/components/viz/GeometricAlgebra'
import SexagesimalVis  from '@/components/viz/SexagesimalVis'

const MDX_COMPONENTS = {
  Why12Table,
  StringVis,
  ThreeMeans,
  ScaleBuilder,
  CommaVis,
  MathBlock,
  AestheticNote,
  IrrationalProof,
  SqrtGrid,
  PolygonExhaustion,
  GeometricAlgebra,
  SexagesimalVis,
}

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
      <MDXRemote source={article.content} components={MDX_COMPONENTS} />
    </ArticleClient>
  )
}
