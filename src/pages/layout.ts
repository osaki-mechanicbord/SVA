// Shared HTML layout helper for public pages
export function siteHead(title: string, description: string, path: string, extra?: string): string {
  return `<!DOCTYPE html>
<html lang="ja" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" href="/static/images/sva-logo.png">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://sva-assist.com${path}">
  <link rel="alternate" hreflang="ja" href="https://sva-assist.com${path}">
  <link rel="alternate" hreflang="x-default" href="https://sva-assist.com${path}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="https://sva-assist.com${path}">
  <meta property="og:site_name" content="SVA - Special Vehicle Assist">
  <meta property="og:image" content="https://sva-assist.com/static/images/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="SVA - Special Vehicle Assist | 特殊車両専門の装置取付プラットフォーム">
  <meta property="og:locale" content="ja_JP">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="https://sva-assist.com/static/images/og-image.png">
  <meta name="twitter:image:alt" content="${title}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="format-detection" content="telephone=no">
  <meta name="theme-color" content="#C41E3A">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap" as="style">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            sva: { red: '#C41E3A', dark: '#1a1a2e', gray: '#333333', light: '#f8f9fa', accent: '#1A5276' }
          },
          fontFamily: { sans: ['"Noto Sans JP"', 'sans-serif'] }
        }
      }
    }
  </script>
  <style>
    * { font-family: 'Noto Sans JP', sans-serif; }
    html { scroll-behavior: smooth; }
    .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .article-content h2 { font-size: 1.25rem; font-weight: 700; margin: 2rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #C41E3A; color: #1a1a2e; }
    .article-content h3 { font-size: 1.1rem; font-weight: 600; margin: 1.5rem 0 0.75rem; color: #1a1a2e; }
    .article-content p { margin: 1rem 0; line-height: 1.9; color: #555; }
    .article-content ul, .article-content ol { margin: 1rem 0; padding-left: 1.5rem; }
    .article-content li { margin: 0.4rem 0; line-height: 1.8; color: #555; }
    .article-content ul li { list-style-type: disc; }
    .article-content ol li { list-style-type: decimal; }
  </style>
  ${extra || ''}
</head>`
}

export function siteHeader(): string {
  return `
<body class="bg-white text-sva-gray antialiased">
  <header class="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-16 sm:h-20">
        <a href="/" class="flex items-center gap-3">
          <img src="/static/images/sva-logo.png" alt="SVA" class="h-9 sm:h-11 w-auto object-contain">
        </a>
        <nav class="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="/#service" class="text-gray-600 hover:text-sva-red transition-colors">サービス</a>
          <a href="/column" class="text-gray-600 hover:text-sva-red transition-colors">コラム</a>
          <a href="/#partner" class="text-gray-600 hover:text-sva-red transition-colors">パートナー募集</a>
          <a href="/#faq" class="text-gray-600 hover:text-sva-red transition-colors">FAQ</a>
        </nav>
        <div id="partnerBtnWrap">
          <a href="/partner/login" id="partnerLoginBtn" class="hidden sm:inline-flex items-center justify-center px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            ログイン
          </a>
          <a href="/partner/mypage" id="partnerMypageBtn" style="display:none" class="items-center justify-center px-4 py-2 border border-sva-red/20 text-sva-red text-sm font-medium rounded-lg hover:bg-red-50 transition-colors gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            マイページ
          </a>
        </div>
        <a href="/#contact" class="hidden sm:inline-flex items-center justify-center px-5 py-2.5 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">
          お問い合わせ
        </a>
      </div>
    </div>
  </header>
  <script>
  (function(){
    var token=localStorage.getItem('sva_partner_token');
    var lb=document.getElementById('partnerLoginBtn');
    var mb=document.getElementById('partnerMypageBtn');
    if(token){
      fetch('/api/partner/me',{headers:{'Authorization':'Bearer '+token}})
        .then(function(r){if(r.ok){if(lb)lb.style.display='none';if(mb)mb.style.display='inline-flex';}else{localStorage.removeItem('sva_partner_token');localStorage.removeItem('sva_partner');if(lb)lb.style.display='';}})
        .catch(function(){});
    } else { if(lb)lb.style.display=''; }
  })();
  </script>`
}

export function siteFooter(): string {
  return `
  <footer class="bg-sva-dark text-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div class="grid md:grid-cols-3 gap-10">
        <div>
          <div class="bg-white rounded-lg px-3 py-2 inline-block mb-4">
            <img src="/static/images/sva-logo.png" alt="SVA" class="h-8 w-auto object-contain">
          </div>
          <p class="text-gray-400 text-xs leading-relaxed">特殊車両専門の装置取付プラットフォーム。<br>全国の公認パートナーネットワークで、<br>どこでも出張施工に対応します。</p>
        </div>
        <div>
          <p class="text-sm font-medium mb-4">サービス</p>
          <ul class="space-y-2 text-xs text-gray-400">
            <li><a href="/#service" class="hover:text-white transition-colors">SVAが選ばれる理由</a></li>
            <li><a href="/column" class="hover:text-white transition-colors">コラム</a></li>
            <li><a href="/#partner" class="hover:text-white transition-colors">公認パートナー募集</a></li>
            <li><a href="/#faq" class="hover:text-white transition-colors">よくあるご質問</a></li>
            <li><a href="https://www.torasapo-kun.com/" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">トラサポくん</a></li>
          </ul>
        </div>
        <div>
          <p class="text-sm font-medium mb-4">運営会社</p>
          <div class="mb-4">
            <div class="bg-white rounded px-2 py-1.5 inline-block mb-3">
              <img src="/static/images/tci-logo.png" alt="株式会社TCIサービス" class="h-6 w-auto object-contain">
            </div>
          </div>
          <dl class="text-xs text-gray-400 space-y-1.5">
            <div class="flex"><dt class="w-16 shrink-0">社名</dt><dd>株式会社TCIサービス</dd></div>
            <div class="flex"><dt class="w-16 shrink-0">所在地</dt><dd>大阪府大阪市淀川区新高1丁目5-4 3階</dd></div>
            <div class="flex"><dt class="w-16 shrink-0">代表</dt><dd>代表取締役 謝花 祐治</dd></div>
            <div class="flex"><dt class="w-16 shrink-0">電話</dt><dd><a href="tel:06-6152-7511" class="hover:text-white transition-colors">06-6152-7511</a></dd></div>
          </dl>
        </div>
      </div>
      <div class="border-t border-white/10 mt-10 pt-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <p class="text-xs text-gray-500">&copy; 2025 株式会社TCIサービス All rights reserved.</p>
          <div class="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-gray-500">
            <a href="/privacy" class="hover:text-white transition-colors">プライバシーポリシー</a>
            <a href="/terms" class="hover:text-white transition-colors">利用規約</a>
            <a href="/tokushoho" class="hover:text-white transition-colors">特定商取引法</a>
            <a href="/sitemap" class="inline-flex items-center gap-1 hover:text-white transition-colors">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
              サイトマップ
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</body>
</html>`
}

// Category map
export const CATEGORY_MAP: Record<string, string> = {
  'safety': '安全対策',
  'technology': 'テクノロジー',
  'regulation': '法規制',
  'installation': '取付ガイド',
  'case-study': '導入事例',
  'general': 'その他'
}

export function categoryLabel(cat: string): string {
  return CATEGORY_MAP[cat] || cat
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`
}

export function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
