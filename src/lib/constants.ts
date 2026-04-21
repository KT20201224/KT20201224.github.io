// Site Configuration
export const SITE_TITLE = 'Jerry Blog';
export const SITE_DESCRIPTION = 'Welcome to my website!';
export const SITE_URL = 'https://KT20201224.github.io';
export const SITE_AUTHOR = 'Kyoungtea Kim';
export const SITE_LOCALE = 'ko-KR';

// Navigation Links
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Posts' },
  { href: '/graph', label: 'Graph' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
] as const;

// Categories
export const CATEGORIES = [
  { slug: 'ai-ml', label: 'AI/ML', description: 'AI, ML, LLM 관련 글' },
  { slug: 'dev', label: 'DEV', description: 'DevOps, Web, 개발 전반' },
  { slug: 'news', label: 'NEWS', description: '업계 소식과 최신 릴리즈' },
  { slug: 'til', label: 'TIL', description: 'Today I Learned' },
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
  repoId: 'R_kgDOP2CdUg',
  category: 'Announcements',
  categoryId: 'DIC_kwDOP2CdUs4C1rzo',
  mapping: 'pathname' as const,
  strict: '0' as const,
  reactionsEnabled: '1' as const,
  emitMetadata: '0' as const,
  inputPosition: 'bottom' as const,
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
