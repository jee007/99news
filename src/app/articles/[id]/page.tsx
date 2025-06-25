
import { getArticle } from '@/lib/data';
import { ArticleView } from '@/components/article/article-view';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Article, CountryCode } from '@/lib/types';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const decodedId = decodeURIComponent(params.id);
  const country = searchParams.country as CountryCode | undefined;
  const article = await getArticle(decodedId, country);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | LatestNews9.com`,
    description: article.body.substring(0, 150),
    openGraph: {
        title: article.title,
        description: article.body.substring(0, 150),
        images: [
            {
                url: article.coverImage,
                width: 600,
                height: 400,
                alt: article.title,
            }
        ],
    },
  };
}


export default async function ArticlePage({ params, searchParams }: Props) {
  const decodedId = decodeURIComponent(params.id);
  const country = searchParams.country as CountryCode | undefined;
  const article = await getArticle(decodedId, country);

  if (!article) {
    notFound();
  }

  return <ArticleView article={article as Article} />;
}
