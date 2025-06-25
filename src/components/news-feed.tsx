
'use client';

import type { Article } from '@/lib/types';
import { useFilter } from '@/hooks/use-filter';
import { ArticleCard } from './article/article-card';
import { useLanguage } from '@/hooks/use-language';
import { useMemo } from 'react';
import { AdBanner } from './ad-banner';

export function NewsFeed({ articles }: { articles: Article[] }) {
  const { searchTerm, category } = useFilter();
  const { language } = useLanguage();

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const title = article.translations[language]?.title || article.title;
      const body = article.translations[language]?.body || article.body;

      const matchesSearch = 
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        body.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = category === 'All' || article.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchTerm, category, language]);

  return (
    <div>
      <AdBanner />
      {filteredArticles.length === 0 ? (
        <div className="text-center text-muted-foreground mt-10">
          <p className="text-lg">No articles found.</p>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
