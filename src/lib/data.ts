
import type { Article, Category, CountryCode } from './types';
import { CATEGORIES } from './types';

// Map our app's categories to GNews.io categories
const categoryEndpointMapping: Partial<Record<Category, string>> = {
  Business: 'business',
  Sports: 'sports',
  Entertainment: 'entertainment',
  Tech: 'technology',
  National: 'nation',
  International: 'world',
};

// Map GNews article to our Article type
function mapApiArticle(apiArticle: any, category: Category, country: CountryCode): Article | null {
  // GNews requires a title and a url
  if (!apiArticle.title || !apiArticle.url) {
    return null;
  }

  return {
    id: apiArticle.url, // Use the article URL as a unique ID
    title: apiArticle.title,
    // Use content, fallback to description, then a default message
    body: apiArticle.content || apiArticle.description || 'No content available.',
    source: 'api',
    language: 'en',
    translations: {},
    category: category,
    // Use the article image, fallback to a placeholder
    coverImage: apiArticle.image || `https://placehold.co/600x400.png`,
    author: apiArticle.source?.name || 'Unknown Source',
    publishDate: new Date(apiArticle.publishedAt).toISOString(),
    tags: [], // GNews doesn't provide tags
    'data-ai-hint': category.toLowerCase(),
    country: country,
  };
}

async function fetchArticlesForCategory(category: Category, country: CountryCode): Promise<Article[]> {
  const apiKey = process.env.GNEWS_API_KEY;

  const gnewsCategory = categoryEndpointMapping[category];
  // If the category isn't supported by GNews, or we have no API key, return empty
  if (!gnewsCategory || !apiKey) {
    return [];
  }

  // Only apply country filter for 'National' news to get country-specific headlines.
  // For other categories, we fetch global news.
  const countryParam = category === 'National' ? `&country=${country}` : '';

  // Build the URL for the top-headlines endpoint
  const url = `https://gnews.io/api/v4/top-headlines?category=${gnewsCategory}&lang=en${countryParam}&max=10&apikey=${apiKey}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${category} news from GNews: ${response.statusText}`);
      // The error body might contain more details, especially for non-401 errors.
      if (response.status !== 401) {
        const errorBody = await response.text();
        console.error(`Error Body for ${category}:`, errorBody);
      }
      return [];
    }

    const data = await response.json();
    
    // Check if the response has articles
    if (!data.articles) {
      console.warn(`GNews response for ${category} did not contain articles.`, data);
      return [];
    }
    
    // Map the fetched articles to our Article format
    return (data.articles || [])
      .map((article: any) => mapApiArticle(article, category, country))
      .filter((article: Article | null): article is Article => article !== null);

  } catch (error) {
    console.error(`An error occurred while fetching ${category} news from GNews:`, error);
    return [];
  }
}

export async function getArticles(country: CountryCode = 'us'): Promise<Article[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey || apiKey === "...") {
    // This provides a clear error for the most common setup issue.
    console.error("GNEWS_API_KEY environment variable not set or is a placeholder. Please add a valid key to your .env file to fetch articles.");
    return [];
  }

  // Create a promise for each category fetch, passing the selected country
  const articlePromises = CATEGORIES.map(cat => fetchArticlesForCategory(cat, country));
  
  // Wait for all fetches to complete
  const results = await Promise.allSettled(articlePromises);

  // Combine articles from all successful fetches
  const allArticles = results
    .filter(result => result.status === 'fulfilled')
    .flatMap(result => (result as PromiseFulfilledResult<Article[]>).value);
    
  // This check can help identify if a valid-looking key is still failing.
  if (allArticles.length === 0 && results.some(r => r.status === 'fulfilled')) {
      console.warn("API calls succeeded but returned no articles. Your GNEWS_API_KEY might be invalid or have restrictions.");
  }
    
  // Ensure we only have unique articles (based on ID/URL)
  const uniqueArticles = Array.from(new Map(allArticles.map(a => [a.id, a])).values());
  
  // Sort articles by publish date, newest first
  uniqueArticles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  return uniqueArticles;
}

export async function getArticle(id: string, country?: CountryCode): Promise<Article | undefined> {
  const articles = await getArticles(country);
  // Find article by ID (which is the URL for GNews)
  return articles.find(a => a.id === id);
}
