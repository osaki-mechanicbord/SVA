import { siteHead, siteHeader, siteFooter, categoryLabel, formatDate, escapeHtml, CATEGORY_MAP } from './layout'

interface Article {
  id: number; slug: string; title: string; excerpt: string;
  category: string; thumbnail_url: string; author: string;
  published_at: string; created_at: string;
}

interface Pagination {
  page: number; limit: number; total: number; totalPages: number;
}

export function columnListPage(articles: Article[], pagination: Pagination, currentCategory: string): string {
  const title = currentCategory
    ? `${categoryLabel(currentCategory)}のコラム | SVA - Special Vehicle Assist`
    : 'コラム | SVA - Special Vehicle Assist'
  const description = '特殊車両の安全装置・ドライブレコーダー・AIカメラに関する最新情報、法規制、導入事例、技術解説をお届けします。'

  // BreadcrumbList structured data
  const breadcrumb = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://sva-assist.com/" },
      { "@type": "ListItem", "position": 2, "name": "コラム", "item": "https://sva-assist.com/column" }
    ]
  })

  const head = siteHead(title, description, '/column', `<script type="application/ld+json">${breadcrumb}</script>`)
  const header = siteHeader()

  // Category tabs
  const categories = Object.entries(CATEGORY_MAP)
  const allActive = !currentCategory ? 'bg-sva-red text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
  let categoryTabs = `<a href="/column" class="px-4 py-2 text-sm font-medium rounded-lg transition-colors ${allActive}">すべて</a>`
  for (const [key, label] of categories) {
    const active = currentCategory === key ? 'bg-sva-red text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
    categoryTabs += `<a href="/column?category=${key}" class="px-4 py-2 text-sm font-medium rounded-lg transition-colors ${active}">${label}</a>`
  }

  // Article cards (3-column grid)
  let articleCards = ''
  if (articles.length === 0) {
    articleCards = '<div class="col-span-full text-center py-20"><p class="text-gray-400 text-sm">記事がまだありません</p></div>'
  } else {
    for (const a of articles) {
      const catColor = getCategoryColor(a.category)
      articleCards += `
        <a href="/column/${escapeHtml(a.slug)}" class="bg-white rounded-xl border border-gray-100 overflow-hidden card-hover block">
          <div class="aspect-[16/9] bg-gray-100 relative overflow-hidden">
            ${a.thumbnail_url
              ? `<img src="${escapeHtml(a.thumbnail_url)}" alt="${escapeHtml(a.title)}" class="w-full h-full object-cover">`
              : `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                   <svg class="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                 </div>`
            }
            <span class="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded ${catColor}">${categoryLabel(a.category)}</span>
          </div>
          <div class="p-5">
            <h3 class="text-sm font-bold text-sva-dark leading-snug line-clamp-2 mb-2">${escapeHtml(a.title)}</h3>
            <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">${escapeHtml(a.excerpt)}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-400">${formatDate(a.published_at)}</span>
              <span class="text-xs text-gray-400">${escapeHtml(a.author)}</span>
            </div>
          </div>
        </a>`
    }
  }

  // Pagination
  let paginationHtml = ''
  if (pagination.totalPages > 1) {
    const categoryParam = currentCategory ? `&category=${currentCategory}` : ''
    paginationHtml = '<div class="flex justify-center gap-2 mt-10">'
    if (pagination.page > 1) {
      paginationHtml += `<a href="/column?page=${pagination.page - 1}${categoryParam}" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">前のページ</a>`
    }
    for (let i = 1; i <= pagination.totalPages; i++) {
      const active = i === pagination.page ? 'bg-sva-red text-white border-sva-red' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
      paginationHtml += `<a href="/column?page=${i}${categoryParam}" class="px-3.5 py-2 text-sm border rounded-lg transition-colors ${active}">${i}</a>`
    }
    if (pagination.page < pagination.totalPages) {
      paginationHtml += `<a href="/column?page=${pagination.page + 1}${categoryParam}" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">次のページ</a>`
    }
    paginationHtml += '</div>'
  }

  return `${head}
${header}
  <main>
    <!-- Page Header -->
    <section class="bg-sva-light border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <nav class="text-xs text-gray-400 mb-4">
          <a href="/" class="hover:text-sva-red transition-colors">ホーム</a>
          <span class="mx-2">/</span>
          <span class="text-gray-600">コラム</span>
        </nav>
        <h1 class="text-2xl sm:text-3xl font-bold text-sva-dark">コラム</h1>
        <p class="text-sm text-gray-500 mt-2">特殊車両の安全装置に関する最新情報をお届けします</p>
      </div>
    </section>

    <!-- Category Filter -->
    <section class="bg-white border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div class="flex flex-wrap gap-2">
          ${categoryTabs}
        </div>
      </div>
    </section>

    <!-- Articles Grid -->
    <section class="py-10 sm:py-14 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${articleCards}
        </div>
        ${paginationHtml}
      </div>
    </section>
  </main>
${siteFooter()}`
}

function getCategoryColor(cat: string): string {
  const colors: Record<string, string> = {
    'safety': 'bg-red-50 text-red-700',
    'technology': 'bg-blue-50 text-blue-700',
    'regulation': 'bg-amber-50 text-amber-700',
    'installation': 'bg-green-50 text-green-700',
    'case-study': 'bg-purple-50 text-purple-700',
    'general': 'bg-gray-100 text-gray-600'
  }
  return colors[cat] || 'bg-gray-100 text-gray-600'
}
