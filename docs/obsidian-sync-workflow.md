# Obsidian → Blog Sync Workflow 가이드

ObsidianNotes 리포에서 이 블로그(`KT20201224.github.io`)로 포스트를 자동 동기화하는 워크플로우를 관리하는 문서입니다. 블로그 리포의 스키마·카테고리 구조가 바뀔 때 이 문서를 보고 워크플로우를 업데이트하세요.

---

## 1. 블로그 리포의 전제 조건

### 1.1 콘텐츠 컬렉션 구조

`src/content.config.ts`에 3개 컬렉션이 정의되어 있습니다.

| 컬렉션 | 경로 | 필수 frontmatter | 선택 frontmatter |
|---|---|---|---|
| `blog` | `src/content/blog/` | `title`, `pubDate` | `description`, `updatedDate`, `heroImage`, `tags[]`, `category`, `series`, `seriesOrder`, `draft` |
| `news` | `src/content/news/` | `title`, `pubDate` | `description` |
| `til` | `src/content/til/` | `title`, `pubDate` | `description`, `updatedDate`, `tags[]`, `category`, `draft` |

**주의**: Astro는 빌드 시 Zod 스키마로 frontmatter를 검증합니다. **필수 필드가 누락되면 블로그 빌드가 실패**하고 GitHub Pages 배포가 중단됩니다.

### 1.2 이미지 저장 위치

- 정적 자산: `public/images/blog/`
- 마크다운 내부 이미지 참조: `/images/blog/{filename}` (절대 경로)

### 1.3 유효한 카테고리 슬러그 (현행)

`src/lib/constants.ts`의 `CATEGORIES` 배열에 정의:

| slug | label | 설명 |
|---|---|---|
| `ai-ml` | AI/ML | AI, ML, LLM 관련 글 |
| `dev` | DEV | DevOps, Web, 개발 전반 |
| `news` | NEWS | 업계 소식과 최신 릴리즈 |
| `til` | TIL | Today I Learned |
| `etc` | ETC | 기타 글 |

**과거 슬러그와 매핑** (마이그레이션용):

| 과거 slug | 현재 slug |
|---|---|
| `ml` | `ai-ml` |
| `llm` | `ai-ml` |
| `devops` | `dev` |
| `web` | `dev` |

---

## 2. Obsidian 노트 작성 규칙

### 2.1 권장 frontmatter 템플릿

Obsidian 템플릿 플러그인에 아래를 등록해두고 새 노트 생성 시 자동 삽입하는 걸 권장합니다.

```yaml
---
title: "제목"
description: "한 줄 요약 (optional)"
pubDate: 2026-04-21
category: ai-ml          # ai-ml | dev | news | til | etc
tags: ["tag1", "tag2"]
draft: false             # true면 프로덕션 빌드에서 제외
---
```

### 2.2 이미지 삽입

Obsidian 위키링크 그대로 사용 가능:

```markdown
![[image.png]]              ← 단순 형식
![[image.png|대체 텍스트]]    ← 앨리어스 형식 (alt text)
```

워크플로우가 마크다운 표준 `![alt](/images/blog/image.png)` 형태로 자동 변환합니다.

### 2.3 파일명 규칙

- 공백 포함 가능 (`.md`, 이미지 파일명 모두): 워크플로우가 URL 인코딩 처리
- 한글 파일명 허용 (예: `Git을 잘 사용해보자.md`)
- 파일명이 그대로 URL slug가 됨 — 가독성 있게 영문·한글 명료하게

---

## 3. 현재 워크플로우의 문제점

ObsidianNotes 리포의 `Sync Blog Posts with Images` 워크플로우는 다음 문제를 가집니다.

### 3.1 카테고리 슬러그 미변환 (Critical)

블로그 리포에서 `ml/llm/devops/web` → `ai-ml/dev`로 통합됐지만, 워크플로우는 Obsidian 노트의 `category:` 값을 그대로 복사합니다. 옛 슬러그가 붙은 글은 사이드바·카테고리 페이지에 매칭되지 않습니다.

### 3.2 Frontmatter 검증 부재 (Critical)

필수 필드(`title`, `pubDate`)가 없는 노트가 sync되면 블로그 빌드 실패 → 배포 차단. 워크플로우에서 사전 검증이 없으면 블로그 측에서만 실패가 드러납니다.

### 3.3 위키링크 앨리어스 미처리

현재 정규식:
```regex
!\[\[\([^]]*\)\]\]
```

는 `![[image.png]]`만 매칭하고 `![[image.png|alt text]]`는 깨뜨립니다. Obsidian에서 alt 텍스트를 쓴 이미지는 끊어집니다.

### 3.4 URL 인코딩 한계

```bash
sed -i 's|(/images/blog/\([^)]*\) \([^)]*\))|(/images/blog/\1%20\2)|g'
```

는 **두 단어 파일명만** 처리. `foo bar baz.png` 같은 세 단어 이상은 부분 인코딩만 됨.

### 3.5 News/TIL 컬렉션 미동기화

현재 워크플로우는 `Blog/**/*.md`만 처리. News·TIL 콘텐츠를 Obsidian에서 관리하려면 별도 루프 필요.

### 3.6 파괴적 삭제

```bash
rm -rf blog-repo/src/content/blog/*
```

는 블로그 리포의 기존 블로그 글을 모두 지웁니다. Obsidian을 단일 소스로 운용하면 OK지만, 블로그 리포에서 직접 편집한 글이 있다면 덮어쓰여집니다.

---

## 4. 권장 수정안

### 4.1 카테고리 슬러그 자동 치환 (추가)

sed 처리 블록 맨 끝에 추가:

```bash
# Legacy category slug migration → current
sed -i 's/^category: ml$/category: ai-ml/' "blog-repo/src/content/blog/$filename"
sed -i 's/^category: llm$/category: ai-ml/' "blog-repo/src/content/blog/$filename"
sed -i 's/^category: devops$/category: dev/' "blog-repo/src/content/blog/$filename"
sed -i 's/^category: web$/category: dev/' "blog-repo/src/content/blog/$filename"

# 따옴표로 감싼 경우도 처리
sed -i "s/^category: ['\"]ml['\"]$/category: ai-ml/" "blog-repo/src/content/blog/$filename"
sed -i "s/^category: ['\"]llm['\"]$/category: ai-ml/" "blog-repo/src/content/blog/$filename"
sed -i "s/^category: ['\"]devops['\"]$/category: dev/" "blog-repo/src/content/blog/$filename"
sed -i "s/^category: ['\"]web['\"]$/category: dev/" "blog-repo/src/content/blog/$filename"
```

### 4.2 위키링크 앨리어스 우선 처리

**순서 중요**: 앨리어스 있는 패턴을 먼저 처리한 뒤 단순 패턴을 처리하세요. 반대 순서로 하면 앨리어스 매칭이 안 됩니다.

```bash
# 1) 앨리어스 있는 위키링크: ![[img.png|alt text]] → ![alt text](/images/blog/img.png)
sed -i 's|!\[\[\([^|]*\)|\([^]]*\)\]\]|![\2](/images/blog/\1)|g' "blog-repo/src/content/blog/$filename"

# 2) 앨리어스 없는 위키링크: ![[img.png]] → ![img.png](/images/blog/img.png)
sed -i 's|!\[\[\([^]]*\)\]\]|![\1](/images/blog/\1)|g' "blog-repo/src/content/blog/$filename"
```

### 4.3 파이썬 기반 URL 인코딩 (권장)

sed의 공백 치환 두 줄을 아래 파이썬 한 블록으로 교체하면 공백·한글·특수문자 모두 튼튼하게 처리됩니다.

```bash
python3 << 'PYEOF'
import os, re
from urllib.parse import quote

blog_dir = "blog-repo/src/content/blog"
for md in os.listdir(blog_dir):
    if not md.endswith(".md"):
        continue
    path = os.path.join(blog_dir, md)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    # /images/blog/ 하위 경로만 URL-encode
    content = re.sub(
        r"\(/images/blog/([^)]+)\)",
        lambda m: "(/images/blog/" + quote(m.group(1), safe="/.%-_") + ")",
        content,
    )
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
PYEOF
```

위 블록은 sed 루프 바깥, 복사가 끝난 뒤 한 번 실행하면 전체 파일을 일관되게 인코딩합니다.

### 4.4 Frontmatter 검증 단계 (배포 전 안전장치)

복사·변환 뒤 아래 블록을 추가하면 필수 필드 누락 노트를 워크플로우 단계에서 잡아냅니다.

```bash
echo "Validating frontmatter..."
failed=0
for f in blog-repo/src/content/blog/*.md; do
  if ! grep -q "^title:" "$f"; then
    echo "::error file=$f::Missing 'title' in frontmatter"
    failed=1
  fi
  if ! grep -q "^pubDate:" "$f"; then
    echo "::error file=$f::Missing 'pubDate' in frontmatter"
    failed=1
  fi
done
if [ "$failed" -eq 1 ]; then
  echo "Frontmatter validation failed. Fix the above files in ObsidianNotes."
  exit 1
fi
echo "Frontmatter validation passed."
```

### 4.5 News/TIL 분리 동기화 (Obsidian에서 관리할 경우)

Obsidian에 `News/`, `TIL/` 폴더를 만들고 각각 복사하는 루프 추가:

```yaml
on:
  push:
    paths:
      - "Blog/**/*.md"
      - "News/**/*.md"
      - "TIL/**/*.md"
      - "attachments/**/*"
    branches: [main]
```

그리고 sync 단계에서:

```bash
# News
rm -rf blog-repo/src/content/news/*
mkdir -p blog-repo/src/content/news
if [ -d "News" ]; then
  find News -name "*.md" -exec cp {} blog-repo/src/content/news/ \;
fi

# TIL
rm -rf blog-repo/src/content/til/*
mkdir -p blog-repo/src/content/til
if [ -d "TIL" ]; then
  find TIL -name "*.md" -exec cp {} blog-repo/src/content/til/ \;
fi
```

### 4.6 draft 플래그 일괄 처리 (선택)

Obsidian에서 `#draft` 태그를 단 노트를 자동으로 `draft: true`로 만들고 싶다면:

```bash
# #draft 태그가 본문에 있으면 frontmatter에 draft: true 추가
for f in blog-repo/src/content/blog/*.md; do
  if grep -q "#draft" "$f" && ! grep -q "^draft:" "$f"; then
    # frontmatter 끝의 '---' 바로 앞에 draft: true 삽입
    sed -i '0,/^---$/!{0,/^---$/s/^---$/draft: true\n---/}' "$f"
  fi
done
```

---

## 5. 완성본: 개선된 워크플로우

아래는 위 개선을 반영한 전체 YAML. ObsidianNotes 리포의 `.github/workflows/sync-blog.yml`을 이걸로 교체하면 됩니다.

```yaml
name: Sync Blog Posts with Images

on:
  push:
    paths:
      - "Blog/**/*.md"
      - "News/**/*.md"
      - "TIL/**/*.md"
      - "attachments/**/*"
    branches: [main]

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout ObsidianNotes
        uses: actions/checkout@v4

      - name: Checkout blog repository
        uses: actions/checkout@v4
        with:
          repository: KT20201224/KT20201224.github.io
          token: ${{ secrets.BLOG_TOKEN }}
          path: blog-repo

      - name: Prepare directories
        run: |
          rm -rf blog-repo/src/content/blog/*
          rm -rf blog-repo/src/content/news/*
          rm -rf blog-repo/src/content/til/*
          rm -rf blog-repo/public/images/blog/*
          mkdir -p blog-repo/src/content/blog
          mkdir -p blog-repo/src/content/news
          mkdir -p blog-repo/src/content/til
          mkdir -p blog-repo/public/images/blog

      - name: Copy images
        run: |
          if [ -d "attachments" ]; then
            echo "Copying images from attachments..."
            find attachments -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.webp" -o -name "*.svg" \) -exec cp {} blog-repo/public/images/blog/ \;
          fi

      - name: Copy and transform Blog posts
        run: |
          find Blog -name "*.md" | while read file; do
            filename=$(basename "$file")
            cp "$file" "blog-repo/src/content/blog/$filename"

            # Wikilinks: aliased form first
            sed -i 's|!\[\[\([^|]*\)|\([^]]*\)\]\]|![\2](/images/blog/\1)|g' "blog-repo/src/content/blog/$filename"
            # Wikilinks: simple form
            sed -i 's|!\[\[\([^]]*\)\]\]|![\1](/images/blog/\1)|g' "blog-repo/src/content/blog/$filename"

            # Obsidian attachment paths
            sed -i 's|!\[\([^]]*\)\](attachments/\([^)]*\))|![\1](/images/blog/\2)|g' "blog-repo/src/content/blog/$filename"
            sed -i 's|!\[\([^]]*\)\](\.\./attachments/\([^)]*\))|![\1](/images/blog/\2)|g' "blog-repo/src/content/blog/$filename"

            # Legacy category slug migration
            sed -i 's/^category: ml$/category: ai-ml/' "blog-repo/src/content/blog/$filename"
            sed -i 's/^category: llm$/category: ai-ml/' "blog-repo/src/content/blog/$filename"
            sed -i 's/^category: devops$/category: dev/' "blog-repo/src/content/blog/$filename"
            sed -i 's/^category: web$/category: dev/' "blog-repo/src/content/blog/$filename"
            sed -i "s/^category: ['\"]ml['\"]$/category: ai-ml/" "blog-repo/src/content/blog/$filename"
            sed -i "s/^category: ['\"]llm['\"]$/category: ai-ml/" "blog-repo/src/content/blog/$filename"
            sed -i "s/^category: ['\"]devops['\"]$/category: dev/" "blog-repo/src/content/blog/$filename"
            sed -i "s/^category: ['\"]web['\"]$/category: dev/" "blog-repo/src/content/blog/$filename"
          done

      - name: Copy News posts
        run: |
          if [ -d "News" ]; then
            find News -name "*.md" -exec cp {} blog-repo/src/content/news/ \;
          fi

      - name: Copy TIL posts
        run: |
          if [ -d "TIL" ]; then
            find TIL -name "*.md" | while read file; do
              filename=$(basename "$file")
              cp "$file" "blog-repo/src/content/til/$filename"
              # 위키링크 처리는 Blog와 동일하게 TIL에도 적용
              sed -i 's|!\[\[\([^|]*\)|\([^]]*\)\]\]|![\2](/images/blog/\1)|g' "blog-repo/src/content/til/$filename"
              sed -i 's|!\[\[\([^]]*\)\]\]|![\1](/images/blog/\1)|g' "blog-repo/src/content/til/$filename"
            done
          fi

      - name: URL-encode image paths (Python)
        run: |
          python3 << 'PYEOF'
          import os, re
          from urllib.parse import quote

          for subdir in ["blog", "news", "til"]:
              d = f"blog-repo/src/content/{subdir}"
              if not os.path.isdir(d):
                  continue
              for md in os.listdir(d):
                  if not md.endswith(".md"):
                      continue
                  path = os.path.join(d, md)
                  with open(path, "r", encoding="utf-8") as f:
                      content = f.read()
                  content = re.sub(
                      r"\(/images/blog/([^)]+)\)",
                      lambda m: "(/images/blog/" + quote(m.group(1), safe="/.%-_") + ")",
                      content,
                  )
                  with open(path, "w", encoding="utf-8") as f:
                      f.write(content)
          PYEOF

      - name: Validate frontmatter
        run: |
          failed=0
          for subdir in blog news til; do
            for f in blog-repo/src/content/$subdir/*.md; do
              [ -e "$f" ] || continue
              if ! grep -q "^title:" "$f"; then
                echo "::error file=$f::Missing 'title' in frontmatter"
                failed=1
              fi
              if ! grep -q "^pubDate:" "$f"; then
                echo "::error file=$f::Missing 'pubDate' in frontmatter"
                failed=1
              fi
            done
          done
          if [ "$failed" -eq 1 ]; then
            echo "Frontmatter validation failed."
            exit 1
          fi

      - name: Commit and push
        run: |
          cd blog-repo
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add .
          git diff --cached --quiet && { echo "No changes to commit."; exit 0; }
          git commit -m "sync: Obsidian → blog ($(date -u +%Y-%m-%dT%H:%M:%SZ))"
          git push
```

---

## 6. 검증 체크리스트

워크플로우 수정 후 점검해야 할 것:

- [ ] Obsidian 노트 한 개 수정 후 `main`에 푸쉬 → Actions 탭에서 sync 워크플로우 성공 확인
- [ ] 블로그 리포의 sync 커밋이 올라온 것 확인
- [ ] 블로그 리포의 `deploy.yml`이 자동 트리거되어 빌드 성공
- [ ] 배포된 사이트에서 수정한 글의 텍스트·이미지·카테고리 배지 모두 정상
- [ ] 카테고리 페이지(`/categories/ai-ml`, `/categories/dev`, ...) 접근 시 해당 글이 목록에 나타남
- [ ] `draft: true` 붙인 글은 프로덕션에서 보이지 않음
- [ ] 수식·mermaid·코드 블럭이 렌더링됨 (블로그 측 설정 완료된 상태)

---

## 7. 향후 변경 시 업데이트 포인트

**블로그 리포의 다음 항목이 바뀌면 이 문서와 워크플로우를 함께 업데이트**하세요:

1. `src/lib/constants.ts`의 `CATEGORIES` 배열 (slug 추가·제거·변경)
2. `src/content.config.ts`의 스키마 (필수 필드 추가·제거)
3. `src/content/` 하위 컬렉션 이름·경로 변경
4. `public/images/` 하위 이미지 저장 경로 변경

변경 시 이 문서의 1.1 / 1.3 / 4.1 / 5 섹션을 같이 수정하면 ObsidianNotes 워크플로우도 빠르게 맞출 수 있습니다.
