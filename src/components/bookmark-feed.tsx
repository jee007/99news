
'use client';

import type { Article } from '@/lib/types';
import { useBookmark } from '@/hooks/use-bookmark';
import { ArticleCard } from './article/article-card';
import { useMemo } from 'react';

export function BookmarkFeed({ articles }: { articles: Article[] }) {
  const { bookmarks } = useBookmark();

  const bookmarkedArticles = useMemo(() => {
    const bookmarkSet = new Set(bookmarks);
    return articles.filter(article => bookmarkSet.has(article.id));
  }, [articles, bookmarks]);

  if (bookmarkedArticles.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-10">
        <p className="text-lg">You haven't bookmarked any articles yet.</p>
        <p>Click the bookmark icon on an article to save it for later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {bookmarkedArticles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
