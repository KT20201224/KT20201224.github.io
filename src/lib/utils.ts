import type { CollectionEntry } from 'astro:content';
import type { TagWithCount, CategoryWithCount, SeriesInfo } from './types';
import { CATEGORIES, DATE_FORMAT_OPTIONS, SITE_LOCALE } from './constants';

/**
 * Format a date to locale string
 */
export function formatDate(date: Date, locale: string = 'en-us'): string {
  return date.toLocaleDateString(locale, DATE_FORMAT_OPTIONS);
}

/**
 * Sort posts by date (newest first)
 */
export function sortPostsByDate<T extends { data: { pubDate: Date } }>(
  posts: T[]
): T[] {
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

/**
 * Filter out draft posts (in production)
 */
export function filterDraftPosts<T extends { data: { draft?: boolean } }>(
  posts: T[]
): T[] {
  if (import.meta.env.PROD) {
    return posts.filter((post) => !post.data.draft);
  }
  return posts;
}

/**
 * Get published posts (filtered and sorted)
 */
export function getPublishedPosts<
  T extends { data: { pubDate: Date; draft?: boolean } }
>(posts: T[]): T[] {
  return sortPostsByDate(filterDraftPosts(posts));
}

/**
 * Get all unique tags from posts with counts
 */
export function getTagsWithCount(
  posts: CollectionEntry<'blog'>[]
): TagWithCount[] {
  const tagMap = new Map<string, number>();

  posts.forEach((post) => {
    const tags = post.data.tags || [];
    tags.forEach((tag: string) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get all categories with post counts
 */
export function getCategoriesWithCount(
  posts: CollectionEntry<'blog'>[]
): CategoryWithCount[] {
  const categoryMap = new Map<string, number>();

  posts.forEach((post) => {
    const category = post.data.category;
    if (category) {
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    }
  });

  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
    label: cat.label,
    count: categoryMap.get(cat.slug) || 0,
  })).filter((cat) => cat.count > 0);
}

/**
 * Get posts by tag
 */
export function getPostsByTag(
  posts: CollectionEntry<'blog'>[],
  tag: string
): CollectionEntry<'blog'>[] {
  return posts.filter((post) => post.data.tags?.includes(tag));
}

/**
 * Get posts by category
 */
export function getPostsByCategory(
  posts: CollectionEntry<'blog'>[],
  category: string
): CollectionEntry<'blog'>[] {
  return posts.filter((post) => post.data.category === category);
}

/**
 * Get series info for a post
 */
export function getSeriesInfo(
  posts: CollectionEntry<'blog'>[],
  currentPost: CollectionEntry<'blog'>
): SeriesInfo | null {
  const seriesName = currentPost.data.series;
  if (!seriesName) return null;

  const seriesPosts = posts
    .filter((post) => post.data.series === seriesName)
    .sort((a, b) => (a.data.seriesOrder || 0) - (b.data.seriesOrder || 0))
    .map((post) => ({
      slug: post.id,
      title: post.data.title,
      order: post.data.seriesOrder || 0,
    }));

  const currentIndex = seriesPosts.findIndex(
    (post) => post.slug === currentPost.id
  );

  return {
    name: seriesName,
    posts: seriesPosts,
    currentIndex,
  };
}

/**
 * Generate slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w가-힣-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Calculate reading time
 */
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Truncate text to a specific length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get category label by slug
 */
export function getCategoryLabel(slug: string): string {
  const category = CATEGORIES.find((cat) => cat.slug === slug);
  return category?.label || slug;
}

/**
 * Check if current path matches href (for active state)
 */
export function isActiveLink(pathname: string, href: string): boolean {
  const cleanPath = pathname.replace(/\/$/, '');
  const cleanHref = href.replace(/\/$/, '');

  if (cleanHref === '') return cleanPath === '';
  return cleanPath === cleanHref || cleanPath.startsWith(cleanHref + '/');
}

/**
 * Group posts by year
 */
export function groupPostsByYear<T extends { data: { pubDate: Date } }>(
  posts: T[]
): Map<number, T[]> {
  const grouped = new Map<number, T[]>();

  posts.forEach((post) => {
    const year = post.data.pubDate.getFullYear();
    const existing = grouped.get(year) || [];
    grouped.set(year, [...existing, post]);
  });

  return new Map([...grouped.entries()].sort((a, b) => b[0] - a[0]));
}
