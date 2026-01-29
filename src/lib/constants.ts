// Site Configuration
export const SITE_TITLE = 'Jerry Blog';
export const SITE_DESCRIPTION = 'Welcome to my website!';
export const SITE_URL = 'https://KT20201224.github.io';
export const SITE_AUTHOR = 'Kyoungtea Kim';
export const SITE_LOCALE = 'ko-KR';

// Navigation Links
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/news', label: 'News' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
] as const;

// Categories
export const CATEGORIES = [
  { slug: 'ml', label: 'Machine Learning', description: '머신러닝 및 딥러닝 관련 글' },
  { slug: 'devops', label: 'DevOps', description: 'DevOps, CI/CD, 인프라 관련 글' },
  { slug: 'web', label: 'Web Development', description: '웹 개발 관련 글' },
  { slug: 'llm', label: 'LLM', description: 'LLM 및 AI 관련 글' },
  { slug: 'etc', label: 'ETC', description: '기타 글' },
] as const;

// Social Links
export const SOCIAL_LINKS = {
  github: 'https://github.com/KT20201224',
  tistory: 'https://lets-post-it.tistory.com',
  velog: 'https://velog.io/@rude/posts',
  email: 'rudxo0525@gmail.com',
  phone: '+82 10-3367-1828',
} as const;

// Giscus Configuration (for comments)
export const GISCUS_CONFIG = {
  repo: 'KT20201224/KT20201224.github.io' as const,
  repoId: '', // Fill in after enabling Giscus
  category: 'Comments',
  categoryId: '', // Fill in after enabling Giscus
  mapping: 'pathname' as const,
  strict: '0' as const,
  reactionsEnabled: '1' as const,
  emitMetadata: '0' as const,
  inputPosition: 'top' as const,
  lang: 'ko' as const,
} as const;

// Pagination
export const POSTS_PER_PAGE = 10;

// Date formatting options
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};
