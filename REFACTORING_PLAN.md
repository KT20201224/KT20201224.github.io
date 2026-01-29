# Astro 블로그 전체 리팩토링 계획

## 개요
- **프로젝트**: KT20201224.github.io (Jerry Blog)
- **프레임워크**: Astro 5.13.10
- **목표**: 6가지 영역 전면 개선

---

## Phase 1: 기반 구조 개선 (저위험)

### 1.1 디렉토리 구조 재편
```
src/
├── components/
│   ├── layout/      # Header, Footer, SidebarLeft
│   ├── ui/          # ThemeToggle, Search, Button
│   ├── blog/        # PostCard, TOC, TagList, SeriesNav
│   └── common/      # BaseHead, SEO, FormattedDate
├── lib/
│   ├── constants.ts # 사이트 설정, 네비게이션, 카테고리
│   ├── types.ts     # TypeScript 인터페이스
│   └── utils.ts     # 헬퍼 함수
├── styles/
│   └── global.css   # 테마 변수 포함
```

### 1.2 수정할 파일
- `src/lib/constants.ts` - 새로 생성
- `src/lib/types.ts` - 새로 생성
- `src/lib/utils.ts` - 새로 생성
- 기존 컴포넌트 폴더 재구성

---

## Phase 2: 다크모드 & 디자인 개선 (중위험)

### 2.1 CSS 테마 시스템
```css
:root { /* 라이트 모드 변수 */ }
[data-theme="dark"] { /* 다크 모드 변수 */ }
```

### 2.2 새 컴포넌트
- `src/components/ui/ThemeToggle.astro` - 다크모드 토글
- 시스템 설정 감지 + localStorage 저장

### 2.3 애니메이션 강화
- View Transitions API 적용
- Micro-interactions (hover, click)
- `prefers-reduced-motion` 지원

### 2.4 수정할 파일
- `src/styles/global.css` - 테마 변수 추가
- `src/components/layout/Header.astro` - 토글 버튼 추가
- `astro.config.mjs` - View Transitions 설정

---

## Phase 3: 콘텐츠 관리 시스템 (중위험)

### 3.1 스키마 확장
```typescript
// content.config.ts
schema: z.object({
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  series: z.string().optional(),
  seriesOrder: z.number().optional(),
  draft: z.boolean().default(false),
})
```

### 3.2 새 페이지
- `src/pages/tags/index.astro` - 태그 목록
- `src/pages/tags/[tag].astro` - 태그별 글 목록
- `src/pages/categories/[category].astro` - 카테고리별 목록

### 3.3 새 컴포넌트
- `src/components/blog/TagList.astro` - 태그 표시
- `src/components/blog/SeriesNav.astro` - 시리즈 네비게이션

### 3.4 수정할 파일
- `src/content.config.ts` - 스키마 확장
- `src/layouts/BlogPost.astro` - 태그/시리즈 표시

---

## Phase 4: 주요 기능 추가 (고위험)

### 4.1 검색 (Pagefind)
```bash
npm install astro-pagefind
```
- `src/components/ui/Search.astro` - 검색 모달 (⌘K)
- 빌드 시 자동 인덱싱

### 4.2 목차 (TOC)
- `src/components/blog/TOC.astro` - h2/h3 기반 목차
- 스크롤 시 현재 위치 하이라이트
- 사이드바 sticky 배치

### 4.3 댓글 (Giscus)
- `src/components/blog/Comments.astro`
- GitHub Discussions 기반
- 다크모드 자동 동기화
- Lazy loading

### 4.4 수정할 파일
- `astro.config.mjs` - Pagefind 통합
- `src/layouts/BlogPost.astro` - TOC, Comments 추가
- `src/components/layout/Header.astro` - Search 버튼

---

## Phase 5: SEO & 성능 최적화 (저위험)

### 5.1 구조화 데이터
- `src/components/common/SEO.astro` - JSON-LD 생성
  - WebSite Schema
  - BlogPosting Schema
  - BreadcrumbList Schema

### 5.2 이미지 최적화
- Astro Image 컴포넌트 일관 사용
- WebP 포맷, lazy loading
- 적절한 width/height 지정

### 5.3 빌드 최적화
```bash
npm install astro-compress
```
- HTML/CSS/JS 압축
- CSS 코드 스플리팅

### 5.4 수정할 파일
- `src/components/common/BaseHead.astro` → SEO 컴포넌트 통합
- `src/layouts/BlogPost.astro` - Image 최적화
- `src/pages/rss.xml.js` - RSS 개선
- `astro.config.mjs` - compress 통합

---

## 의존성 그래프

```
Phase 1 ─────┬──────> Phase 2
             │
             └──────> Phase 3
                         │
                         v
                      Phase 4
                         │
                         v
                      Phase 5
```

---

## 설치할 패키지

```bash
npm install astro-pagefind astro-compress
```

---

## 검증 방법

### 각 Phase 완료 시
1. `npm run dev` - 개발 서버 정상 작동
2. `npm run build` - 빌드 성공
3. `npm run preview` - 프로덕션 빌드 확인

### 최종 검증
- [ ] 모든 기존 페이지 정상 렌더링
- [ ] 다크모드 토글 작동
- [ ] 검색 기능 작동 (⌘K)
- [ ] 태그/카테고리 페이지 작동
- [ ] TOC 스크롤 하이라이트
- [ ] 댓글 로드 및 다크모드 동기화
- [ ] Lighthouse: Performance > 90, SEO > 95
- [ ] 모바일 반응형 정상

---

## 핵심 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `src/content.config.ts` | 스키마 확장 (tags, category, series) |
| `src/styles/global.css` | 다크모드 CSS 변수 |
| `src/layouts/BlogPost.astro` | TOC, 시리즈, 댓글 통합 |
| `src/components/common/BaseHead.astro` | SEO 컴포넌트 통합 |
| `astro.config.mjs` | Pagefind, compress 통합 |

---

## 예상 소요 시간

| Phase | 복잡도 | 예상 시간 |
|-------|--------|----------|
| 1. 기반 구조 | 낮음 | - |
| 2. 다크모드 | 중간 | - |
| 3. 콘텐츠 관리 | 중간 | - |
| 4. 기능 추가 | 높음 | - |
| 5. SEO/성능 | 낮음 | - |

---

## 시작 준비

1. 현재 상태 커밋 (백업)
2. Phase 1부터 순차 진행
3. 각 Phase 완료 시 커밋
