
export type Language = 'en' | 'ar' | 'ur' | 'hi' | 'te' | 'ta' | 'ml';

export const LANGUAGES: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'ur', name: 'اردو' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'ml', name: 'മലയാളം' },
];

export type Category = 'National' | 'International' | 'Business' | 'Sports' | 'Entertainment' | 'Tech';

export const CATEGORIES: Category[] = [
  'National',
  'International',
  'Business',
  'Sports',
  'Entertainment',
  'Tech',
];

export type CountryCode = 'sa' | 'pk' | 'bd' | 'in' | 'us' | 'ae';

export const COUNTRIES: { code: CountryCode; name:string }[] = [
    { code: 'sa', name: 'Saudi Arabia' },
    { code: 'pk', name: 'Pakistan' },
    { code: 'bd', name: 'Bangladesh' },
    { code: 'in', name: 'India' },
    { code: 'us', name: 'United States' },
    { code: 'ae', name: 'United Arab Emirates' },
];

export interface Article {
  id: string;
  title: string;
  body: string;
  source: 'manual' | 'api';
  language: Language;
  translations: Partial<Record<Language, { title: string; body: string }>>;
  category: Category;
  coverImage: string;
  author: string;
  publishDate: string; // ISO string
  tags: string[];
  isFeatured?: boolean;
  "data-ai-hint"?: string;
  country?: CountryCode;
}
