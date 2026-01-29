import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';

// Blog post type from content collection
export type BlogPost = CollectionEntry<'blog'>;
export type NewsItem = CollectionEntry<'news'>;

// Extended blog post data type (for schema)
export interface BlogPostData {
  title: string;
  description?: string;
  pubDate: Date;
  updatedDate?: Date;
  heroImage?: ImageMetadata;
  tags?: string[];
  category?: string;
  series?: string;
  seriesOrder?: number;
  draft?: boolean;
}

// News item data type
export interface NewsItemData {
  title: string;
  description?: string;
  pubDate: Date;
}

// Navigation link type
export interface NavLink {
  href: string;
  label: string;
}

// Category type
export interface Category {
  slug: string;
  label: string;
  description: string;
}

// Social link type
export interface SocialLinks {
  github: string;
  tistory: string;
  velog: string;
  email: string;
  phone: string;
}

// TOC heading type
export interface TOCHeading {
  depth: number;
  slug: string;
  text: string;
}

// SEO props type
export interface SEOProps {
  title: string;
  description: string;
  image?: ImageMetadata;
  type?: 'website' | 'article';
  publishedTime?: Date;
  modifiedTime?: Date;
  author?: string;
  tags?: string[];
}

// Series info type
export interface SeriesInfo {
  name: string;
  posts: {
    slug: string;
    title: string;
    order: number;
  }[];
  currentIndex: number;
}

// Tag with count
export interface TagWithCount {
  name: string;
  count: number;
}

// Category with count
export interface CategoryWithCount {
  slug: string;
  label: string;
  count: number;
}
