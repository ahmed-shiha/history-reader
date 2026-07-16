import { getChapter, getBookList, getChapterList } from '@/lib/books'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { Metadata } from 'next'
import ChapterClient from './ChapterClient'
import Why12Table        from '@/components/viz/Why12Table'
import StringVis         from '@/components/viz/StringVis'
import ThreeMeans        from '@/components/viz/ThreeMeans'
import ScaleBuilder      from '@/components/viz/ScaleBuilder'
import CommaVis          from '@/components/viz/CommaVis'
import MathBlock         from '@/components/viz/MathBlock'
import AestheticNote     from '@/components/viz/AestheticNote'
import IrrationalProof   from '@/components/viz/IrrationalProof'
import SqrtGrid          from '@/components/viz/SqrtGrid'
import PolygonExhaustion from '@/components/viz/PolygonExhaustion'
import GeometricAlgebra  from '@/components/viz/GeometricAlgebra'
import SexagesimalVis    from '@/components/viz/SexagesimalVis'
import PlatonicSolidsVis from '@/components/viz/PlatonicSolidsVis'
import MilesianTheories  from '@/components/viz/MilesianTheories'
import ZenoParadox       from '@/components/viz/ZenoParadox'
import AristotleMotion   from '@/components/viz/AristotleMotion'
import HeliocentricVis   from '@/components/viz/HeliocentricVis'

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
  PlatonicSolidsVis,
  MilesianTheories,
  ZenoParadox,
  AristotleMotion,
  HeliocentricVis,
}

interface PageProps {
  params: { slug: string; chapter: string }
}

export async function generateStaticParams() {
  const books = getBookList()
  const params: { slug: string; chapter: string }[] = []
  for (const book of books) {
    const chapters = getChapterList(book.slug)
    for (const chapter of chapters) {
      params.push({ slug: book.slug, chapter: chapter.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await getChapter(params.slug, params.chapter)
  if (!result) return {}
  return {
    title: result.meta.title,
    description: result.meta.description,
  }
}

export default async function ChapterPage({ params }: PageProps) {
  const result = await getChapter(params.slug, params.chapter)
  if (!result) notFound()

  return (
    <ChapterClient
      bookSlug={params.slug}
      chapterSlug={params.chapter}
      meta={result.meta}
    >
      <MDXRemote source={result.content} components={MDX_COMPONENTS} />
    </ChapterClient>
  )
}
