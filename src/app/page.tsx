
import { getArticles } from '@/lib/data';
import { NewsFeed } from '@/components/news-feed';
import type { CountryCode } from '@/lib/types';

export default async function Home({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined }}) {
  const country = searchParams?.country as CountryCode | undefined;
  const articles = await getArticles(country);
  return <NewsFeed articles={articles} />;
}
