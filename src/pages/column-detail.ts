import { siteHead, siteHeader, siteFooter, categoryLabel, formatDate, escapeHtml } from './layout'

interface Article {
  id: number; slug: string; title: string; excerpt: string;
  content: string; category: string; thumbnail_url: string;
  author: string; published_at: string; created_at: string; updated_at: string;
}

interface RelatedArticle {
  slug: string; title: string; category: string; published_at: string;
}

export function columnDetailPage(article: Article, relatedArticles: RelatedArticle[]): string {
  const title = `${article.title} | SVA コラム`
  const description = article.excerpt || article.title

  // Structured data: Article + BreadcrumbList
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt,
        "author": { "@type": "Organization", "name": article.author || "SVA編集部", "url": "https://sva-assist.com" },
        "publisher": {
          "@type": "Organization",
          "name": "株式会社TCIサービス",
          "logo": { "@type": "ImageObject", "url": "https://sva-assist.com/static/images/sva-logo.png" }
        },
        "datePublished": article.published_at,
        "dateModified": article.updated_at || article.published_at,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://sva-assist.com/column/${article.slug}`,
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["article h1", ".article-content h2", ".article-content p:first-of-type"]
          }
        },
        "isPartOf": { "@id": "https://sva-assist.com/#website" },
        ...(article.thumbnail_url ? { "image": { "@type": "ImageObject", "url": article.thumbnail_url } } : {})
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://sva-assist.com/" },
          { "@type": "ListItem", "position": 2, "name": "コラム", "item": "https://sva-assist.com/column" },
          { "@type": "ListItem", "position": 3, "name": article.title, "item": `https://sva-assist.com/column/${article.slug}` }
        ]
      }
    ]
  })

  const head = siteHead(title, description, `/column/${article.slug}`, `
  <meta property="og:type" content="article">
  <meta property="article:published_time" content="${article.published_at}">
  <meta property="article:modified_time" content="${article.updated_at || article.published_at}">
  <meta property="article:section" content="${categoryLabel(article.category)}">
  <meta property="article:author" content="${article.author || 'SVA編集部'}">
  <script type="application/ld+json">${structuredData}</script>`)
  const header = siteHeader()

  // Related articles sidebar
  let relatedHtml = ''
  if (relatedArticles.length > 0) {
    relatedHtml = '<div class="space-y-3">'
    for (const r of relatedArticles) {
      relatedHtml += `
        <a href="/column/${escapeHtml(r.slug)}" class="block p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
          <p class="text-xs text-gray-400 mb-1">${categoryLabel(r.category)} ・ ${formatDate(r.published_at)}</p>
          <p class="text-sm font-medium text-sva-dark leading-snug line-clamp-2">${escapeHtml(r.title)}</p>
        </a>`
    }
    relatedHtml += '</div>'
  }

  return `${head}
${header}
  <main>
    <!-- Breadcrumb -->
    <section class="bg-sva-light border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <nav class="text-xs text-gray-400">
          <a href="/" class="hover:text-sva-red transition-colors">ホーム</a>
          <span class="mx-2">/</span>
          <a href="/column" class="hover:text-sva-red transition-colors">コラム</a>
          <span class="mx-2">/</span>
          <span class="text-gray-600 line-clamp-1">${escapeHtml(article.title)}</span>
        </nav>
      </div>
    </section>

    <!-- Article -->
    <section class="py-8 sm:py-12 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid lg:grid-cols-3 gap-10">
          <!-- Main Content -->
          <article class="lg:col-span-2">
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-3">
                <span class="px-2.5 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">${categoryLabel(article.category)}</span>
                <span class="text-xs text-gray-400">${formatDate(article.published_at)}</span>
              </div>
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-sva-dark leading-tight">${escapeHtml(article.title)}</h1>
              ${article.excerpt ? `<p class="text-sm text-gray-500 mt-4 leading-relaxed border-l-2 border-sva-red pl-4">${escapeHtml(article.excerpt)}</p>` : ''}
            </div>

            ${article.thumbnail_url ? `
            <div class="mb-8 rounded-xl overflow-hidden">
              <img src="${escapeHtml(article.thumbnail_url)}" alt="${escapeHtml(article.title)}" class="w-full h-auto">
            </div>` : ''}

            <div class="article-content text-sm leading-relaxed">
              ${article.content}
            </div>

            <!-- Author / Share -->
            <div class="mt-12 pt-8 border-t border-gray-100">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-sva-light rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-sva-dark">${escapeHtml(article.author)}</p>
                  <p class="text-xs text-gray-400">SVA - Special Vehicle Assist</p>
                </div>
              </div>
            </div>

            <!-- CTA -->
            <div class="mt-10 bg-sva-light rounded-xl p-6 sm:p-8 border border-gray-100">
              <h3 class="text-base font-bold text-sva-dark mb-2">装置取付のご相談はSVAへ</h3>
              <p class="text-sm text-gray-500 leading-relaxed mb-4">フォークリフト・重機・トラック・バスなど特殊車両への装置取付を全国出張で対応します。まずはお気軽にお問い合わせください。</p>
              <a href="/#contact" class="inline-flex items-center justify-center px-6 py-2.5 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">お問い合わせ</a>
            </div>
          </article>

          <!-- Sidebar -->
          <aside class="lg:col-span-1">
            <div class="sticky top-24 space-y-8">
              <!-- Related Articles -->
              ${relatedArticles.length > 0 ? `
              <div>
                <h2 class="text-sm font-bold text-sva-dark mb-4 pb-2 border-b border-gray-100">関連記事</h2>
                ${relatedHtml}
              </div>` : ''}

              <!-- Category Links -->
              <div>
                <h2 class="text-sm font-bold text-sva-dark mb-4 pb-2 border-b border-gray-100">カテゴリ</h2>
                <div class="space-y-1">
                  <a href="/column" class="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">すべての記事</a>
                  <a href="/column?category=safety" class="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">安全対策</a>
                  <a href="/column?category=technology" class="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">テクノロジー</a>
                  <a href="/column?category=regulation" class="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">法規制</a>
                  <a href="/column?category=installation" class="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">取付ガイド</a>
                  <a href="/column?category=case-study" class="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">導入事例</a>
                </div>
              </div>

              <!-- Contact CTA -->
              <div class="bg-sva-dark rounded-xl p-5 text-center">
                <p class="text-white text-sm font-medium mb-2">装置取付のご相談</p>
                <p class="text-gray-400 text-xs mb-4">全国出張対応・特殊車両専門</p>
                <a href="/#contact" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">お問い合わせ</a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </main>
${siteFooter()}`
}
