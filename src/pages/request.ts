import { siteHead, siteHeader, siteFooter, escapeHtml } from './layout'

// ==========================================
// 取付依頼専用ページ（メーカー・商社向け）
// ==========================================
export function requestPage(): string {
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://sva-assist.com/request#webpage",
        "name": "取付依頼 | SVA - Special Vehicle Assist",
        "description": "メーカー・商社様向けの装置取付依頼ページ。フォークリフト・重機・建機・トラック・バス・船舶への安全装置・ドライブレコーダー取付を全国47都道府県で対応。",
        "url": "https://sva-assist.com/request",
        "isPartOf": { "@id": "https://sva-assist.com/#website" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://sva-assist.com/" },
          { "@type": "ListItem", "position": 2, "name": "取付依頼", "item": "https://sva-assist.com/request" }
        ]
      }
    ]
  })

  return siteHead(
    '取付依頼 | SVA - Special Vehicle Assist',
    'メーカー・商社様向けの装置取付依頼ページ。フォークリフト・重機・建機・トラック・バス・船舶への安全装置・ドライブレコーダー取付を全国47都道府県で対応。',
    '/request',
    `<script type="application/ld+json">${structuredData}</script>`
  ) + siteHeader() + `
  <main>
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <nav class="flex items-center gap-2 text-xs text-gray-500">
          <a href="/" class="hover:text-sva-red transition-colors">ホーム</a>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span class="text-gray-800 font-medium">取付依頼</span>
        </nav>
      </div>
    </div>

    <!-- Hero -->
    <section class="bg-gradient-to-br from-sva-dark via-[#16213e] to-[#0f3460] py-16 sm:py-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <p class="text-sva-red font-medium text-sm tracking-widest mb-4">INSTALLATION REQUEST</p>
        <h1 class="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">取付依頼</h1>
        <p class="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
          メーカー・商社様向けの装置取付依頼ページです。<br class="hidden sm:block">
          全国47都道府県のSVA公認パートナーが、特殊車両への安全装置取付を承ります。
        </p>
      </div>
    </section>

    <!-- Content placeholder -->
    <section class="py-16 sm:py-20 bg-sva-light">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <div class="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center">
          <div class="w-16 h-16 bg-sva-red/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-sva-red" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17l-5.384 3.08A2.065 2.065 0 013 16.367V7.633a2.065 2.065 0 013.036-1.884l5.384 3.08a2.065 2.065 0 010 3.768zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-sva-dark mb-3">取付依頼フォーム準備中</h2>
          <p class="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto mb-8">
            現在、メーカー・商社様向けの取付依頼フォームを準備しております。<br>
            お急ぎの場合は、お電話またはお問い合わせフォームよりご連絡ください。
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/#contact" class="inline-flex items-center justify-center px-8 py-3.5 bg-sva-red text-white font-medium rounded-lg hover:bg-red-800 transition-colors text-sm">
              お問い合わせフォーム
            </a>
            <a href="tel:06-6152-7511" class="inline-flex items-center justify-center px-8 py-3.5 border border-gray-200 text-sva-dark font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm">
              電話: 06-6152-7511
            </a>
          </div>
          <p class="text-xs text-gray-400 mt-4">受付時間 9:00〜18:00（土日祝を除く）</p>
        </div>
      </div>
    </section>
  </main>
  ` + siteFooter()
}
