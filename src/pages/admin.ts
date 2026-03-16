export function adminPage(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <title>SVA CMS 管理画面</title>
  <meta name="robots" content="noindex, nofollow">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: { sva: { red: '#C41E3A', dark: '#1a1a2e', gray: '#333333' } },
          fontFamily: { sans: ['"Noto Sans JP"', 'sans-serif'] }
        }
      }
    }
  </script>
  <style>
    * { font-family: 'Noto Sans JP', sans-serif; }
    .drop-active { border-color: #C41E3A !important; background-color: rgba(196, 30, 58, 0.04) !important; }

    /* Desktop tab navigation - horizontal row */
    .tab-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; scrollbar-width: none; }
    .tab-scroll::-webkit-scrollbar { display: none; }
    .tab-scroll-wrap { position: relative; }
    .tab-scroll-wrap::after { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 32px; background: linear-gradient(to right, transparent, white); pointer-events: none; z-index: 1; }
    .tab-scroll-wrap.scrolled-end::after { display: none; }
    .tab-scroll-wrap::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 32px; background: linear-gradient(to left, transparent, white); pointer-events: none; z-index: 1; display: none; }
    .tab-scroll-wrap.scrolled-start::before { display: none; }
    .tab-scroll-wrap.scrolled-mid::before { display: block; }

    /* Desktop: hide icons in tabs, show text only */
    @media (min-width: 768px) {
      .cms-tab svg.tab-icon { display: none; }
      .mobile-bottom-nav { display: none !important; }
    }
    /* Desktop: show horizontal tab bar */
    @media (max-width: 767px) {
      .desktop-tab-bar { display: none !important; }
    }

    /* Mobile bottom navigation bar */
    .mobile-bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: white;
      border-top: 1px solid #e5e7eb;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.06);
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }
    .mobile-bottom-nav .nav-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
    }
    .mobile-bottom-nav .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6px 2px 4px;
      font-size: 10px;
      font-weight: 500;
      color: #9ca3af;
      transition: color 0.15s;
      position: relative;
      -webkit-tap-highlight-color: transparent;
    }
    .mobile-bottom-nav .nav-item.active { color: #C41E3A; }
    .mobile-bottom-nav .nav-item svg { width: 22px; height: 22px; margin-bottom: 2px; }
    .mobile-bottom-nav .nav-item .nav-badge {
      position: absolute; top: 2px; right: calc(50% - 16px);
      min-width: 16px; height: 16px; padding: 0 4px;
      background: #ef4444; color: white; font-size: 9px; font-weight: 700;
      border-radius: 8px; display: flex; align-items: center; justify-content: center;
    }

    /* Mobile more-menu overlay */
    .mobile-more-menu {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 110;
      background: white; border-top-left-radius: 16px; border-top-right-radius: 16px;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.12);
      transform: translateY(100%); transition: transform 0.25s ease;
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }
    .mobile-more-menu.open { transform: translateY(0); }
    .mobile-more-menu .more-grid {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 4px; padding: 16px 12px;
    }
    .mobile-more-menu .more-item {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 12px 4px; border-radius: 12px; font-size: 11px; font-weight: 500;
      color: #6b7280; transition: background 0.15s;
      -webkit-tap-highlight-color: transparent;
    }
    .mobile-more-menu .more-item:active { background: #f3f4f6; }
    .mobile-more-menu .more-item.active { color: #C41E3A; background: #fef2f2; }
    .mobile-more-menu .more-item svg { width: 24px; height: 24px; margin-bottom: 4px; }
    .mobile-more-overlay { position: fixed; inset: 0; z-index: 105; background: rgba(0,0,0,0.3); display: none; }
    .mobile-more-overlay.open { display: block; }

    /* Add padding to body bottom on mobile for bottom nav */
    @media (max-width: 767px) {
      body.admin-active { padding-bottom: 64px; }
    }

    /* Job detail sub-tabs mobile scroll */
    .subtab-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; scrollbar-width: none; }
    .subtab-scroll::-webkit-scrollbar { display: none; }
  </style>
</head>
<body class="bg-gray-50 text-gray-800 antialiased">

  <!-- Login Screen -->
  <div id="loginScreen" class="min-h-screen flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
      <div class="text-center mb-6">
        <h1 class="text-xl font-bold text-sva-dark">SVA CMS</h1>
        <p class="text-sm text-gray-500 mt-1">管理画面ログイン</p>
      </div>
      <form id="loginForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ユーザー名</label>
          <input type="text" id="loginUsername" required class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
          <input type="password" id="loginPassword" required class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red">
        </div>
        <div id="loginError" class="text-sm text-red-600 hidden"></div>
        <button type="submit" class="w-full py-2.5 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">ログイン</button>
      </form>
    </div>
  </div>

  <!-- Admin Dashboard -->
  <div id="adminDashboard" class="hidden">
    <!-- Admin Header -->
    <header class="bg-sva-dark text-white sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <div class="flex items-center gap-3">
          <h1 class="text-sm font-bold">SVA CMS</h1>
        </div>
        <div class="flex items-center gap-4">
          <button id="headerInquiryAlert" onclick="switchTab('inquiries')" class="hidden relative text-xs text-gray-400 hover:text-white transition-colors" title="未読のお問い合わせ">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <span id="headerInquiryCount" class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">0</span>
          </button>
          <a href="/column" target="_blank" class="text-xs text-gray-400 hover:text-white transition-colors">サイトを表示</a>
          <button id="logoutBtn" class="text-xs text-gray-400 hover:text-white transition-colors">ログアウト</button>
        </div>
      </div>
    </header>

    <!-- Desktop Tab Navigation (hidden on mobile) -->
    <div class="bg-white border-b border-gray-200 tab-scroll-wrap desktop-tab-bar" id="tabScrollWrap">
      <div class="max-w-7xl mx-auto px-2 sm:px-6">
        <div class="flex items-center gap-0 tab-scroll" id="tabScroll">
          <button id="tabArticles" onclick="switchTab('articles')" class="cms-tab px-3 sm:px-5 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors border-sva-red text-sva-red whitespace-nowrap flex-shrink-0">記事管理</button>
          <button id="tabImages" onclick="switchTab('images')" class="cms-tab px-3 sm:px-5 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap flex-shrink-0">画像</button>
          <button id="tabPartners" onclick="switchTab('partners')" class="cms-tab px-3 sm:px-5 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap flex-shrink-0">パートナー</button>
          <button id="tabJobs" onclick="switchTab('jobs')" class="cms-tab px-3 sm:px-5 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap flex-shrink-0">案件</button>
          <button id="tabProducts" onclick="switchTab('products')" class="cms-tab px-3 sm:px-5 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap flex-shrink-0">製品</button>
          <button id="tabInquiries" onclick="switchTab('inquiries')" class="cms-tab px-3 sm:px-5 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap flex-shrink-0 relative">問合せ<span id="inquiryBadge" class="hidden absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">0</span></button>
          <button id="tabRequests" onclick="switchTab('requests')" class="cms-tab px-3 sm:px-5 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap flex-shrink-0 relative">取付依頼<span id="requestBadge" class="hidden absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">0</span></button>
          <button id="tabPhotogallery" onclick="switchTab('photogallery')" class="cms-tab px-3 sm:px-5 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap flex-shrink-0">写真</button>
          <button id="tabAccount" onclick="switchTab('account')" class="cms-tab px-3 sm:px-5 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap flex-shrink-0 md:ml-auto">設定</button>
        </div>
      </div>
    </div>

    <!-- Mobile Bottom Navigation (visible only on mobile) -->
    <div class="mobile-bottom-nav" id="mobileBottomNav">
      <div class="nav-grid">
        <button class="nav-item active" data-mob-tab="articles" onclick="switchTab('articles');closeMobileMore()">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          <span>記事</span>
        </button>
        <button class="nav-item" data-mob-tab="jobs" onclick="switchTab('jobs');closeMobileMore()">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          <span>案件</span>
        </button>
        <button class="nav-item" data-mob-tab="partners" onclick="switchTab('partners');closeMobileMore()">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span>パートナー</span>
        </button>
        <button class="nav-item" data-mob-tab="requests" onclick="switchTab('requests');closeMobileMore()">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
          <span>取付依頼</span>
          <span id="mobileRequestBadge" class="nav-badge" style="display:none">0</span>
        </button>
        <button class="nav-item" id="mobileMoreBtn" onclick="toggleMobileMore()">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16M4 12h16M4 18h16"/></svg>
          <span>その他</span>
        </button>
      </div>
    </div>

    <!-- Mobile More Menu Overlay -->
    <div class="mobile-more-overlay" id="mobileMoreOverlay" onclick="closeMobileMore()"></div>
    <div class="mobile-more-menu" id="mobileMoreMenu">
      <div style="text-align:center;padding:10px 0 2px"><div style="width:36px;height:4px;background:#d1d5db;border-radius:2px;margin:0 auto"></div></div>
      <div class="more-grid">
        <button class="more-item" data-mob-tab="inquiries" onclick="switchTab('inquiries');closeMobileMore()">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          <span>問合せ</span>
        </button>
        <button class="more-item" data-mob-tab="images" onclick="switchTab('images');closeMobileMore()">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          <span>画像</span>
        </button>
        <button class="more-item" data-mob-tab="products" onclick="switchTab('products');closeMobileMore()">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          <span>製品</span>
        </button>
        <button class="more-item" data-mob-tab="photogallery" onclick="switchTab('photogallery');closeMobileMore()">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>
          <span>写真</span>
        </button>
        <button class="more-item" data-mob-tab="account" onclick="switchTab('account');closeMobileMore()">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span>設定</span>
        </button>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- ARTICLES TAB -->
    <!-- ============================================ -->
    <div id="articlesTab">
      <!-- Toolbar -->
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div id="viewTitle" class="text-lg font-bold text-sva-dark">記事一覧</div>
          <div class="flex items-center gap-2">
            <button id="backToListBtn" class="hidden px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">一覧に戻る</button>
            <button id="newArticleBtn" class="px-4 py-1.5 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">新規作成</button>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <!-- Article List View -->
        <div id="listView">
          <div id="articleList" class="space-y-2"></div>
          <div id="listPagination" class="mt-6 flex justify-center gap-2"></div>
        </div>

        <!-- Article Editor View -->
        <div id="editorView" class="hidden">
          <form id="articleForm" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <input type="hidden" id="articleId" value="">
            <div class="grid lg:grid-cols-3 gap-0">
              <div class="lg:col-span-2 p-6 space-y-5 border-r border-gray-100">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                  <input type="text" id="artTitle" required class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red" placeholder="記事タイトルを入力">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">スラッグ (URL)</label>
                  <div class="flex items-center gap-1 text-sm text-gray-400 mb-1"><span>/column/</span></div>
                  <input type="text" id="artSlug" required class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red font-mono" placeholder="article-slug">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">抜粋</label>
                  <textarea id="artExcerpt" rows="3" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red resize-none" placeholder="記事の概要（一覧表示用）"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">本文 (HTML)</label>
                  <textarea id="artContent" rows="18" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red resize-y font-mono leading-relaxed" placeholder="<h2>見出し</h2><p>本文...</p>"></textarea>
                </div>
              </div>
              <!-- Sidebar -->
              <div class="p-6 space-y-5 bg-gray-50/50">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
                  <select id="artStatus" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red bg-white">
                    <option value="draft">下書き</option>
                    <option value="published">公開</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                  <select id="artCategory" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red bg-white">
                    <option value="safety">安全対策</option>
                    <option value="technology">テクノロジー</option>
                    <option value="regulation">法規制</option>
                    <option value="installation">取付ガイド</option>
                    <option value="case-study">導入事例</option>
                    <option value="general">その他</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">著者</label>
                  <input type="text" id="artAuthor" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red bg-white" value="SVA編集部">
                </div>

                <!-- Thumbnail with image picker -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">アイキャッチ画像</label>
                  <div id="thumbPreview" class="mb-2 hidden">
                    <div class="relative rounded-lg overflow-hidden border border-gray-200">
                      <img id="thumbPreviewImg" src="" alt="" class="w-full h-32 object-cover">
                      <button type="button" onclick="clearThumbnail()" class="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center text-xs hover:bg-black/70">&times;</button>
                    </div>
                  </div>
                  <input type="hidden" id="artThumbnail" value="">
                  <div class="flex gap-2">
                    <button type="button" onclick="openImagePicker()" class="flex-1 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">画像を選択</button>
                    <button type="button" onclick="uploadForThumbnail()" class="flex-1 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">アップロード</button>
                  </div>
                  <input type="file" id="thumbFileInput" accept="image/*" class="hidden">
                </div>

                <div class="pt-3 space-y-2">
                  <button type="submit" class="w-full py-2.5 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">保存する</button>
                  <button type="button" id="deleteArticleBtn" class="hidden w-full py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">削除する</button>
                </div>
                <div id="editorMsg" class="text-sm hidden"></div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- IMAGES TAB -->
    <!-- ============================================ -->
    <div id="imagesTab" class="hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        <!-- Upload Area -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 class="text-base font-bold text-sva-dark mb-4">画像アップロード</h2>

          <!-- Size Guide -->
          <div class="bg-blue-50 rounded-lg p-4 mb-4">
            <p class="text-sm font-medium text-blue-800 mb-2">アップロード仕様</p>
            <div class="grid sm:grid-cols-3 gap-3 text-xs text-blue-700">
              <div class="bg-white rounded-lg p-3">
                <p class="font-medium mb-1">対応フォーマット</p>
                <p class="text-blue-600">JPEG / PNG / WebP / GIF / SVG</p>
              </div>
              <div class="bg-white rounded-lg p-3">
                <p class="font-medium mb-1">最大ファイルサイズ</p>
                <p class="text-blue-600">2MB 以下</p>
              </div>
              <div class="bg-white rounded-lg p-3">
                <p class="font-medium mb-1">推奨サイズ（アイキャッチ）</p>
                <p class="text-blue-600">1200 x 675px (16:9)</p>
              </div>
            </div>
          </div>

          <!-- Drop Zone -->
          <div id="dropZone" class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-gray-300 transition-colors">
            <svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <p class="text-sm text-gray-500 mb-1">ここに画像をドラッグ&ドロップ</p>
            <p class="text-xs text-gray-400 mb-3">または</p>
            <button type="button" id="selectFileBtn" class="px-4 py-2 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">ファイルを選択</button>
            <input type="file" id="fileInput" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" class="hidden" multiple>
          </div>

          <!-- Upload Progress -->
          <div id="uploadProgress" class="hidden mt-4">
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div class="w-5 h-5 border-2 border-sva-red border-t-transparent rounded-full animate-spin"></div>
              <span id="uploadProgressText" class="text-sm text-gray-600">アップロード中...</span>
            </div>
          </div>

          <!-- Upload Result -->
          <div id="uploadResult" class="hidden mt-4"></div>
        </div>

        <!-- Image Library -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-bold text-sva-dark">アップロード済み画像</h2>
            <button onclick="loadImages(1)" class="text-xs text-gray-400 hover:text-sva-red transition-colors">更新</button>
          </div>
          <div id="imageGrid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"></div>
          <div id="imagePagination" class="mt-4 flex justify-center gap-2"></div>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- PARTNERS TAB -->
    <!-- ============================================ -->
    <div id="partnersTab" class="hidden">
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div id="partnerViewTitle" class="text-lg font-bold text-sva-dark">パートナー一覧</div>
          <div class="flex items-center gap-2">
            <input id="partnerSearch" type="text" placeholder="検索..." class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-sva-red w-40">
            <select id="partnerRankFilter" onchange="loadPartners(1)" class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white">
              <option value="">全ランク</option>
              <option value="standard">スタンダード</option>
              <option value="silver">シルバー</option>
              <option value="gold">ゴールド</option>
              <option value="platinum">プラチナ</option>
            </select>
            <button id="backToPartnerListBtn" class="hidden px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50" onclick="loadPartners(1)">一覧に戻る</button>
            <button onclick="showInvitePanel()" class="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"><svg class="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>招待リンク</button>
            <button onclick="showNewPartnerForm()" class="px-4 py-1.5 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800">新規登録</button>
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <!-- Partner List -->
        <div id="partnerListView"><div id="partnerList" class="space-y-2"></div><div id="partnerPagination" class="mt-6 flex justify-center gap-2"></div></div>
        <!-- Partner Detail/Edit -->
        <div id="partnerDetailView" class="hidden"></div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- JOBS TAB -->
    <!-- ============================================ -->
    <div id="jobsTab" class="hidden">
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div id="jobViewTitle" class="text-lg font-bold text-sva-dark">案件一覧</div>
          <div class="flex items-center gap-2">
            <div class="relative"><input id="jobSearchInput" type="text" placeholder="案件No・案件名・会社名で検索" class="w-56 pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-sva-red" onkeydown="if(event.key==='Enter')loadJobs(1)"><svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
            <select id="jobStatusFilter" onchange="loadJobs(1)" class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white">
              <option value="">全ステータス</option>
              <option value="pending">未対応</option>
              <option value="accepted">受諾</option>
              <option value="in_progress">対応中</option>
              <option value="completed">完了</option>
              <option value="declined">辞退</option>
              <option value="cancelled">キャンセル</option>
            </select>
            <button id="backToJobListBtn" class="hidden px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50" onclick="loadJobs(1)">一覧に戻る</button>
            <button onclick="showNewJobForm()" class="px-4 py-1.5 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800">新規案件作成</button>
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div id="jobListView"><div id="jobList" class="space-y-2"></div><div id="jobPagination" class="mt-6 flex justify-center gap-2"></div></div>
        <div id="jobDetailView" class="hidden"></div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- IMAGE PICKER MODAL -->
    <!-- ============================================ -->
    <div id="imagePickerModal" class="fixed inset-0 bg-black/40 z-[100] hidden flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 class="text-sm font-bold text-sva-dark">画像を選択</h3>
          <button onclick="closeImagePicker()" class="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <div class="flex-1 overflow-auto p-5">
          <div id="pickerGrid" class="grid grid-cols-3 sm:grid-cols-4 gap-3"></div>
          <div id="pickerPagination" class="mt-4 flex justify-center gap-2"></div>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- INQUIRIES TAB (お問い合わせ管理) -->
    <!-- ============================================ -->
    <div id="inquiriesTab" class="hidden">
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div id="inquiryViewTitle" class="text-lg font-bold text-sva-dark flex items-center gap-2">お問い合わせ一覧 <span id="inquiryUnreadHeader" class="hidden px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full"></span></div>
          <div class="flex items-center gap-2">
            <input id="inquirySearchInput" type="text" placeholder="名前・会社名・メールで検索" class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-sva-red w-52" onkeydown="if(event.key==='Enter')loadInquiries(1)">
            <select id="inquiryStatusFilter" onchange="loadInquiries(1)" class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white">
              <option value="">全ステータス</option>
              <option value="new">新着（未読）</option>
              <option value="read">確認済み</option>
              <option value="replied">返信済み</option>
              <option value="in_progress">対応中</option>
              <option value="resolved">解決</option>
              <option value="spam">スパム</option>
            </select>
            <button id="backToInquiryListBtn" class="hidden px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50" onclick="loadInquiries(1)">一覧に戻る</button>
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div id="inquiryListView"><div id="inquiryList" class="space-y-2"></div><div id="inquiryPagination" class="mt-6 flex justify-center gap-2"></div></div>
        <div id="inquiryDetailView" class="hidden"></div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- PRODUCTS TAB (製品マスタ管理) -->
    <!-- ============================================ -->
    <div id="productsTab" class="hidden">
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div id="productViewTitle" class="text-lg font-bold text-sva-dark">製品マスタ一覧</div>
          <div class="flex items-center gap-2">
            <input id="productSearchInput" type="text" placeholder="製品名・型番で検索" class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-sva-red w-44" oninput="filterProductList()">
            <select id="productCategoryFilter" onchange="filterProductList()" class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white">
              <option value="">全カテゴリ</option>
              <option value="camera">カメラ</option>
              <option value="sensor">センサー</option>
              <option value="light">安全灯</option>
              <option value="control">制御</option>
              <option value="recorder">レコーダー</option>
              <option value="monitor">モニター</option>
              <option value="other">その他</option>
            </select>
            <select id="productActiveFilter" onchange="filterProductList()" class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white">
              <option value="">全ステータス</option>
              <option value="1">有効のみ</option>
              <option value="0">無効のみ</option>
            </select>
            <button id="backToProductListBtn" class="hidden px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50" onclick="loadProductMaster()">一覧に戻る</button>
            <button onclick="showNewProductForm()" class="px-4 py-1.5 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800">新規製品追加</button>
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div id="productListView"><div id="productList" class="space-y-2"></div></div>
        <div id="productDetailView" class="hidden"></div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- PHOTO GALLERY TAB (写真管理) -->
    <!-- ============================================ -->
    <div id="photogalleryTab" class="hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-bold text-sva-dark flex items-center gap-2">
            <svg class="w-5 h-5 text-sva-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="3"/></svg>
            案件写真管理
          </h2>
          <div class="text-xs text-gray-400">案件を選択して写真を管理</div>
        </div>
        <!-- Job selector for photos -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
          <div class="flex items-center gap-3 flex-wrap">
            <label class="text-sm font-medium text-gray-700">案件選択:</label>
            <select id="pgJobSelect" onchange="loadPhotoGallery(this.value)" class="flex-1 min-w-[200px] px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red">
              <option value="">-- 案件を選択してください --</option>
            </select>
            <button onclick="refreshPhotoJobList()" class="px-3 py-2 text-xs bg-gray-100 rounded-lg hover:bg-gray-200">更新</button>
          </div>
        </div>
        <!-- Photo gallery content -->
        <div id="pgContent">
          <div class="text-center py-16 text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>
            <p class="text-sm">上部の案件選択プルダウンから案件を選択してください</p>
            <p class="text-xs text-gray-300 mt-1">パートナーがアップロードした写真を確認・管理できます</p>
          </div>
        </div>
      </div>
      <!-- Admin photo preview modal -->
      <div id="adminPhotoPreview" class="hidden fixed inset-0 bg-black z-[95] flex flex-col">
        <div class="flex items-center justify-between px-4 py-3 bg-black/80">
          <span id="adminPhotoLabel" class="text-white text-sm font-medium"></span>
          <div class="flex items-center gap-3">
            <button onclick="adminDeleteCurrentPhoto()" class="text-red-400 hover:text-red-300 text-xs px-2 py-1 border border-red-500/50 rounded">削除</button>
            <button onclick="document.getElementById('adminPhotoPreview').classList.add('hidden')" class="text-white/80 hover:text-white p-1"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
        </div>
        <div class="flex-1 flex items-center justify-center p-4 overflow-auto">
          <img id="adminPhotoImg" src="" class="max-w-full max-h-full rounded-lg shadow-2xl object-contain">
        </div>
        <div class="flex items-center justify-center gap-4 px-4 py-3 bg-black/80">
          <button onclick="adminNavigatePhoto(-1)" class="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
          <span id="adminPhotoCounter" class="text-white/60 text-sm"></span>
          <button onclick="adminNavigatePhoto(1)" class="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- REQUESTS TAB (取付依頼管理) -->
    <!-- ============================================ -->
    <div id="requestsTab" class="hidden">
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div id="requestViewTitle" class="text-lg font-bold text-sva-dark flex items-center gap-2">取付依頼一覧 <span id="requestNewHeader" class="hidden px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full"></span></div>
          <div class="flex items-center gap-2">
            <input id="requestSearchInput" type="text" placeholder="会社名・担当者名で検索" class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-sva-red w-52" onkeydown="if(event.key==='Enter')loadRequests(1)">
            <select id="requestStatusFilter" onchange="loadRequests(1)" class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white">
              <option value="">全ステータス</option>
              <option value="new">新着</option>
              <option value="confirmed">確認済み</option>
              <option value="assigned">パートナー割当済</option>
              <option value="scheduled">施工日確定</option>
              <option value="in_progress">施工中</option>
              <option value="completed">完了</option>
              <option value="cancelled">キャンセル</option>
            </select>
            <button id="backToRequestListBtn" class="hidden px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50" onclick="loadRequests(1)">一覧に戻る</button>
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div id="requestListView">
          <div id="requestList" class="space-y-2">
            <div class="text-center py-16 text-gray-400">
              <svg class="w-16 h-16 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
              <p class="text-sm">取付依頼はまだありません</p>
              <p class="text-xs text-gray-300 mt-1">メーカー・商社様からの取付依頼がここに表示されます</p>
            </div>
          </div>
          <div id="requestPagination" class="mt-6 flex justify-center gap-2"></div>
        </div>
        <div id="requestDetailView" class="hidden"></div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- ACCOUNT TAB -->
    <!-- ============================================ -->
    <div id="accountTab" class="hidden">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 bg-gray-50">
            <h2 class="text-lg font-bold text-sva-dark">アカウント設定</h2>
            <p class="text-sm text-gray-500 mt-1">ユーザー名とパスワードを定期的に変更してください</p>
          </div>

          <!-- 現在のアカウント情報 -->
          <div class="px-6 py-5 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">現在のアカウント情報</h3>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-sva-red/10 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-sva-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <div>
                <p class="text-sm font-medium text-sva-dark">ユーザー名: <span id="currentUsername" class="text-sva-red">-</span></p>
                <p class="text-xs text-gray-400 mt-0.5">最終更新: ログイン中</p>
              </div>
            </div>
          </div>

          <!-- ユーザー名変更 -->
          <div class="px-6 py-5 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-700 mb-4">ユーザー名の変更</h3>
            <form id="usernameForm" class="space-y-3">
              <div>
                <label class="block text-xs text-gray-500 mb-1">新しいユーザー名</label>
                <input id="newUsername" type="text" required minlength="3" maxlength="50" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red" placeholder="3文字以上">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">現在のパスワード（確認用）</label>
                <input id="usernameConfirmPassword" type="password" required class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red" placeholder="パスワードを入力">
              </div>
              <div id="usernameMsg" class="text-sm hidden"></div>
              <button type="submit" class="px-5 py-2.5 bg-sva-dark text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">ユーザー名を変更</button>
            </form>
          </div>

          <!-- パスワード変更 -->
          <div class="px-6 py-5">
            <h3 class="text-sm font-semibold text-gray-700 mb-4">パスワードの変更</h3>
            <form id="passwordForm" class="space-y-3">
              <div>
                <label class="block text-xs text-gray-500 mb-1">現在のパスワード</label>
                <input id="currentAdminPassword" type="password" required class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red" placeholder="現在のパスワード">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">新しいパスワード</label>
                <input id="newAdminPassword" type="password" required minlength="8" maxlength="128" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red" placeholder="8文字以上">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">新しいパスワード（確認）</label>
                <input id="confirmAdminPassword" type="password" required class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red" placeholder="もう一度入力">
              </div>
              <div id="passwordMsg" class="text-sm hidden"></div>
              <button type="submit" class="px-5 py-2.5 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">パスワードを変更</button>
            </form>
          </div>

          <!-- セキュリティ注意 -->
          <div class="px-6 py-4 bg-amber-50 border-t border-amber-100">
            <p class="text-xs text-amber-700 leading-relaxed">⚠️ セキュリティのため、パスワードは定期的に変更することをお勧めします。パスワード変更後は再ログインが必要です。</p>
          </div>
        </div>
      </div>
    </div>

  </div>
  <script>
    const API = '/api';
    let authToken = sessionStorage.getItem('sva_token') || '';
    let currentPage = 1;
    let imgPage = 1;
    let pickerCallback = null;

    const CAT_LABELS = {
      'safety': '安全対策', 'technology': 'テクノロジー', 'regulation': '法規制',
      'installation': '取付ガイド', 'case-study': '導入事例', 'general': 'その他'
    };

    // ===== Auth =====
    if (authToken) { showDashboard(); loadProductMasterData(); loadInquiryBadge(); loadArticles(1); }

    document.getElementById('loginForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const errEl = document.getElementById('loginError');
      errEl.classList.add('hidden');
      try {
        const res = await fetch(API + '/admin/login', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: document.getElementById('loginUsername').value, password: document.getElementById('loginPassword').value })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        authToken = data.token;
        sessionStorage.setItem('sva_token', authToken);
        showDashboard(); loadProductMasterData(); loadInquiryBadge(); loadArticles(1);
      } catch (err) {
        errEl.textContent = 'ユーザー名またはパスワードが正しくありません';
        errEl.classList.remove('hidden');
      }
    });

    document.getElementById('logoutBtn').addEventListener('click', function() {
      authToken = ''; sessionStorage.removeItem('sva_token');
      document.getElementById('adminDashboard').classList.add('hidden');
      document.getElementById('loginScreen').classList.remove('hidden');
      document.body.classList.remove('admin-active');
    });

    function showDashboard() {
      document.getElementById('loginScreen').classList.add('hidden');
      document.getElementById('adminDashboard').classList.remove('hidden');
      document.body.classList.add('admin-active');
    }

    // ===== Mobile Bottom Nav =====
    function toggleMobileMore() {
      var menu = document.getElementById('mobileMoreMenu');
      var overlay = document.getElementById('mobileMoreOverlay');
      var isOpen = menu.classList.contains('open');
      if (isOpen) { closeMobileMore(); } else { menu.classList.add('open'); overlay.classList.add('open'); }
    }
    function closeMobileMore() {
      var menu = document.getElementById('mobileMoreMenu');
      var overlay = document.getElementById('mobileMoreOverlay');
      if (menu) menu.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
    }
    function updateMobileNav(tab) {
      // Update bottom nav items
      document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(function(el) {
        var t = el.getAttribute('data-mob-tab');
        if (t) { el.classList.toggle('active', t === tab); }
      });
      // Update more-menu items
      document.querySelectorAll('.mobile-more-menu .more-item').forEach(function(el) {
        var t = el.getAttribute('data-mob-tab');
        if (t) { el.classList.toggle('active', t === tab); }
      });
      // If the active tab is in the "more" group, highlight the "more" button
      var moreTabs = ['inquiries','images','products','photogallery','account'];
      var moreBtn = document.getElementById('mobileMoreBtn');
      if (moreBtn) { moreBtn.classList.toggle('active', moreTabs.indexOf(tab) !== -1); }
    }

    // ===== Tabs =====
    const TABS = ['articles','images','partners','jobs','products','inquiries','requests','photogallery','account'];
    function switchTab(tab) {
      TABS.forEach(function(t) {
        var el = document.getElementById(t + 'Tab'); if (el) el.classList.toggle('hidden', t !== tab);
        if (t === 'account' && tab === 'account') loadAccountInfo();
        // Desktop tab styling
        var btn = document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1));
        if (btn) { btn.classList.toggle('border-sva-red', t === tab); btn.classList.toggle('text-sva-red', t === tab); btn.classList.toggle('border-transparent', t !== tab); btn.classList.toggle('text-gray-500', t !== tab); }
      });
      // Auto-scroll active tab into view on desktop
      var activeBtn = document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1));
      if (activeBtn) {
        var scr = document.getElementById('tabScroll');
        if (scr) { activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); updateTabScrollHints(); }
      }
      // Update mobile bottom nav
      updateMobileNav(tab);
      if (tab === 'images') loadImages(1);
      if (tab === 'partners') loadPartners(1);
      if (tab === 'jobs') loadJobs(1);
      if (tab === 'products') loadProductMaster();
      if (tab === 'inquiries') loadInquiries(1);
      if (tab === 'photogallery') refreshPhotoJobList();
      if (tab === 'requests') loadRequests(1);
    }

    // Tab scroll gradient hints (desktop)
    function updateTabScrollHints() {
      var wrap = document.getElementById('tabScrollWrap');
      var scr = document.getElementById('tabScroll');
      if (!wrap || !scr) return;
      var sl = scr.scrollLeft, sw = scr.scrollWidth, cw = scr.clientWidth;
      wrap.classList.toggle('scrolled-end', sl + cw >= sw - 4);
      wrap.classList.toggle('scrolled-mid', sl > 4);
      wrap.classList.toggle('scrolled-start', sl <= 4);
    }
    (function() {
      var scr = document.getElementById('tabScroll');
      if (scr) { scr.addEventListener('scroll', updateTabScrollHints); window.addEventListener('resize', updateTabScrollHints); setTimeout(updateTabScrollHints, 100); }
    })();

    // ===== Article List =====
    async function loadArticles(page) {
      currentPage = page; showListView();
      try {
        const res = await fetch(API + '/admin/articles?page=' + page, { headers: { 'Authorization': 'Bearer ' + authToken } });
        if (res.status === 401) { authToken = ''; sessionStorage.removeItem('sva_token'); location.reload(); return; }
        const data = await res.json();
        renderArticleList(data.articles, data.pagination);
      } catch (err) {
        document.getElementById('articleList').innerHTML = '<p class="text-sm text-red-500">読み込みに失敗しました</p>';
      }
    }

    function renderArticleList(articles, pag) {
      const list = document.getElementById('articleList');
      if (!articles || articles.length === 0) { list.innerHTML = '<div class="text-center py-16 text-gray-400"><p class="text-sm">記事がまだありません</p></div>'; return; }
      list.innerHTML = articles.map(function(a) {
        const badge = a.status === 'published' ? '<span class="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded">公開</span>' : '<span class="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded">下書き</span>';
        const cat = CAT_LABELS[a.category] || a.category;
        const date = a.updated_at ? new Date(a.updated_at).toLocaleDateString('ja-JP') : '-';
        const thumb = a.thumbnail_url ? '<img src="' + esc(a.thumbnail_url) + '" class="w-12 h-12 rounded object-cover shrink-0 border border-gray-100">' : '<div class="w-12 h-12 rounded bg-gray-50 shrink-0 flex items-center justify-center"><svg class="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>';
        return '<div class="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-4 hover:border-gray-300 transition-colors cursor-pointer" onclick="editArticle(' + a.id + ')">' + thumb + '<div class="min-w-0 flex-1"><div class="flex items-center gap-2 mb-1">' + badge + '<span class="text-xs text-gray-400">' + cat + '</span></div><p class="text-sm font-medium text-gray-800 truncate">' + esc(a.title) + '</p><p class="text-xs text-gray-400 mt-0.5">/' + esc(a.slug) + ' ・ ' + date + '</p></div><svg class="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></div>';
      }).join('');
      renderPagination('listPagination', pag, 'loadArticles');
    }

    // ===== Article Editor =====
    document.getElementById('newArticleBtn').addEventListener('click', function() { showEditorView('新規作成'); clearForm(); });
    document.getElementById('backToListBtn').addEventListener('click', function() { loadArticles(currentPage); });

    async function editArticle(id) {
      showEditorView('記事編集');
      try {
        const res = await fetch(API + '/admin/articles/' + id, { headers: { 'Authorization': 'Bearer ' + authToken } });
        const data = await res.json(); if (!data.article) return;
        const a = data.article;
        document.getElementById('articleId').value = a.id;
        document.getElementById('artTitle').value = a.title || '';
        document.getElementById('artSlug').value = a.slug || '';
        document.getElementById('artExcerpt').value = a.excerpt || '';
        document.getElementById('artContent').value = a.content || '';
        document.getElementById('artStatus').value = a.status || 'draft';
        document.getElementById('artCategory').value = a.category || 'general';
        document.getElementById('artAuthor').value = a.author || 'SVA\\u7de8\\u96c6\\u90e8';
        document.getElementById('artThumbnail').value = a.thumbnail_url || '';
        document.getElementById('deleteArticleBtn').classList.remove('hidden');
        updateThumbPreview(a.thumbnail_url);
      } catch (err) { showEditorMsg('読み込みに失敗しました', true); }
    }

    document.getElementById('articleForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const id = document.getElementById('articleId').value;
      const body = {
        title: document.getElementById('artTitle').value, slug: document.getElementById('artSlug').value,
        excerpt: document.getElementById('artExcerpt').value, content: document.getElementById('artContent').value,
        status: document.getElementById('artStatus').value, category: document.getElementById('artCategory').value,
        author: document.getElementById('artAuthor').value, thumbnail_url: document.getElementById('artThumbnail').value
      };
      try {
        const url = id ? API + '/admin/articles/' + id : API + '/admin/articles';
        const res = await fetch(url, { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken }, body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (!id && data.id) document.getElementById('articleId').value = data.id;
        if (!id) document.getElementById('deleteArticleBtn').classList.remove('hidden');
        showEditorMsg('保存しました', false);
      } catch (err) { showEditorMsg(err.message || '保存に失敗しました', true); }
    });

    document.getElementById('deleteArticleBtn').addEventListener('click', async function() {
      const id = document.getElementById('articleId').value;
      if (!id || !confirm('この記事を削除しますか？')) return;
      try { await fetch(API + '/admin/articles/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + authToken } }); loadArticles(currentPage); } catch (err) { showEditorMsg('削除に失敗しました', true); }
    });

    // ===== Thumbnail =====
    function updateThumbPreview(url) {
      const preview = document.getElementById('thumbPreview');
      const img = document.getElementById('thumbPreviewImg');
      if (url) { img.src = url; preview.classList.remove('hidden'); }
      else { img.src = ''; preview.classList.add('hidden'); }
    }

    function clearThumbnail() {
      document.getElementById('artThumbnail').value = '';
      updateThumbPreview('');
    }

    function uploadForThumbnail() {
      const input = document.getElementById('thumbFileInput');
      input.onchange = async function() {
        if (!this.files[0]) return;
        const url = await uploadSingleFile(this.files[0]);
        if (url) { document.getElementById('artThumbnail').value = url; updateThumbPreview(url); }
        this.value = '';
      };
      input.click();
    }

    function openImagePicker() {
      pickerCallback = function(url) { document.getElementById('artThumbnail').value = url; updateThumbPreview(url); };
      document.getElementById('imagePickerModal').classList.remove('hidden');
      loadPickerImages(1);
    }

    function closeImagePicker() {
      document.getElementById('imagePickerModal').classList.add('hidden');
      pickerCallback = null;
    }

    async function loadPickerImages(page) {
      try {
        const res = await fetch(API + '/admin/images?page=' + page, { headers: { 'Authorization': 'Bearer ' + authToken } });
        const data = await res.json();
        const grid = document.getElementById('pickerGrid');
        if (!data.images || data.images.length === 0) { grid.innerHTML = '<p class="col-span-full text-center text-sm text-gray-400 py-8">画像がありません。先に画像管理タブからアップロードしてください。</p>'; return; }
        grid.innerHTML = data.images.map(function(img) {
          return '<div class="cursor-pointer rounded-lg border-2 border-transparent hover:border-sva-red overflow-hidden transition-colors" onclick="selectPickerImage(\\'' + esc(img.url) + '\\')">'
            + '<img src="' + esc(img.url) + '" alt="' + esc(img.original_name) + '" class="w-full aspect-square object-cover">'
            + '<p class="text-xs text-gray-500 p-1.5 truncate">' + esc(img.original_name) + '</p>'
            + '</div>';
        }).join('');
        renderPagination('pickerPagination', data.pagination, 'loadPickerImages');
      } catch (err) {}
    }

    function selectPickerImage(url) {
      if (pickerCallback) pickerCallback(url);
      closeImagePicker();
    }

    // ===== Image Management =====
    async function loadImages(page) {
      imgPage = page;
      try {
        const res = await fetch(API + '/admin/images?page=' + page, { headers: { 'Authorization': 'Bearer ' + authToken } });
        const data = await res.json();
        const grid = document.getElementById('imageGrid');
        if (!data.images || data.images.length === 0) { grid.innerHTML = '<p class="col-span-full text-center text-sm text-gray-400 py-12">アップロードされた画像はまだありません</p>'; return; }
        grid.innerHTML = data.images.map(function(img) {
          return '<div class="rounded-lg border border-gray-200 overflow-hidden group relative">'
            + '<div class="aspect-square bg-gray-50"><img src="' + esc(img.url) + '" alt="' + esc(img.original_name) + '" class="w-full h-full object-cover"></div>'
            + '<div class="p-2.5">'
            + '<p class="text-xs font-medium text-gray-700 truncate mb-1">' + esc(img.original_name) + '</p>'
            + '<p class="text-[10px] text-gray-400">' + esc(img.sizeFormatted) + ' ・ ' + esc(img.mime_type.replace('image/','').toUpperCase()) + '</p>'
            + '<div class="flex gap-1.5 mt-2">'
            + '<button onclick="copyImageUrl(\\'' + esc(img.url) + '\\')" class="flex-1 py-1.5 text-[11px] bg-gray-50 text-gray-600 rounded border border-gray-200 hover:bg-gray-100 transition-colors">URL発行</button>'
            + '<button onclick="deleteImage(' + img.id + ')" class="py-1.5 px-2 text-[11px] text-red-500 rounded border border-red-100 hover:bg-red-50 transition-colors">削除</button>'
            + '</div>'
            + '</div></div>';
        }).join('');
        renderPagination('imagePagination', data.pagination, 'loadImages');
      } catch (err) { document.getElementById('imageGrid').innerHTML = '<p class="col-span-full text-sm text-red-500">読み込みに失敗しました</p>'; }
    }

    function copyImageUrl(url) {
      const fullUrl = location.origin + url;
      navigator.clipboard.writeText(fullUrl).then(function() {
        showToast('URLをクリップボードにコピーしました');
      }).catch(function() {
        prompt('画像URL:', fullUrl);
      });
    }

    async function deleteImage(id) {
      if (!confirm('この画像を削除しますか？\\n※記事内で使用中の場合、表示されなくなります。')) return;
      try {
        await fetch(API + '/admin/images/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + authToken } });
        loadImages(imgPage);
      } catch (err) {}
    }

    // ===== Upload Logic =====
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');

    document.getElementById('selectFileBtn').addEventListener('click', function() { fileInput.click(); });
    fileInput.addEventListener('change', function() { if (this.files.length) handleFiles(Array.from(this.files)); this.value = ''; });

    dropZone.addEventListener('dragover', function(e) { e.preventDefault(); this.classList.add('drop-active'); });
    dropZone.addEventListener('dragleave', function() { this.classList.remove('drop-active'); });
    dropZone.addEventListener('drop', function(e) { e.preventDefault(); this.classList.remove('drop-active'); if (e.dataTransfer.files.length) handleFiles(Array.from(e.dataTransfer.files)); });

    async function handleFiles(files) {
      const prog = document.getElementById('uploadProgress');
      const progText = document.getElementById('uploadProgressText');
      const result = document.getElementById('uploadResult');
      prog.classList.remove('hidden');
      result.classList.add('hidden');

      let results = [];
      for (let i = 0; i < files.length; i++) {
        progText.textContent = (i + 1) + '/' + files.length + ' アップロード中... (' + files[i].name + ')';
        const url = await uploadSingleFile(files[i]);
        results.push({ name: files[i].name, url: url, success: !!url });
      }

      prog.classList.add('hidden');
      result.classList.remove('hidden');
      result.innerHTML = results.map(function(r) {
        if (r.success) {
          const fullUrl = location.origin + r.url;
          return '<div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg mb-2">'
            + '<img src="' + esc(r.url) + '" class="w-10 h-10 rounded object-cover border border-green-200">'
            + '<div class="flex-1 min-w-0"><p class="text-sm font-medium text-green-800 truncate">' + esc(r.name) + '</p><p class="text-xs text-green-600 truncate">' + esc(fullUrl) + '</p></div>'
            + '<button onclick="copyImageUrl(\\'' + esc(r.url) + '\\')" class="shrink-0 px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium">URL発行</button>'
            + '</div>';
        }
        return '<div class="p-3 bg-red-50 rounded-lg mb-2"><p class="text-sm text-red-600">' + esc(r.name) + ' - アップロード失敗</p></div>';
      }).join('');

      loadImages(imgPage);
    }

    async function uploadSingleFile(file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(API + '/admin/images/upload', { method: 'POST', headers: { 'Authorization': 'Bearer ' + authToken }, body: formData });
        const data = await res.json();
        if (!res.ok) { showToast(data.error || 'アップロードに失敗しました'); return null; }
        return data.url;
      } catch (err) { showToast('アップロードに失敗しました'); return null; }
    }

    // ===== Helpers =====
    function showListView() {
      document.getElementById('listView').classList.remove('hidden');
      document.getElementById('editorView').classList.add('hidden');
      document.getElementById('backToListBtn').classList.add('hidden');
      document.getElementById('newArticleBtn').classList.remove('hidden');
      document.getElementById('viewTitle').textContent = '記事一覧';
    }
    function showEditorView(title) {
      document.getElementById('listView').classList.add('hidden');
      document.getElementById('editorView').classList.remove('hidden');
      document.getElementById('backToListBtn').classList.remove('hidden');
      document.getElementById('newArticleBtn').classList.add('hidden');
      document.getElementById('viewTitle').textContent = title;
    }
    function clearForm() {
      document.getElementById('articleId').value = '';
      document.getElementById('artTitle').value = '';
      document.getElementById('artSlug').value = '';
      document.getElementById('artExcerpt').value = '';
      document.getElementById('artContent').value = '';
      document.getElementById('artStatus').value = 'draft';
      document.getElementById('artCategory').value = 'safety';
      document.getElementById('artAuthor').value = 'SVA\\u7de8\\u96c6\\u90e8';
      document.getElementById('artThumbnail').value = '';
      document.getElementById('deleteArticleBtn').classList.add('hidden');
      document.getElementById('editorMsg').classList.add('hidden');
      updateThumbPreview('');
    }
    function showEditorMsg(msg, isError) {
      const el = document.getElementById('editorMsg');
      el.textContent = msg;
      el.className = 'text-sm p-2 rounded ' + (isError ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700');
      el.classList.remove('hidden');
      setTimeout(function() { el.classList.add('hidden'); }, 3000);
    }
    function showToast(msg) {
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-sva-dark text-white text-sm rounded-lg shadow-lg z-[200] transition-opacity';
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(function() { toast.style.opacity = '0'; setTimeout(function() { toast.remove(); }, 300); }, 2500);
    }
    function esc(str) { if (!str) return ''; var d = document.createElement('div'); d.textContent = str; return d.innerHTML; }
    function fmtDt(d) { if (!d) return '-'; try { return new Date(d).toLocaleString('ja-JP'); } catch(e) { return d; } }
    function renderPagination(elId, pag, fn) {
      const el = document.getElementById(elId);
      if (!pag || pag.totalPages <= 1) { el.innerHTML = ''; return; }
      let h = '';
      for (let i = 1; i <= pag.totalPages; i++) {
        const cls = i === pag.page ? 'bg-sva-red text-white border-sva-red' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50';
        h += '<button onclick="' + fn + '(' + i + ')" class="px-3 py-1.5 text-sm rounded-lg border ' + cls + '">' + i + '</button>';
      }
      el.innerHTML = h;
    }
    // Auto slug
    document.getElementById('artTitle').addEventListener('input', function() {
      if (document.getElementById('articleId').value) return;
      var s = this.value.toLowerCase().replace(/[\\s\\u3000]+/g, '-').replace(/[^a-z0-9\\u3040-\\u309f\\u30a0-\\u30ff\\u4e00-\\u9faf-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
      document.getElementById('artSlug').value = s;
    });

    // Search debounce for partners
    var partnerSearchTimer;
    document.getElementById('partnerSearch').addEventListener('input', function() {
      clearTimeout(partnerSearchTimer);
      partnerSearchTimer = setTimeout(function() { loadPartners(1); }, 300);
    });

    // =====================================================
    // PARTNER MANAGEMENT
    // =====================================================
    const RANK_LABELS = { 'standard': 'スタンダード', 'silver': 'シルバー', 'gold': 'ゴールド', 'platinum': 'プラチナ' };
    const RANK_COLORS = { 'standard': 'bg-gray-100 text-gray-600', 'silver': 'bg-slate-100 text-slate-700', 'gold': 'bg-amber-50 text-amber-700', 'platinum': 'bg-purple-50 text-purple-700' };
    const STATUS_P = { 'active': '<span class="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded font-medium">有効</span>', 'suspended': '<span class="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded font-medium">停止</span>' };
    let pPage = 1;

    async function loadPartners(page) {
      pPage = page;
      document.getElementById('partnerListView').classList.remove('hidden');
      document.getElementById('partnerDetailView').classList.add('hidden');
      document.getElementById('backToPartnerListBtn').classList.add('hidden');
      document.getElementById('partnerViewTitle').textContent = 'パートナー一覧';
      const search = document.getElementById('partnerSearch').value;
      const rank = document.getElementById('partnerRankFilter').value;
      let url = API + '/admin/partners?page=' + page;
      if (search) url += '&search=' + encodeURIComponent(search);
      if (rank) url += '&rank=' + rank;
      try {
        const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + authToken } });
        const data = await res.json();
        renderPartnerList(data.partners, data.pagination);
      } catch(e) { document.getElementById('partnerList').innerHTML = '<p class="text-sm text-red-500">読み込み失敗</p>'; }
    }

    function renderPartnerList(partners, pag) {
      const el = document.getElementById('partnerList');
      if (!partners || !partners.length) { el.innerHTML = '<div class="text-center py-16 text-gray-400 text-sm">パートナーが登録されていません</div>'; return; }
      el.innerHTML = partners.map(function(p) {
        var rankBadge = '<span class="px-2 py-0.5 text-xs rounded font-medium ' + (RANK_COLORS[p.rank] || RANK_COLORS.standard) + '">' + (RANK_LABELS[p.rank] || p.rank) + '</span>';
        var statusBadge = STATUS_P[p.status] || '';
        var date = p.created_at ? new Date(p.created_at).toLocaleDateString('ja-JP') : '-';
        return '<div class="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-4 hover:border-gray-300 cursor-pointer" onclick="viewPartner(' + p.id + ')">'
          + '<div class="w-10 h-10 bg-gradient-to-br from-sva-red to-red-700 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">' + esc(p.representative_name || p.email).charAt(0).toUpperCase() + '</div>'
          + '<div class="min-w-0 flex-1"><div class="flex items-center gap-2 mb-1">' + statusBadge + rankBadge + '</div>'
          + '<p class="text-sm font-medium text-gray-800 truncate">' + esc(p.company_name || '-') + ' <span class="text-gray-400 font-normal">/ ' + esc(p.representative_name || '-') + '</span></p>'
          + '<p class="text-xs text-gray-400 mt-0.5">' + esc(p.email) + ' ・ ' + esc(p.region || '-') + ' ・ 登録 ' + date + '</p></div>'
          + '<svg class="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></div>';
      }).join('');
      renderPagination('partnerPagination', pag, 'loadPartners');
    }

    async function viewPartner(id) {
      document.getElementById('partnerListView').classList.add('hidden');
      document.getElementById('partnerDetailView').classList.remove('hidden');
      document.getElementById('backToPartnerListBtn').classList.remove('hidden');
      document.getElementById('partnerViewTitle').textContent = 'パートナー詳細';
      try {
        const res = await fetch(API + '/admin/partners/' + id, { headers: { 'Authorization': 'Bearer ' + authToken } });
        const data = await res.json();
        const p = data.partner; const st = data.stats;
        const msgRes = await fetch(API + '/admin/partners/' + id + '/messages', { headers: { 'Authorization': 'Bearer ' + authToken } });
        const msgData = await msgRes.json();
        renderPartnerDetail(p, st, msgData.messages || []);
      } catch(e) { document.getElementById('partnerDetailView').innerHTML = '<p class="text-sm text-red-500">読み込み失敗</p>'; }
    }

    function renderPartnerDetail(p, stats, messages) {
      var rankOpts = ['standard','silver','gold','platinum'].map(function(r) { return '<option value="' + r + '"' + (p.rank === r ? ' selected' : '') + '>' + RANK_LABELS[r] + '</option>'; }).join('');
      var statusOpts = '<option value="active"' + (p.status === 'active' ? ' selected' : '') + '>有効</option><option value="suspended"' + (p.status === 'suspended' ? ' selected' : '') + '>利用停止</option>';
      var msgHtml = messages.length === 0 ? '<p class="text-sm text-gray-400 py-4 text-center">メッセージはありません</p>' : messages.map(function(m) {
        var dir = m.direction === 'to_partner';
        var readBadge = dir && !m.is_read ? ' <span class="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">未読</span>' : '';
        var time = m.created_at ? new Date(m.created_at).toLocaleString('ja-JP') : '';
        return '<div class="p-3 rounded-lg ' + (dir ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-100') + ' text-sm">'
          + '<div class="flex items-center gap-2 mb-1"><span class="text-xs font-medium ' + (dir ? 'text-blue-700' : 'text-green-700') + '">' + (dir ? 'SVA → パートナー' : 'パートナー → SVA') + '</span>' + readBadge + '<span class="text-[10px] text-gray-400 ml-auto">' + time + '</span></div>'
          + '<p class="font-medium text-gray-800 text-xs mb-0.5">' + esc(m.subject) + '</p>'
          + '<p class="text-gray-600 text-xs whitespace-pre-line">' + esc(m.body) + '</p></div>';
      }).join('');

      document.getElementById('partnerDetailView').innerHTML = '<div class="grid lg:grid-cols-3 gap-6">'
        + '<div class="lg:col-span-2 space-y-6">'
        // Edit form
        + '<div class="bg-white rounded-xl border border-gray-200 p-6"><h3 class="font-bold text-sva-dark text-base mb-4">プロフィール編集</h3>'
        + '<div class="grid sm:grid-cols-2 gap-4">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">会社名</label><input id="ep_company" value="' + esc(p.company_name) + '" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">担当者名</label><input id="ep_name" value="' + esc(p.representative_name) + '" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">メール</label><input id="ep_email" value="' + esc(p.email) + '" disabled class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">電話</label><input id="ep_phone" value="' + esc(p.phone) + '" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">対応エリア</label><input id="ep_region" value="' + esc(p.region) + '" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">専門分野</label><input id="ep_specialties" value="' + esc(p.specialties) + '" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">ランク</label><select id="ep_rank" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-sva-red">' + rankOpts + '</select></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">ステータス</label><select id="ep_status" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-sva-red">' + statusOpts + '</select></div>'
        + '</div>'
        + '<div class="mt-4 border-t border-gray-100 pt-4"><p class="text-xs font-medium text-gray-500 mb-3">住所・インボイス情報</p></div>'
        + '<div class="grid sm:grid-cols-3 gap-4 mt-2">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">郵便番号</label><input id="ep_postal" value="' + esc(p.postal_code || '') + '" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="000-0000"></div>'
        + '<div class="sm:col-span-2"><label class="block text-xs font-medium text-gray-600 mb-1">住所</label><input id="ep_address" value="' + esc(p.address || '') + '" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="都道府県 市区町村 番地 建物名"></div>'
        + '</div>'
        + '<div class="mt-3"><label class="block text-xs font-medium text-gray-600 mb-1">インボイス番号（適格請求書発行事業者登録番号）</label><input id="ep_invoice" value="' + esc(p.invoice_number || '') + '" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="T1234567890123"></div>'
        + '<div class="mt-4"><label class="block text-xs font-medium text-gray-600 mb-1">管理メモ</label><textarea id="ep_notes" rows="3" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red resize-none">' + esc(p.notes) + '</textarea></div>'
        + '<div class="flex items-center gap-3 mt-4">'
        + '<button onclick="savePartner(' + p.id + ')" class="px-6 py-2 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800">保存</button>'
        + '<button onclick="if(confirm(\\'このパートナーを削除しますか？\\n関連する案件・メッセージもすべて削除されます。\\'))deletePartner(' + p.id + ')" class="px-4 py-2 border border-red-200 text-red-600 text-sm rounded-lg hover:bg-red-50">アカウント削除</button>'
        + '<span id="epMsg" class="text-sm"></span>'
        + '</div></div>'
        // Messages
        + '<div class="bg-white rounded-xl border border-gray-200 p-6"><h3 class="font-bold text-sva-dark text-base mb-4">メッセージ履歴</h3>'
        + '<div class="mb-4 p-4 bg-gray-50 rounded-lg"><p class="text-xs font-medium text-gray-600 mb-2">新規メッセージ送信</p>'
        + '<input id="msgSubject" placeholder="件名" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2 focus:outline-none focus:border-sva-red">'
        + '<textarea id="msgBody" rows="3" placeholder="本文" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2 focus:outline-none focus:border-sva-red resize-none"></textarea>'
        + '<button onclick="sendMessage(' + p.id + ')" class="px-4 py-1.5 bg-sva-dark text-white text-sm rounded-lg hover:bg-gray-800">送信</button></div>'
        + '<div class="space-y-2 max-h-96 overflow-y-auto">' + msgHtml + '</div></div>'
        + '</div>'
        // Sidebar stats
        + '<div class="space-y-4">'
        + '<div class="bg-white rounded-xl border border-gray-200 p-5"><h4 class="text-sm font-bold text-sva-dark mb-3">統計</h4>'
        + '<div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-gray-500">案件数</span><span class="font-bold">' + stats.jobs + '件</span></div>'
        + '<div class="flex justify-between"><span class="text-gray-500">メッセージ数</span><span class="font-bold">' + stats.messages + '件</span></div>'
        + '<div class="flex justify-between"><span class="text-gray-500">最終ログイン</span><span class="text-xs text-gray-600">' + (p.last_login_at ? new Date(p.last_login_at).toLocaleString('ja-JP') : '未ログイン') + '</span></div>'
        + '<div class="flex justify-between"><span class="text-gray-500">登録日</span><span class="text-xs text-gray-600">' + (p.created_at ? new Date(p.created_at).toLocaleDateString('ja-JP') : '-') + '</span></div></div></div>'
        + '<div class="bg-white rounded-xl border border-gray-200 p-5"><h4 class="text-sm font-bold text-sva-dark mb-3">クイック操作</h4>'
        + '<button onclick="switchTab(\\'jobs\\');setTimeout(function(){document.getElementById(\\'jobStatusFilter\\').value=\\'\\';loadJobs(1)},100)" class="w-full text-left px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 mb-1">このパートナーに案件を送信 →</button></div>'
        + '</div></div>';
    }

    async function savePartner(id) {
      try {
        const res = await fetch(API + '/admin/partners/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({ company_name: document.getElementById('ep_company').value, representative_name: document.getElementById('ep_name').value, phone: document.getElementById('ep_phone').value, region: document.getElementById('ep_region').value, specialties: document.getElementById('ep_specialties').value, rank: document.getElementById('ep_rank').value, status: document.getElementById('ep_status').value, notes: document.getElementById('ep_notes').value, postal_code: document.getElementById('ep_postal').value, address: document.getElementById('ep_address').value, invoice_number: document.getElementById('ep_invoice').value })
        });
        if (res.ok) { document.getElementById('epMsg').textContent = '保存しました'; document.getElementById('epMsg').className = 'text-sm text-green-600'; }
        else { var d = await res.json(); document.getElementById('epMsg').textContent = d.error || '失敗'; document.getElementById('epMsg').className = 'text-sm text-red-600'; }
      } catch(e) { document.getElementById('epMsg').textContent = 'エラー'; document.getElementById('epMsg').className = 'text-sm text-red-600'; }
      setTimeout(function() { var m = document.getElementById('epMsg'); if(m) m.textContent = ''; }, 3000);
    }

    async function deletePartner(id) {
      await fetch(API + '/admin/partners/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + authToken } });
      loadPartners(1);
    }

    async function sendMessage(partnerId) {
      var subj = document.getElementById('msgSubject').value;
      var body = document.getElementById('msgBody').value;
      if (!subj || !body) { showToast('件名と本文を入力してください'); return; }
      try {
        await fetch(API + '/admin/partners/' + partnerId + '/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken }, body: JSON.stringify({ subject: subj, body: body }) });
        showToast('メッセージを送信しました');
        viewPartner(partnerId); // refresh
      } catch(e) { showToast('送信失敗'); }
    }

    // ===== Invitation Panel =====
    async function showInvitePanel() {
      document.getElementById('partnerListView').classList.add('hidden');
      document.getElementById('partnerDetailView').classList.remove('hidden');
      document.getElementById('backToPartnerListBtn').classList.remove('hidden');
      document.getElementById('partnerViewTitle').textContent = '招待リンク管理';
      var dv = document.getElementById('partnerDetailView');
      dv.innerHTML = '<div class="flex items-center justify-center py-8"><div class="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>';
      try {
        var res = await fetch(API + '/admin/invitations', { headers: { 'Authorization': 'Bearer ' + authToken } });
        var data = await res.json();
        renderInvitePanel(data.invitations || []);
      } catch(e) { dv.innerHTML = '<p class="text-sm text-red-500">読み込み失敗</p>'; }
    }

    function renderInvitePanel(invites) {
      var dv = document.getElementById('partnerDetailView');
      var baseUrl = location.origin + '/partner/invite/';
      var RANK_LABELS = { 'standard': 'スタンダード', 'silver': 'シルバー', 'gold': 'ゴールド', 'platinum': 'プラチナ' };
      var RANK_COLORS = { 'standard': 'bg-gray-100 text-gray-700', 'silver': 'bg-blue-50 text-blue-700', 'gold': 'bg-yellow-50 text-yellow-700', 'platinum': 'bg-purple-50 text-purple-700' };

      dv.innerHTML = ''
        // 新規発行フォーム
        + '<div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">'
        + '<h3 class="text-base font-bold text-sva-dark mb-4 flex items-center gap-2"><svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>新しい招待リンクを発行</h3>'
        + '<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">メモ（パートナー名等）</label><input id="inv_memo" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="例: 株式会社〇〇様"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">ランク</label><select id="inv_rank" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"><option value="standard">スタンダード</option><option value="silver">シルバー</option><option value="gold">ゴールド</option><option value="platinum">プラチナ</option></select></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">使用回数上限</label><input id="inv_max" type="number" value="1" min="1" max="100" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">有効期限（日数）</label><input id="inv_days" type="number" value="7" min="1" max="365" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"></div>'
        + '</div>'
        + '<div class="flex items-center gap-3"><button onclick="createInvitation()" class="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">招待リンクを発行</button><span id="invMsg" class="text-sm"></span></div>'
        + '</div>'
        // 発行済み一覧
        + '<div class="bg-white rounded-xl border border-gray-200 p-6">'
        + '<h3 class="text-base font-bold text-sva-dark mb-4">発行済み招待リンク</h3>'
        + (invites.length === 0
          ? '<p class="text-sm text-gray-400 text-center py-6">まだ招待リンクがありません</p>'
          : '<div class="space-y-3">' + invites.map(function(inv) {
            var expired = new Date(inv.expires_at) < new Date();
            var full = inv.used_count >= inv.max_uses;
            var statusText = expired ? '期限切れ' : full ? '使用済み' : '有効';
            var statusColor = expired ? 'text-gray-400' : full ? 'text-orange-500' : 'text-green-600';
            var rankLabel = RANK_LABELS[inv.rank] || inv.rank;
            var rankColor = RANK_COLORS[inv.rank] || RANK_COLORS.standard;
            var url = baseUrl + inv.token;
            return '<div class="border border-gray-200 rounded-xl p-4 ' + (expired || full ? 'bg-gray-50 opacity-60' : '') + '">'
              + '<div class="flex items-center gap-2 mb-2">'
              + '<span class="text-xs font-bold ' + statusColor + '">' + statusText + '</span>'
              + '<span class="px-2 py-0.5 text-[10px] rounded font-medium ' + rankColor + '">' + rankLabel + '</span>'
              + (inv.memo ? '<span class="text-xs text-gray-600 font-medium">' + esc(inv.memo) + '</span>' : '')
              + '<span class="text-[10px] text-gray-400 ml-auto">' + fmtDt(inv.created_at) + '</span></div>'
              + '<div class="flex items-center gap-2 mb-2">'
              + '<input type="text" readonly value="' + url + '" class="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-600 select-all">'
              + '<button onclick="copyInviteUrl(this,\\'' + url + '\\')" class="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-medium shrink-0">コピー</button></div>'
              + '<div class="flex items-center gap-4 text-xs text-gray-500">'
              + '<span>使用: ' + inv.used_count + '/' + inv.max_uses + '回</span>'
              + '<span>期限: ' + new Date(inv.expires_at).toLocaleDateString('ja-JP') + '</span>'
              + '<button onclick="deleteInvitation(' + inv.id + ')" class="ml-auto text-red-400 hover:text-red-600">削除</button>'
              + '</div></div>';
          }).join('') + '</div>')
        + '</div>';
    }

    async function createInvitation() {
      var msgEl = document.getElementById('invMsg');
      try {
        var res = await fetch(API + '/admin/invitations', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({
            memo: document.getElementById('inv_memo').value,
            rank: document.getElementById('inv_rank').value,
            max_uses: Number(document.getElementById('inv_max').value) || 1,
            expires_days: Number(document.getElementById('inv_days').value) || 7
          })
        });
        var data = await res.json();
        if (!res.ok) { msgEl.textContent = data.error || '発行失敗'; msgEl.className = 'text-sm text-red-600'; return; }
        showToast('招待リンクを発行しました');
        showInvitePanel(); // リロード
      } catch(e) { msgEl.textContent = 'エラー'; msgEl.className = 'text-sm text-red-600'; }
    }

    function copyInviteUrl(btn, url) {
      navigator.clipboard.writeText(url).then(function() {
        btn.textContent = 'コピー済み';
        btn.className = 'px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded-lg font-medium shrink-0';
        setTimeout(function() { btn.textContent = 'コピー'; btn.className = 'px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-medium shrink-0'; }, 2000);
      });
    }

    async function deleteInvitation(id) {
      if (!confirm('この招待リンクを削除しますか？')) return;
      try {
        var res = await fetch(API + '/admin/invitations/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + authToken } });
        if (res.ok) { showToast('招待リンクを削除しました'); showInvitePanel(); }
      } catch(e) {}
    }

    function showNewPartnerForm() {
      document.getElementById('partnerListView').classList.add('hidden');
      document.getElementById('partnerDetailView').classList.remove('hidden');
      document.getElementById('backToPartnerListBtn').classList.remove('hidden');
      document.getElementById('partnerViewTitle').textContent = '新規パートナー登録';
      document.getElementById('partnerDetailView').innerHTML = '<div class="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">'
        + '<h3 class="font-bold text-sva-dark text-base mb-4">新規パートナーアカウント作成</h3>'
        + '<div class="grid sm:grid-cols-2 gap-4">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">メールアドレス <span class="text-red-500">*</span></label><input id="np_email" type="email" required class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">パスワード <span class="text-red-500">*</span></label><input id="np_password" type="text" required class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="8文字以上"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">会社名</label><input id="np_company" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">担当者名</label><input id="np_name" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">電話</label><input id="np_phone" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">対応エリア</label><input id="np_region" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">専門分野</label><input id="np_specialties" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">ランク</label><select id="np_rank" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"><option value="standard">スタンダード</option><option value="silver">シルバー</option><option value="gold">ゴールド</option><option value="platinum">プラチナ</option></select></div>'
        + '</div>'
        + '<div class="mt-4 border-t border-gray-100 pt-4"><p class="text-xs font-medium text-gray-500 mb-3">住所・インボイス情報</p></div>'
        + '<div class="grid sm:grid-cols-3 gap-4">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">郵便番号</label><input id="np_postal" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="000-0000"></div>'
        + '<div class="sm:col-span-2"><label class="block text-xs font-medium text-gray-600 mb-1">住所</label><input id="np_address" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="都道府県 市区町村 番地 建物名"></div>'
        + '</div>'
        + '<div class="mt-3"><label class="block text-xs font-medium text-gray-600 mb-1">インボイス番号（適格請求書発行事業者登録番号）</label><input id="np_invoice" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="T1234567890123"></div>'
        + '<div class="flex items-center gap-3 mt-5"><button onclick="createPartner()" class="px-6 py-2 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800">登録する</button><span id="npMsg" class="text-sm"></span></div></div>';
    }

    async function createPartner() {
      var email = document.getElementById('np_email').value;
      var pw = document.getElementById('np_password').value;
      if (!email || !pw) { document.getElementById('npMsg').textContent = 'メールとパスワードは必須です'; document.getElementById('npMsg').className = 'text-sm text-red-600'; return; }
      try {
        var res = await fetch(API + '/admin/partners', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({ email: email, password: pw, company_name: document.getElementById('np_company').value, representative_name: document.getElementById('np_name').value, phone: document.getElementById('np_phone').value, region: document.getElementById('np_region').value, specialties: document.getElementById('np_specialties').value, rank: document.getElementById('np_rank').value, postal_code: document.getElementById('np_postal').value, address: document.getElementById('np_address').value, invoice_number: document.getElementById('np_invoice').value })
        });
        var data = await res.json();
        if (!res.ok) { document.getElementById('npMsg').textContent = data.error || '登録失敗'; document.getElementById('npMsg').className = 'text-sm text-red-600'; return; }
        showToast('パートナーを登録しました');
        loadPartners(1);
      } catch(e) { document.getElementById('npMsg').textContent = 'エラー'; document.getElementById('npMsg').className = 'text-sm text-red-600'; }
    }

    // =====================================================
    // JOBS MANAGEMENT
    // =====================================================
    const JOB_STATUS = { 'pending': ['未対応','bg-yellow-50 text-yellow-700 border-yellow-200'], 'accepted': ['受諾','bg-blue-50 text-blue-700 border-blue-200'], 'in_progress': ['対応中','bg-indigo-50 text-indigo-700 border-indigo-200'], 'completed': ['完了','bg-green-50 text-green-700 border-green-200'], 'declined': ['辞退','bg-gray-100 text-gray-500 border-gray-200'], 'cancelled': ['キャンセル','bg-red-50 text-red-600 border-red-200'] };
    const SHIP_S = { 'not_shipped': ['未発送','bg-gray-100 text-gray-500'], 'shipped': ['発送済','bg-orange-50 text-orange-700'], 'received': ['受取済','bg-green-50 text-green-700'] };
    const SCHED_S = { 'not_started': ['未着手','bg-gray-100 text-gray-500'], 'contacting': ['連絡中','bg-blue-50 text-blue-700'], 'waiting_callback': ['折り返し待ち','bg-amber-50 text-amber-700'], 'date_confirmed': ['作業日決定','bg-green-50 text-green-700'] };
    const WORK_S = { 'scheduling': ['日程調整中','bg-blue-50 text-blue-700'], 'completed': ['完了','bg-green-50 text-green-700'], 'user_postponed': ['ユーザー都合延期','bg-amber-50 text-amber-700'], 'self_postponed': ['自己都合延期','bg-orange-50 text-orange-700'], 'maker_postponed': ['メーカー都合延期','bg-purple-50 text-purple-700'], 'cancelled': ['キャンセル','bg-red-50 text-red-600'] };
    let jPage = 1;

    async function loadJobs(page) {
      jPage = page;
      document.getElementById('jobListView').classList.remove('hidden');
      document.getElementById('jobDetailView').classList.add('hidden');
      document.getElementById('backToJobListBtn').classList.add('hidden');
      document.getElementById('jobViewTitle').textContent = '案件一覧';
      var status = document.getElementById('jobStatusFilter').value;
      var search = document.getElementById('jobSearchInput').value.trim();
      var url = API + '/admin/jobs?page=' + page;
      if (status) url += '&status=' + status;
      if (search) url += '&search=' + encodeURIComponent(search);
      try {
        var res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + authToken } });
        var data = await res.json();
        renderJobList(data.jobs, data.pagination);
      } catch(e) { document.getElementById('jobList').innerHTML = '<p class="text-sm text-red-500">読み込み失敗</p>'; }
    }

    function renderJobList(jobs, pag) {
      var el = document.getElementById('jobList');
      if (!jobs || !jobs.length) { el.innerHTML = '<div class="text-center py-16 text-gray-400 text-sm">案件がまだありません</div>'; return; }
      el.innerHTML = jobs.map(function(j) {
        var s = JOB_STATUS[j.status] || ['不明','bg-gray-100 text-gray-500 border-gray-200'];
        var sh = SHIP_S[j.shipping_status] || SHIP_S.not_shipped;
        var sc = SCHED_S[j.schedule_status] || SCHED_S.not_started;
        var wk = WORK_S[j.work_status] || WORK_S.scheduling;
        var date = j.created_at ? new Date(j.created_at).toLocaleDateString('ja-JP') : '-';
        return '<div class="bg-white rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 cursor-pointer" onclick="viewJob(' + j.id + ')">'
          + '<div class="flex items-center gap-4">'
          + '<div class="min-w-0 flex-1">'
          + '<div class="flex items-center gap-2 mb-1.5 flex-wrap"><span class="px-2 py-0.5 text-xs rounded font-medium border ' + s[1] + '">' + s[0] + '</span>'
          + (j.job_number ? '<span class="px-2 py-0.5 text-xs rounded font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">' + esc(j.job_number) + '</span>' : '')
          + '<span class="text-xs text-gray-400">' + esc(j.company_name || '-') + '</span></div>'
          + '<p class="text-sm font-medium text-gray-800 truncate mb-1.5">' + esc(j.title) + '</p>'
          + '<div class="flex items-center gap-1.5 flex-wrap"><span class="px-1.5 py-0.5 text-[10px] rounded font-medium ' + sh[1] + '">製品:' + sh[0] + '</span><span class="px-1.5 py-0.5 text-[10px] rounded font-medium ' + sc[1] + '">日程:' + sc[0] + '</span><span class="px-1.5 py-0.5 text-[10px] rounded font-medium ' + wk[1] + '">作業:' + wk[0] + '</span>'
          + (j.vehicle_count > 0 ? '<span class="px-1.5 py-0.5 text-[10px] rounded font-medium bg-blue-50 text-blue-700">車両 ' + (j.vehicle_done_count||0) + '/' + j.vehicle_count + '台</span>' : '')
          + (j.product_count > 0 ? '<span class="px-1.5 py-0.5 text-[10px] rounded font-medium bg-purple-50 text-purple-700">商品 ' + j.product_count + '点</span>' : '')
          + (j.photo_count > 0 ? '<span class="px-1.5 py-0.5 text-[10px] rounded font-medium bg-emerald-50 text-emerald-700">写真 ' + j.photo_count + '枚</span>' : '')
          + '</div>'
          + '<p class="text-xs text-gray-400 mt-1">' + esc(j.location || '-') + ' ・ ' + esc(j.vehicle_type || '-') + ' ・ ' + date + '</p></div>'
          + '<svg class="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></div></div>';
      }).join('');
      renderPagination('jobPagination', pag, 'loadJobs');
    }

    // ===== 都道府県一覧 =====
    var PREFECTURES = ['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'];

    // ===== 取付製品マスタ (DB連動) =====
    var PRODUCT_MASTER = [];
    var PRODUCT_MASTER_FULL = []; // {id, product_name, model_number, category}

    async function loadProductMasterData() {
      try {
        var res = await fetch(API + '/admin/products?active=1', { headers: { 'Authorization': 'Bearer ' + authToken } });
        var data = await res.json();
        PRODUCT_MASTER_FULL = data.products || [];
        PRODUCT_MASTER = PRODUCT_MASTER_FULL.map(function(p){ return p.product_name; });
      } catch(e) { PRODUCT_MASTER = []; PRODUCT_MASTER_FULL = []; }
    }

    // 車両データ配列
    var njVehicles = [];
    var njVehicleSeq = 0;

    function showNewJobForm() {
      njVehicles = [];
      njVehicleSeq = 0;
      document.getElementById('jobListView').classList.add('hidden');
      document.getElementById('jobDetailView').classList.remove('hidden');
      document.getElementById('backToJobListBtn').classList.remove('hidden');
      document.getElementById('jobViewTitle').textContent = '新規案件作成';

      // パートナー一覧と製品マスタを事前ロード
      loadAllPartners();
      if (PRODUCT_MASTER.length === 0) loadProductMasterData();

      document.getElementById('jobDetailView').innerHTML = '<div class="max-w-3xl">'
        + '<div class="bg-white rounded-xl border border-gray-200 p-6 mb-4">'
        + '<h3 class="font-bold text-sva-dark text-base mb-4">案件依頼を作成</h3>'
        // パートナー選択セクション
        + '<div class="mb-5"><label class="block text-xs font-medium text-gray-600 mb-1">送信先パートナー <span class="text-red-500">*</span></label>'
        + '<div class="grid sm:grid-cols-2 gap-2 mb-2">'
        + '<div><label class="block text-[10px] text-gray-400 mb-0.5">都道府県で絞り込み</label><select id="nj_pref_filter" onchange="filterPartnerDropdown()" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-sva-red"><option value="">すべての地域</option>' + PREFECTURES.map(function(p){return '<option value="'+p+'">'+p+'</option>';}).join('') + '</select></div>'
        + '<div><label class="block text-[10px] text-gray-400 mb-0.5">テキスト検索</label><input id="nj_partner_text" oninput="filterPartnerDropdown()" placeholder="会社名・担当者名で検索..." class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '</div>'
        + '<select id="nj_partner_select" onchange="onPartnerSelect()" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-sva-red mb-1"><option value="">パートナーを選択してください...</option></select>'
        + '<input type="hidden" id="nj_partner_id" value="">'
        + '<p id="njSelectedPartner" class="text-sm text-sva-red font-medium"></p>'
        + '<p id="njPartnerCount" class="text-[10px] text-gray-400"></p></div>'
        // 基本情報
        + '<div class="space-y-4">'
        + '<div class="grid sm:grid-cols-2 gap-4">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">案件名 <span class="text-red-500">*</span></label><input id="nj_title" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="例: フォークリフトAIカメラ取付 10台"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">案件No</label><input id="nj_job_number" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-sva-red" placeholder="例: SVA-2026-0003"></div>'
        + '</div>'
        + '<div class="grid sm:grid-cols-2 gap-4">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">車両タイプ</label><input id="nj_vehicle" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="フォークリフト"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">取付装置</label><input id="nj_device" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="人検知AIカメラ"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">作業場所</label><input id="nj_location" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="大阪府大阪市"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">希望日程</label><input id="nj_date" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="2026年4月中旬希望"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">予算</label><input id="nj_budget" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="¥500,000"></div>'
        + '</div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">詳細説明</label><textarea id="nj_desc" rows="3" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" placeholder="案件の詳細..."></textarea></div>'
        + '</div></div>'

        // 車両セクション
        + '<div class="bg-white rounded-xl border border-blue-200 p-6 mb-4">'
        + '<div class="flex items-center justify-between mb-4">'
        + '<h4 class="text-sm font-bold text-sva-dark flex items-center gap-2"><svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>車両明細 <span id="njVehicleBadge" class="px-2 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded-full font-bold">0台</span></h4>'
        + '<button onclick="addNjVehicle()" class="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>車両を追加</button>'
        + '</div>'
        + '<p class="text-[10px] text-gray-400 mb-3">1ユーザー様が複数台お持ちの場合は、車両ごとにカードを追加してください。各車両ごとに取付製品を設定できます。</p>'
        + '<div id="njVehicleList" class="space-y-3"></div>'
        + '<div id="njNoVehicles" class="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl"><p class="text-sm text-gray-400">車両がまだ追加されていません</p><button onclick="addNjVehicle()" class="mt-2 px-4 py-1.5 text-xs text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">+ 最初の車両を追加</button></div>'
        + '</div>'

        // お客様詳細情報セクション
        + '<div class="bg-white rounded-xl border border-orange-200 p-6 mb-4">'
        + '<h4 class="text-sm font-bold text-sva-dark mb-3 flex items-center gap-2"><svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>お客様詳細情報 <span class="text-[10px] text-orange-500 font-normal">※受諾後にパートナーへ開示</span></h4>'
        + '<div class="grid sm:grid-cols-2 gap-3">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">会社名</label><input id="nj_client_company" class="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-orange-50/30" placeholder="株式会社〇〇物流"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">支店名</label><input id="nj_client_branch" class="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-orange-50/30" placeholder="堺営業所"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">担当者名</label><input id="nj_client_contact" class="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-orange-50/30" placeholder="田中太郎"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">打合せ連絡先（電話）</label><input id="nj_client_phone" class="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-orange-50/30" placeholder="072-XXX-XXXX"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">連絡先（メール）</label><input id="nj_client_email" class="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-orange-50/30" placeholder="tanaka@example.co.jp"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">作業場所（詳細住所）</label><input id="nj_work_location" class="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-orange-50/30" placeholder="大阪府堺市中区〇〇町1-2-3"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">作業希望日時</label><input id="nj_work_datetime" class="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-orange-50/30" placeholder="2026年4月15日 09:00〜17:00"></div>'
        + '</div>'
        + '<div class="mt-3"><label class="block text-xs font-medium text-gray-600 mb-1">受諾後 即連絡メモ</label><textarea id="nj_urgent_note" rows="2" class="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm resize-none bg-orange-50/30" placeholder="受諾後、48時間以内にお客様担当者へ電話連絡してください"></textarea></div>'
        + '</div>'

        // 取付製品（準備区分）
        + '<div class="bg-white rounded-xl border border-gray-200 p-6 mb-4">'
        + '<h4 class="text-sm font-bold text-sva-dark mb-3">取付製品（準備区分）</h4>'
        + '<div class="grid sm:grid-cols-2 gap-3">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">メーカー準備</label><textarea id="nj_prod_maker" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" placeholder="AIカメラ FLC-1 x5台"></textarea></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">お客様準備</label><textarea id="nj_prod_customer" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" placeholder="取付ステー"></textarea></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">公認パートナー準備</label><textarea id="nj_prod_partner" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" placeholder="配線部材一式"></textarea></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">現地調達</label><textarea id="nj_prod_local" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" placeholder="なし"></textarea></div>'
        + '</div></div>'

        // 費用セクション
        + '<div class="bg-white rounded-xl border border-gray-200 p-6 mb-4">'
        + '<h4 class="text-sm font-bold text-sva-dark mb-3">費用情報 <span class="text-[10px] text-gray-400 font-normal">※税抜金額を入力（表示時に10%加算）</span></h4>'
        + '<div class="grid sm:grid-cols-4 gap-3">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">推定希望工賃</label><input id="nj_cost_labor" type="number" min="0" step="1" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="250000"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">出張費用</label><input id="nj_cost_travel" type="number" min="0" step="1" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="35000"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">その他費用</label><input id="nj_cost_other" type="number" min="0" step="1" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="5000"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">事前打合せ工賃</label><input id="nj_cost_prelim" type="number" min="0" step="1" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="15000"></div>'
        + '</div>'
        + '<div class="mt-3"><label class="block text-xs font-medium text-gray-600 mb-1">費用メモ</label><textarea id="nj_cost_memo" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" placeholder="備考..."></textarea></div>'
        + '</div>'

        // 送信ボタン
        + '<div class="bg-white rounded-xl border border-gray-200 p-6">'
        + '<div class="flex items-center gap-3"><button onclick="createJob()" class="px-8 py-2.5 bg-sva-red text-white text-sm font-bold rounded-lg hover:bg-red-800">案件を送信</button><span id="njMsg" class="text-sm"></span></div>'
        + '</div></div>';
      renderNjVehicles();
    }

    // パートナー全一覧データ
    var allPartnersData = [];

    async function loadAllPartners() {
      try {
        var res = await fetch(API + '/admin/partners/all', { headers: { 'Authorization': 'Bearer ' + authToken } });
        var data = await res.json();
        allPartnersData = data.partners || [];
        filterPartnerDropdown();
      } catch(e) { allPartnersData = []; }
    }

    function filterPartnerDropdown() {
      var pref = (document.getElementById('nj_pref_filter')||{}).value || '';
      var text = ((document.getElementById('nj_partner_text')||{}).value || '').toLowerCase();
      var filtered = allPartnersData.filter(function(p) {
        if (pref && (!p.region || p.region.indexOf(pref) === -1)) return false;
        if (text && (p.company_name||'').toLowerCase().indexOf(text) === -1 && (p.representative_name||'').toLowerCase().indexOf(text) === -1) return false;
        return true;
      });
      var sel = document.getElementById('nj_partner_select');
      if (!sel) return;
      var currentVal = document.getElementById('nj_partner_id').value;
      sel.innerHTML = '<option value="">パートナーを選択してください... (' + filtered.length + '件)</option>'
        + filtered.map(function(p) {
          var region = p.region ? ' [' + p.region + ']' : '';
          return '<option value="' + p.id + '"' + (String(p.id) === currentVal ? ' selected' : '') + '>' + esc(p.company_name||'-') + ' / ' + esc(p.representative_name||'-') + region + ' (' + esc(p.email) + ')</option>';
        }).join('');
      var countEl = document.getElementById('njPartnerCount');
      if (countEl) countEl.textContent = filtered.length + '件のパートナーが該当' + (pref ? ' (' + pref + ')' : '');
    }

    function onPartnerSelect() {
      var sel = document.getElementById('nj_partner_select');
      var pid = sel.value;
      document.getElementById('nj_partner_id').value = pid;
      if (pid) {
        var p = allPartnersData.find(function(x){return String(x.id) === pid;});
        document.getElementById('njSelectedPartner').textContent = p ? '選択: ' + (p.company_name||'-') + ' / ' + (p.representative_name||'-') : '';
      } else {
        document.getElementById('njSelectedPartner').textContent = '';
      }
    }

    // ===== 車両管理 =====
    function addNjVehicle() {
      njVehicleSeq++;
      njVehicles.push({ _id: njVehicleSeq, maker_name: '', car_model: '', car_model_code: '', vehicle_memo: '', products: [] });
      renderNjVehicles();
    }

    function removeNjVehicle(vid) {
      njVehicles = njVehicles.filter(function(v){return v._id !== vid;});
      renderNjVehicles();
    }

    function duplicateNjVehicle(vid) {
      var src = njVehicles.find(function(v){return v._id === vid;});
      if (!src) return;
      njVehicleSeq++;
      njVehicles.push({ _id: njVehicleSeq, maker_name: src.maker_name, car_model: src.car_model, car_model_code: src.car_model_code, vehicle_memo: src.vehicle_memo, products: src.products.map(function(p){return {product_name:p.product_name,quantity:p.quantity};}) });
      renderNjVehicles();
    }

    function addNjProduct(vid) {
      var v = njVehicles.find(function(x){return x._id === vid;});
      if (!v) return;
      v.products.push({ product_name: '', quantity: 1 });
      renderNjVehicles();
    }

    function removeNjProduct(vid, pidx) {
      var v = njVehicles.find(function(x){return x._id === vid;});
      if (!v) return;
      v.products.splice(pidx, 1);
      renderNjVehicles();
    }

    function syncNjVehicleData() {
      njVehicles.forEach(function(v) {
        var mk = document.getElementById('nv_maker_'+v._id); if(mk) v.maker_name = mk.value;
        var md = document.getElementById('nv_model_'+v._id); if(md) v.car_model = md.value;
        var cd = document.getElementById('nv_code_'+v._id); if(cd) v.car_model_code = cd.value;
        var me = document.getElementById('nv_memo_'+v._id); if(me) v.vehicle_memo = me.value;
        v.products.forEach(function(p, idx) {
          var pn = document.getElementById('nvp_name_'+v._id+'_'+idx); if(pn) p.product_name = pn.value;
          var pq = document.getElementById('nvp_qty_'+v._id+'_'+idx); if(pq) p.quantity = Number(pq.value)||1;
        });
      });
    }

    function renderNjVehicles() {
      var el = document.getElementById('njVehicleList');
      var noEl = document.getElementById('njNoVehicles');
      var badge = document.getElementById('njVehicleBadge');
      if (!el) return;
      if (badge) badge.textContent = njVehicles.length + '台';
      if (njVehicles.length === 0) { el.innerHTML = ''; if(noEl)noEl.classList.remove('hidden'); return; }
      if(noEl)noEl.classList.add('hidden');
      el.innerHTML = njVehicles.map(function(v, idx) {
        var prodOpts = '<option value="">-- 製品を選択 --</option>' + PRODUCT_MASTER.map(function(p){return '<option value="'+esc(p)+'">'+esc(p)+'</option>';}).join('');
        var prodHtml = v.products.map(function(p, pidx) {
          return '<div class="flex items-center gap-2 mb-1.5">'
            + '<select id="nvp_name_'+v._id+'_'+pidx+'" class="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-400">' + PRODUCT_MASTER.map(function(pm){return '<option value="'+esc(pm)+'"'+(pm===p.product_name?' selected':'')+'>'+esc(pm)+'</option>';}).join('') + '<option value="">-- その他（手入力） --</option></select>'
            + '<input type="number" id="nvp_qty_'+v._id+'_'+pidx+'" value="'+p.quantity+'" min="1" class="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-center" placeholder="数量">'
            + '<button onclick="syncNjVehicleData();removeNjProduct('+v._id+','+pidx+')" class="text-red-400 hover:text-red-600 text-xs px-1">✕</button></div>';
        }).join('');

        return '<div class="bg-blue-50/50 rounded-xl border border-blue-100 p-4">'
          + '<div class="flex items-center gap-2 mb-3">'
          + '<span class="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">' + (idx+1) + '</span>'
          + '<span class="text-sm font-bold text-sva-dark flex-1">車両 #' + (idx+1) + '</span>'
          + '<button onclick="syncNjVehicleData();duplicateNjVehicle('+v._id+')" class="px-2 py-1 text-[10px] text-blue-600 bg-blue-100 rounded hover:bg-blue-200" title="複製">複製</button>'
          + '<button onclick="syncNjVehicleData();removeNjVehicle('+v._id+')" class="px-2 py-1 text-[10px] text-red-500 bg-red-50 rounded hover:bg-red-100">削除</button>'
          + '</div>'
          + '<div class="grid grid-cols-3 gap-2 mb-3">'
          + '<div><label class="block text-[10px] text-gray-500 mb-0.5">メーカー</label><input id="nv_maker_'+v._id+'" value="'+esc(v.maker_name)+'" class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-400" placeholder="トヨタ"></div>'
          + '<div><label class="block text-[10px] text-gray-500 mb-0.5">車種</label><input id="nv_model_'+v._id+'" value="'+esc(v.car_model)+'" class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-400" placeholder="8FBN25"></div>'
          + '<div><label class="block text-[10px] text-gray-500 mb-0.5">型式</label><input id="nv_code_'+v._id+'" value="'+esc(v.car_model_code)+'" class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-400" placeholder="8FBN25-60001"></div>'
          + '</div>'
          + '<div class="mb-3"><label class="block text-[10px] text-gray-500 mb-0.5">メモ</label><input id="nv_memo_'+v._id+'" value="'+esc(v.vehicle_memo)+'" class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-400" placeholder="特記事項（任意）"></div>'
          + '<div class="bg-white rounded-lg border border-gray-100 p-3">'
          + '<div class="flex items-center justify-between mb-2"><span class="text-[10px] font-bold text-gray-500 uppercase">取付製品</span><button onclick="syncNjVehicleData();addNjProduct('+v._id+')" class="px-2 py-0.5 text-[10px] text-purple-600 bg-purple-50 rounded hover:bg-purple-100">+ 製品追加</button></div>'
          + (prodHtml || '<p class="text-[10px] text-gray-400 text-center py-2">製品未追加</p>')
          + '</div></div>';
      }).join('');
    }

    async function createJob() {
      syncNjVehicleData();
      var pid = document.getElementById('nj_partner_id').value;
      var title = document.getElementById('nj_title').value;
      if (!pid || !title) { document.getElementById('njMsg').textContent = 'パートナーと案件名は必須です'; document.getElementById('njMsg').className = 'text-sm text-red-600'; return; }

      // Build vehicles payload
      var vehiclesPayload = njVehicles.map(function(v) {
        return {
          maker_name: v.maker_name, car_model: v.car_model, car_model_code: v.car_model_code, vehicle_memo: v.vehicle_memo,
          products: v.products.filter(function(p){return p.product_name;}).map(function(p){return {product_name:p.product_name,quantity:p.quantity||1};})
        };
      });

      try {
        var res = await fetch(API + '/admin/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({
            partner_id: Number(pid), title: title, description: document.getElementById('nj_desc').value,
            vehicle_type: document.getElementById('nj_vehicle').value, device_type: document.getElementById('nj_device').value,
            location: document.getElementById('nj_location').value, preferred_date: document.getElementById('nj_date').value,
            budget: document.getElementById('nj_budget').value, job_number: document.getElementById('nj_job_number').value,
            client_company: document.getElementById('nj_client_company').value, client_branch: document.getElementById('nj_client_branch').value,
            client_contact_name: document.getElementById('nj_client_contact').value, client_contact_phone: document.getElementById('nj_client_phone').value,
            client_contact_email: document.getElementById('nj_client_email').value, work_location_detail: document.getElementById('nj_work_location').value,
            work_datetime: document.getElementById('nj_work_datetime').value, urgent_contact_note: document.getElementById('nj_urgent_note').value,
            products_maker: document.getElementById('nj_prod_maker').value, products_customer: document.getElementById('nj_prod_customer').value,
            products_partner: document.getElementById('nj_prod_partner').value, products_local: document.getElementById('nj_prod_local').value,
            cost_labor: Number(document.getElementById('nj_cost_labor').value)||0, cost_travel: Number(document.getElementById('nj_cost_travel').value)||0,
            cost_other: Number(document.getElementById('nj_cost_other').value)||0, cost_preliminary: Number(document.getElementById('nj_cost_prelim').value)||0,
            cost_memo: document.getElementById('nj_cost_memo').value,
            vehicles: vehiclesPayload
          })
        });
        var data = await res.json();
        if (!res.ok) { document.getElementById('njMsg').textContent = data.error || '作成失敗'; document.getElementById('njMsg').className = 'text-sm text-red-600'; return; }
        showToast('案件を送信しました（パートナーに通知済み）' + (vehiclesPayload.length > 0 ? ' 車両' + vehiclesPayload.length + '台登録' : ''));
        loadJobs(1);
      } catch(e) { document.getElementById('njMsg').textContent = 'エラー'; document.getElementById('njMsg').className = 'text-sm text-red-600'; }
    }

    var currentJobData = null;
    var currentJobVehicles = [];
    var currentVehicleId = null;
    var currentJobAttachments = [];

    async function viewJob(id) {
      document.getElementById('jobListView').classList.add('hidden');
      document.getElementById('jobDetailView').classList.remove('hidden');
      document.getElementById('backToJobListBtn').classList.remove('hidden');
      document.getElementById('jobViewTitle').textContent = '案件詳細';
      var dv = document.getElementById('jobDetailView');
      dv.innerHTML = '<div class="flex items-center justify-center py-12"><div class="w-6 h-6 border-2 border-sva-red border-t-transparent rounded-full animate-spin"></div></div>';
      try {
        var res = await fetch(API + '/admin/jobs/' + id, { headers: { 'Authorization': 'Bearer ' + authToken } });
        var data = await res.json();
        if (!data.job) { dv.innerHTML = '<p class="text-sm text-red-500">案件が見つかりません</p>'; return; }
        currentJobData = data.job;
        currentJobVehicles = data.vehicles || [];
        currentJobAttachments = data.attachments || [];
        currentVehicleId = null;
        renderJobDetail(data.job, data.vehicles || [], data.photos || []);
      } catch(e) { dv.innerHTML = '<p class="text-sm text-red-500">読み込み失敗</p>'; }
    }

    var PHOTO_CATS = {
      'caution_plate': 'コーションプレート', 'pre_install': '取付前製品', 'power_source': '電源取得箇所',
      'ground_point': 'アース取得箇所', 'completed': '取付完了写真',
      'claim_caution_plate': 'コーションプレート(クレーム)', 'claim_fault': '故障原因箇所(不良個所)', 'claim_repair': '修理内容', 'other': 'その他'
    };
    var PHOTO_CATS_ARR = [['caution_plate','コーションプレート'],['pre_install','取付前製品'],['power_source','電源取得箇所'],['ground_point','アース取得箇所'],['completed','取付完了写真'],['claim_caution_plate','コーションプレート(クレーム)'],['claim_fault','故障原因箇所'],['claim_repair','修理内容'],['other','その他']];
    var VEH_STATUS = { 'pending': ['未着手','bg-gray-100 text-gray-500 border-gray-200'], 'in_progress': ['作業中','bg-blue-50 text-blue-700 border-blue-200'], 'completed': ['完了','bg-green-50 text-green-700 border-green-200'], 'issue': ['問題あり','bg-red-50 text-red-600 border-red-200'] };

    var activeJobTab = 'overview';

    function renderJobDetail(j, vehicles, legacyPhotos) {
      var s = JOB_STATUS[j.status] || ['不明','bg-gray-100 text-gray-500 border-gray-200'];
      var vCount = vehicles.length;
      var vDone = vehicles.filter(function(v){return v.status==='completed'}).length;
      var totalProducts = 0; vehicles.forEach(function(v){totalProducts += (v.products||[]).length;});
      var totalPhotos = 0; vehicles.forEach(function(v){var pc=v.photo_counts||{}; Object.values(pc).forEach(function(n){totalPhotos+=n;});}); totalPhotos += (legacyPhotos||[]).length;

      var dv = document.getElementById('jobDetailView');
      dv.innerHTML = ''
        // Header
        + '<div class="bg-white rounded-xl border border-gray-200 p-5 mb-0">'
        + '<div class="flex items-center gap-2 mb-2"><span class="px-2 py-0.5 text-xs rounded font-medium border ' + s[1] + '">' + s[0] + '</span>'
        + (j.job_number ? '<span class="px-2 py-0.5 text-xs rounded font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">' + esc(j.job_number) + '</span>' : '<span class="px-2 py-0.5 text-[10px] rounded bg-gray-50 text-gray-400 border border-gray-200">案件No未設定</span>')
        + '<span class="text-xs text-gray-400">ID: ' + j.id + '</span></div>'
        + '<h3 class="text-lg font-bold text-sva-dark">' + esc(j.title) + '</h3>'
        + '<p class="text-sm text-gray-500 mt-1">' + esc(j.company_name||'-') + ' / ' + esc(j.representative_name||'-') + '</p>'
        + '<div class="flex items-center gap-2 mt-3 flex-wrap">'
        + (vCount > 0 ? '<span class="px-2 py-1 text-xs rounded-lg font-medium bg-blue-50 text-blue-700">車両 ' + vDone + '/' + vCount + '台完了</span>' : '')
        + (totalProducts > 0 ? '<span class="px-2 py-1 text-xs rounded-lg font-medium bg-purple-50 text-purple-700">商品 ' + totalProducts + '点</span>' : '')
        + (totalPhotos > 0 ? '<span class="px-2 py-1 text-xs rounded-lg font-medium bg-emerald-50 text-emerald-700">写真 ' + totalPhotos + '枚</span>' : '')
        + '</div></div>'
        // Tabs - 5タブ構成（案件概要・お客様情報・車両明細・トラッキング・写真）
        + '<div class="bg-white border border-gray-200 border-t-0">'
        + '<div class="subtab-scroll"><div class="flex items-center gap-0 px-2">'
        + '<button onclick="switchJobTab(\\'overview\\')" id="jtab_overview" class="px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap flex-shrink-0 ' + (activeJobTab==='overview'?'border-sva-red text-sva-red':'border-transparent text-gray-500') + '">案件概要</button>'
        + '<button onclick="switchJobTab(\\'client\\')" id="jtab_client" class="px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap flex-shrink-0 ' + (activeJobTab==='client'?'border-sva-red text-sva-red':'border-transparent text-gray-500') + '">お客様</button>'
        + '<button onclick="switchJobTab(\\'vehicles\\')" id="jtab_vehicles" class="px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap flex-shrink-0 ' + (activeJobTab==='vehicles'?'border-sva-red text-sva-red':'border-transparent text-gray-500') + '">車両 <span class="ml-1 px-1.5 py-0.5 bg-sva-red text-white text-[10px] rounded-full font-bold">' + vCount + '</span></button>'
        + '<button onclick="switchJobTab(\\'tracking\\')" id="jtab_tracking" class="px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap flex-shrink-0 ' + (activeJobTab==='tracking'?'border-sva-red text-sva-red':'border-transparent text-gray-500') + '">追跡</button>'
        + '<button onclick="switchJobTab(\\'photos\\')" id="jtab_photos" class="px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap flex-shrink-0 ' + (activeJobTab==='photos'?'border-sva-red text-sva-red':'border-transparent text-gray-500') + '">写真 <span class="ml-1 px-1.5 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded-full font-bold">' + totalPhotos + '</span></button>'
        + '</div></div></div>'
        + '<div class="bg-white border border-gray-200 border-t-0 rounded-b-xl p-6" id="jobTabContent"></div>';
      switchJobTab(activeJobTab);
    }

    function switchJobTab(tab) {
      activeJobTab = tab;
      ['overview','client','vehicles','tracking','photos'].forEach(function(t) {
        var btn = document.getElementById('jtab_'+t);
        if (btn) { if(t===tab){btn.className='px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap flex-shrink-0 border-sva-red text-sva-red';}else{btn.className='px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap flex-shrink-0 border-transparent text-gray-500';}}
      });
      // Auto-scroll active sub-tab into view
      var activeBtn = document.getElementById('jtab_'+tab);
      if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      var ct = document.getElementById('jobTabContent');
      if (!ct || !currentJobData) return;
      if (tab==='overview') renderOverviewTab(ct);
      else if (tab==='client') renderClientTab(ct);
      else if (tab==='vehicles') { if(currentVehicleId) renderVehicleDetailView(ct); else renderVehiclesTab(ct); }
      else if (tab==='tracking') renderTrackingTab(ct);
      else if (tab==='photos') renderPhotosTab(ct);
    }

    // ===== Overview Tab（案件概要 - 基本情報のみ、重複排除）=====
    function renderOverviewTab(ct) {
      var j = currentJobData;
      var vCount = currentJobVehicles.length;
      var vDone = currentJobVehicles.filter(function(v){return v.status==='completed'}).length;

      ct.innerHTML = ''
        // 案件基本情報（編集フィールド）
        + '<div class="mb-5">'
        + '<h4 class="text-sm font-bold text-sva-dark mb-3">案件基本情報</h4>'
        + '<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">'
        + '<div class="sm:col-span-2"><label class="block text-xs text-gray-400 mb-1">案件No <span class="text-indigo-500 font-bold">*請求管理用</span></label><input id="aj_job_number" type="text" value="' + esc(j.job_number||'') + '" class="w-full px-2.5 py-1.5 border border-indigo-200 rounded-lg text-sm font-mono font-bold focus:outline-none focus:border-sva-red bg-indigo-50/50" placeholder="例: SVA-2026-0001"></div>'
        + '<div><label class="block text-xs text-gray-400 mb-1">車両タイプ</label><p class="font-medium px-2.5 py-1.5 bg-gray-50 rounded-lg">' + esc(j.vehicle_type||'-') + '</p></div>'
        + '<div><label class="block text-xs text-gray-400 mb-1">取付装置</label><p class="font-medium px-2.5 py-1.5 bg-gray-50 rounded-lg">' + esc(j.device_type||'-') + '</p></div>'
        + '<div><label class="block text-xs text-gray-400 mb-1">作業場所</label><p class="font-medium px-2.5 py-1.5 bg-gray-50 rounded-lg">' + esc(j.location||'-') + '</p></div>'
        + '<div><label class="block text-xs text-gray-400 mb-1">希望日程</label><p class="font-medium px-2.5 py-1.5 bg-gray-50 rounded-lg">' + esc(j.preferred_date||'-') + '</p></div>'
        + '<div><label class="block text-xs text-gray-400 mb-1">予算</label><p class="font-medium px-2.5 py-1.5 bg-gray-50 rounded-lg">' + esc(j.budget||'-') + '</p></div>'
        + '<div><label class="block text-xs text-gray-400 mb-1">作成日</label><p class="font-medium px-2.5 py-1.5 bg-gray-50 rounded-lg text-xs">' + fmtDt(j.created_at) + '</p></div>'
        + '</div></div>'

        // 詳細説明
        + (j.description ? '<div class="mb-5"><label class="block text-xs text-gray-400 mb-1">詳細説明</label><div class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-line">' + esc(j.description) + '</div></div>' : '')

        // 作業報告（パートナー記入 - 読み取り専用）
        + '<div class="mb-5"><label class="block text-xs text-gray-400 mb-1">作業報告（パートナー記入）</label><div class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-line min-h-[40px]">' + esc(j.work_report||'未記入') + '</div></div>'

        // メモ（読み取り専用）
        + '<div class="mb-5"><label class="block text-xs text-gray-400 mb-1">メモ</label><div class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-line min-h-[30px]">' + esc(j.general_memo||'未記入') + '</div></div>'

        // 案件No保存ボタン
        + '<div class="flex items-center gap-3 mb-5"><button onclick="saveJobOverview(' + j.id + ')" class="px-5 py-2 bg-sva-dark text-white text-sm font-medium rounded-lg hover:bg-gray-800">案件Noを保存</button><span id="ajoMsg" class="text-sm"></span></div>'

        // 車両進捗サマリー
        + (vCount > 0
          ? '<div class="bg-blue-50 rounded-xl p-4 border border-blue-100"><h4 class="text-sm font-bold text-sva-dark mb-3">車両進捗サマリー</h4>'
            + '<div class="grid grid-cols-' + Math.min(vCount,5) + ' gap-2">' + currentJobVehicles.map(function(v){
              var vs = VEH_STATUS[v.status]||VEH_STATUS.pending;
              return '<div class="bg-white rounded-lg p-3 border border-white shadow-sm"><p class="text-[10px] text-gray-400">#' + v.seq + '</p><p class="text-xs font-bold text-gray-800 truncate">' + esc(v.maker_name) + ' ' + esc(v.car_model) + '</p><span class="inline-block mt-1 px-1.5 py-0.5 text-[10px] rounded font-medium border ' + vs[1] + '">' + vs[0] + '</span></div>';
            }).join('') + '</div><div class="mt-2 text-right"><button onclick="switchJobTab(\\'vehicles\\')" class="text-xs text-blue-700 font-medium hover:underline">車両明細を開く →</button></div></div>'
          : '');
    }

    // ===== Client Tab（お客様情報 - 連絡先・費用・製品・添付）=====
    function renderClientTab(ct) {
      var j = currentJobData;
      var costSub = (j.cost_labor||0) + (j.cost_travel||0) + (j.cost_other||0) + (j.cost_preliminary||0);
      var costTotal = Math.round(costSub * 1.1);

      ct.innerHTML = ''
        // お客様連絡先
        + '<div class="rounded-xl border border-orange-200 bg-orange-50/20 p-5 mb-5">'
        + '<h4 class="text-sm font-bold text-sva-dark mb-3 flex items-center gap-2"><svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>お客様連絡先 <span class="text-[10px] text-orange-500 font-normal">※受諾後にパートナーへ開示</span></h4>'
        + '<div class="grid sm:grid-cols-2 gap-3">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">会社名</label><input id="aj_client_company" type="text" value="' + esc(j.client_company||'') + '" class="w-full px-2.5 py-1.5 border border-orange-200 rounded-lg text-sm focus:outline-none focus:border-sva-red bg-white" placeholder="株式会社〇〇物流"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">支店名</label><input id="aj_client_branch" type="text" value="' + esc(j.client_branch||'') + '" class="w-full px-2.5 py-1.5 border border-orange-200 rounded-lg text-sm focus:outline-none focus:border-sva-red bg-white" placeholder="堺営業所"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">担当者名</label><input id="aj_client_contact_name" type="text" value="' + esc(j.client_contact_name||'') + '" class="w-full px-2.5 py-1.5 border border-orange-200 rounded-lg text-sm focus:outline-none focus:border-sva-red bg-white" placeholder="田中太郎"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">打合せ連絡先（電話）</label><input id="aj_client_phone" type="text" value="' + esc(j.client_contact_phone||'') + '" class="w-full px-2.5 py-1.5 border border-orange-200 rounded-lg text-sm focus:outline-none focus:border-sva-red bg-white" placeholder="072-XXX-XXXX"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">連絡先（メール）</label><input id="aj_client_email" type="text" value="' + esc(j.client_contact_email||'') + '" class="w-full px-2.5 py-1.5 border border-orange-200 rounded-lg text-sm focus:outline-none focus:border-sva-red bg-white" placeholder="tanaka@example.co.jp"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">作業場所（詳細住所）</label><input id="aj_work_location_detail" type="text" value="' + esc(j.work_location_detail||'') + '" class="w-full px-2.5 py-1.5 border border-orange-200 rounded-lg text-sm focus:outline-none focus:border-sva-red bg-white" placeholder="大阪府堺市中区〇〇町1-2-3"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">作業希望日時</label><input id="aj_work_datetime" type="text" value="' + esc(j.work_datetime||'') + '" class="w-full px-2.5 py-1.5 border border-orange-200 rounded-lg text-sm focus:outline-none focus:border-sva-red bg-white" placeholder="2026年4月15日 09:00〜17:00"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">車両台数</label><input id="aj_vehicle_count" type="number" value="' + (j.vehicle_count||0) + '" class="w-full px-2.5 py-1.5 border border-orange-200 rounded-lg text-sm focus:outline-none focus:border-sva-red bg-white" placeholder="5"></div>'
        + '</div>'
        + '<div class="mt-3"><label class="block text-xs font-medium text-gray-600 mb-1">受諾後 即連絡メモ</label><textarea id="aj_urgent_note" rows="2" class="w-full px-2.5 py-1.5 border border-orange-200 rounded-lg text-sm resize-none focus:outline-none focus:border-sva-red bg-white" placeholder="受諾後、48時間以内にお客様担当者へ電話連絡してください">' + esc(j.urgent_contact_note||'') + '</textarea></div>'
        + '</div>'

        // 取付製品（準備区分）
        + '<div class="rounded-xl border border-gray-200 p-5 mb-5">'
        + '<h4 class="text-sm font-bold text-sva-dark mb-3">取付製品（準備区分）</h4>'
        + '<div class="grid sm:grid-cols-2 gap-3">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">メーカー準備</label><textarea id="aj_prod_maker" rows="2" class="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-sva-red" placeholder="AIカメラ FLC-1 x5台">' + esc(j.products_maker||'') + '</textarea></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">お客様準備</label><textarea id="aj_prod_customer" rows="2" class="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-sva-red" placeholder="取付ステー">' + esc(j.products_customer||'') + '</textarea></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">公認パートナー準備</label><textarea id="aj_prod_partner" rows="2" class="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-sva-red" placeholder="配線部材一式">' + esc(j.products_partner||'') + '</textarea></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">現地調達</label><textarea id="aj_prod_local" rows="2" class="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-sva-red" placeholder="なし">' + esc(j.products_local||'') + '</textarea></div>'
        + '</div></div>'

        // 費用情報
        + '<div class="rounded-xl border border-gray-200 p-5 mb-5">'
        + '<h4 class="text-sm font-bold text-sva-dark mb-3">費用情報 <span class="text-[10px] text-gray-400 font-normal">※税抜金額を入力（パートナーには10%加算で表示）</span></h4>'
        + '<div class="grid sm:grid-cols-4 gap-3">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">推定希望工賃</label><input id="aj_cost_labor" type="number" value="' + (j.cost_labor||0) + '" class="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="250000"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">出張費用</label><input id="aj_cost_travel" type="number" value="' + (j.cost_travel||0) + '" class="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="35000"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">その他費用</label><input id="aj_cost_other" type="number" value="' + (j.cost_other||0) + '" class="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="5000"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">事前打合せ工賃</label><input id="aj_cost_prelim" type="number" value="' + (j.cost_preliminary||0) + '" class="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="15000"></div>'
        + '</div>'
        + (costSub > 0 ? '<div class="mt-2 text-right text-sm"><span class="text-gray-500">税抜合計 ¥' + costSub.toLocaleString() + '</span> → <span class="font-bold text-orange-700">税込(10%) ¥' + costTotal.toLocaleString() + '</span></div>' : '')
        + '<div class="mt-3"><label class="block text-xs font-medium text-gray-600 mb-1">費用メモ</label><textarea id="aj_cost_memo" rows="2" class="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-sva-red" placeholder="備考...">' + esc(j.cost_memo||'') + '</textarea></div>'
        + '</div>'

        // 保存ボタン
        + '<div class="flex items-center gap-3 mb-5"><button onclick="saveJobDetails(' + j.id + ')" class="px-5 py-2 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800">お客様情報を保存</button><span id="ajdMsg" class="text-sm"></span></div>'

        // 添付ファイル
        + '<div class="rounded-xl border border-gray-200 p-5">'
        + '<div class="flex items-center justify-between mb-3"><h4 class="text-sm font-bold text-sva-dark"><svg class="w-4 h-4 inline mr-1 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/></svg>添付ファイル（取付マニュアル等）</h4>'
        + '<label class="px-3 py-1.5 bg-sva-red text-white text-xs font-medium rounded-lg hover:bg-red-800 cursor-pointer"><svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>PDF添付<input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" class="hidden" onchange="uploadJobAttachment(' + j.id + ',this)"></label></div>'
        + '<div id="attachmentsList">' + renderAttachmentsList(currentJobAttachments) + '</div></div>';
    }

    // ===== Vehicles Tab =====
    function renderVehiclesTab(ct) {
      var vehicles = currentJobVehicles;
      var vDone = vehicles.filter(function(v){return v.status==='completed'}).length;
      var progress = vehicles.length > 0 ? Math.round(vDone/vehicles.length*100) : 0;

      ct.innerHTML = '<div class="flex items-center gap-4 mb-5">'
        + '<div class="flex-1"><div class="flex items-center justify-between mb-1"><span class="text-sm font-bold text-sva-dark">車両明細</span><span class="text-xs text-gray-500">' + vDone + '/' + vehicles.length + '台完了 (' + progress + '%)</span></div>'
        + '<div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-green-500 h-2 rounded-full" style="width:' + progress + '%"></div></div></div>'
        + '<button onclick="addVehiclePrompt()" class="px-4 py-2 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 shrink-0">+ 車両追加</button>'
        + '</div>'
        + '<div class="space-y-3">' + vehicles.map(function(v) {
          var vs = VEH_STATUS[v.status]||VEH_STATUS.pending;
          var pc = v.photo_counts||{}; var photoCount=0; Object.values(pc).forEach(function(n){photoCount+=n;});
          return '<div class="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:border-gray-300 transition-colors" onclick="openVehicleDetail(' + v.id + ')">'
            + '<div class="flex items-stretch">'
            + '<div class="w-14 flex items-center justify-center text-lg font-bold shrink-0 ' + (v.status==='completed'?'bg-green-50 text-green-600':v.status==='in_progress'?'bg-blue-50 text-blue-600':'bg-gray-50 text-gray-400') + '">#' + v.seq + '</div>'
            + '<div class="flex-1 p-4">'
            + '<div class="flex items-center gap-2 mb-1"><span class="px-2 py-0.5 text-[10px] rounded font-medium border ' + vs[1] + '">' + vs[0] + '</span><span class="text-xs text-gray-400">' + esc(v.car_model_code) + '</span></div>'
            + '<p class="text-sm font-bold text-gray-800">' + esc(v.maker_name) + ' ' + esc(v.car_model) + '</p>'
            + '<div class="flex items-center gap-3 mt-2 text-xs text-gray-500">'
            + '<span>商品 ' + (v.products||[]).length + '点</span><span>写真 ' + photoCount + '枚</span>'
            + (v.work_report ? '<span class="text-green-600">報告済</span>' : '<span class="text-gray-400">報告待ち</span>')
            + '</div>'
            + (v.vehicle_memo ? '<p class="text-[11px] text-amber-700 bg-amber-50 rounded px-2 py-1 mt-2">⚠ ' + esc(v.vehicle_memo) + '</p>' : '')
            + '</div>'
            + '<div class="w-44 bg-gray-50 p-3 border-l border-gray-100 hidden sm:block"><p class="text-[10px] font-bold text-gray-400 mb-1">取付商品</p>'
            + (v.products||[]).map(function(p){return '<p class="text-[11px] text-gray-600 truncate">' + esc(p.product_name) + '</p>';}).join('')
            + '</div>'
            + '<div class="flex items-center px-3 shrink-0"><svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></div>'
            + '</div></div>';
        }).join('') + '</div>';
    }

    function openVehicleDetail(vid) {
      currentVehicleId = vid;
      switchJobTab('vehicles');
    }

    function backToVehicleList() {
      currentVehicleId = null;
      switchJobTab('vehicles');
    }

    function renderVehicleDetailView(ct) {
      var v = currentJobVehicles.find(function(x){return x.id===currentVehicleId;});
      if (!v) { backToVehicleList(); return; }
      var vs = VEH_STATUS[v.status]||VEH_STATUS.pending;

      var prodRows = (v.products||[]).map(function(p,i) {
        return '<tr class="border-t border-gray-100"><td class="py-2 px-3 text-sm">' + (i+1) + '</td><td class="py-2 px-3 text-sm font-medium">' + esc(p.product_name) + '</td><td class="py-2 px-3 text-sm text-center">' + p.quantity + '</td><td class="py-2 px-3 text-sm font-mono text-xs">' + (p.serial_number||'<span class="text-gray-300">未登録</span>') + '</td><td class="py-2 px-3 text-right"><button onclick="deleteProduct('+v.id+','+p.id+')" class="text-red-400 hover:text-red-600 text-xs">削除</button></td></tr>';
      }).join('');

      var statusOpts = [['pending','未着手'],['in_progress','作業中'],['completed','完了'],['issue','問題あり']].map(function(o) { return '<option value="'+o[0]+'"'+(v.status===o[0]?' selected':'')+'>'+o[1]+'</option>'; }).join('');

      var pc = v.photo_counts||{};
      var photoSlots = PHOTO_CATS_ARR.map(function(c) {
        var count = pc[c[0]]||0;
        return '<div class="border border-gray-200 rounded-lg p-3 text-center' + (count>0?' cursor-pointer hover:border-sva-red':'' ) + '">'
          + (count > 0
            ? '<div class="w-full h-16 bg-green-50 rounded flex items-center justify-center mb-1"><svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></div><p class="text-[10px] font-medium text-green-700">' + c[1] + '</p><p class="text-[9px] text-green-500">' + count + '枚</p>'
            : '<div class="w-full h-16 bg-gray-50 rounded flex items-center justify-center mb-1 border border-dashed border-gray-200"><svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg></div><p class="text-[10px] text-gray-500">' + c[1] + '</p><p class="text-[9px] text-gray-400">未撮影</p>')
          + '</div>';
      }).join('');

      ct.innerHTML = '<div><div class="flex items-center gap-3 mb-5">'
        + '<button onclick="backToVehicleList()" class="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">← 車両一覧</button>'
        + '<span class="px-2 py-0.5 text-[10px] rounded font-medium border ' + vs[1] + '">' + vs[0] + '</span>'
        + '<h3 class="text-base font-bold text-sva-dark flex-1">#' + v.seq + ' ' + esc(v.maker_name) + ' ' + esc(v.car_model) + '</h3>'
        + '<button onclick="deleteVehicle('+v.id+')" class="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50">車両削除</button></div>'
        + '<div class="grid lg:grid-cols-3 gap-5">'
        + '<div class="lg:col-span-2 space-y-5">'
        // 車両情報（編集可能）
        + '<div class="rounded-xl border border-gray-200 p-5"><h4 class="text-sm font-bold text-sva-dark mb-3">車両情報</h4><div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">'
        + '<div><label class="block text-[10px] text-gray-400 mb-0.5">メーカー</label><input id="ve_maker" value="'+esc(v.maker_name)+'" class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '<div><label class="block text-[10px] text-gray-400 mb-0.5">車種</label><input id="ve_model" value="'+esc(v.car_model)+'" class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '<div><label class="block text-[10px] text-gray-400 mb-0.5">型式</label><input id="ve_code" value="'+esc(v.car_model_code)+'" class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '<div><label class="block text-[10px] text-gray-400 mb-0.5">ステータス</label><select id="ve_status" class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-sva-red">'+statusOpts+'</select></div>'
        + '</div>'
        + '<div class="mt-3"><label class="block text-[10px] text-gray-400 mb-0.5">メモ</label><textarea id="ve_memo" rows="2" class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red resize-none">'+esc(v.vehicle_memo)+'</textarea></div>'
        + '<div class="flex items-center gap-2 mt-2"><button onclick="saveVehicle('+v.id+')" class="px-4 py-1.5 bg-sva-dark text-white text-xs font-medium rounded-lg hover:bg-gray-800">車両情報を保存</button><span id="veMsg" class="text-xs"></span></div>'
        + '</div>'
        // 商品テーブル
        + '<div class="rounded-xl border border-gray-200 p-5"><div class="flex items-center justify-between mb-3"><h4 class="text-sm font-bold text-sva-dark">取付商品</h4><button onclick="addProductPrompt('+v.id+')" class="px-3 py-1 text-[10px] bg-sva-red text-white rounded-lg hover:bg-red-800">+ 商品追加</button></div>'
        + '<table class="w-full text-left"><thead class="text-[10px] text-gray-400 uppercase"><tr><th class="py-2 px-3 w-10">#</th><th class="py-2 px-3">商品名</th><th class="py-2 px-3 text-center w-16">数量</th><th class="py-2 px-3 w-40">シリアル番号</th><th class="py-2 px-3 w-12"></th></tr></thead><tbody>' + (prodRows||'<tr><td colspan="5" class="py-4 text-center text-sm text-gray-400">商品未登録</td></tr>') + '</tbody></table></div>'
        // 作業報告
        + '<div class="rounded-xl border border-gray-200 p-5"><h4 class="text-sm font-bold text-sva-dark mb-3">作業報告</h4>'
        + (v.work_report ? '<div class="text-sm text-gray-600 bg-green-50 rounded-lg p-3 whitespace-pre-line border border-green-100">' + esc(v.work_report) + '</div>'
          : '<div class="text-sm text-gray-400 bg-gray-50 rounded-lg p-3 text-center border border-dashed border-gray-200">パートナーからの作業報告はまだありません</div>')
        + '</div></div>'
        // 写真サイドバー
        + '<div><div class="rounded-xl border border-gray-200 p-5 sticky top-20"><h4 class="text-sm font-bold text-sva-dark mb-3">撮影写真</h4><div class="grid grid-cols-2 gap-2">' + photoSlots + '</div></div></div>'
        + '</div></div>';
    }

    async function addVehiclePrompt() {
      var maker = prompt('メーカー名 (例: トヨタ)');
      if (!maker) return;
      var model = prompt('車種 (例: 8FBN25)') || '';
      var code = prompt('車両型式 (例: 8FBN25-60001)') || '';
      var memo = prompt('メモ (任意)') || '';
      try {
        var res = await fetch(API + '/admin/jobs/' + currentJobData.id + '/vehicles', { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+authToken}, body: JSON.stringify({maker_name:maker,car_model:model,car_model_code:code,vehicle_memo:memo}) });
        if (res.ok) { showToast('車両を追加しました'); viewJob(currentJobData.id); } else { showToast('追加失敗'); }
      } catch(e) { showToast('エラー'); }
    }

    async function saveVehicle(vid) {
      var msgEl = document.getElementById('veMsg');
      try {
        var res = await fetch(API + '/admin/jobs/' + currentJobData.id + '/vehicles/' + vid, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({ maker_name: document.getElementById('ve_maker').value, car_model: document.getElementById('ve_model').value, car_model_code: document.getElementById('ve_code').value, status: document.getElementById('ve_status').value, vehicle_memo: document.getElementById('ve_memo').value })
        });
        if (res.ok) { msgEl.textContent = '保存しました'; msgEl.className = 'text-xs text-green-600'; showToast('車両情報を保存しました'); viewJob(currentJobData.id); }
        else { msgEl.textContent = '保存失敗'; msgEl.className = 'text-xs text-red-600'; }
      } catch(e) { msgEl.textContent = 'エラー'; msgEl.className = 'text-xs text-red-600'; }
    }

    async function deleteVehicle(vid) {
      if (!confirm('この車両を削除しますか？\\n関連する商品・写真もすべて削除されます。')) return;
      try {
        var res = await fetch(API + '/admin/jobs/' + currentJobData.id + '/vehicles/' + vid, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + authToken } });
        if (res.ok) { showToast('車両を削除しました'); currentVehicleId = null; viewJob(currentJobData.id); }
        else { showToast('削除失敗'); }
      } catch(e) { showToast('エラー'); }
    }

    async function addProductPrompt(vid) {
      var name = prompt('商品名 (例: 人検知AIカメラ FLC-1)');
      if (!name) return;
      var qty = prompt('数量 (デフォルト: 1)') || '1';
      var serial = prompt('シリアル番号 (任意)') || '';
      try {
        var res = await fetch(API + '/admin/jobs/' + currentJobData.id + '/vehicles/' + vid + '/products', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({ product_name: name, quantity: Number(qty), serial_number: serial })
        });
        if (res.ok) { showToast('商品を追加しました'); viewJob(currentJobData.id); }
        else { showToast('追加失敗'); }
      } catch(e) { showToast('エラー'); }
    }

    async function deleteProduct(vid, pid) {
      if (!confirm('この商品を削除しますか？')) return;
      try {
        var res = await fetch(API + '/admin/jobs/' + currentJobData.id + '/vehicles/' + vid + '/products/' + pid, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + authToken } });
        if (res.ok) { showToast('商品を削除しました'); viewJob(currentJobData.id); }
        else { showToast('削除失敗'); }
      } catch(e) { showToast('エラー'); }
    }

    // ===== Tracking Tab =====
    function renderTrackingTab(ct) {
      var j = currentJobData;
      var shipOpts = [['not_shipped','未発送'],['shipped','発送済'],['received','受取済']].map(function(o) { return '<option value="' + o[0] + '"' + (j.shipping_status === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');
      var schedOpts = [['not_started','未着手'],['contacting','連絡中'],['waiting_callback','折り返し待ち'],['date_confirmed','作業日決定']].map(function(o) { return '<option value="' + o[0] + '"' + (j.schedule_status === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');
      var workOpts = [['scheduling','日程調整中'],['completed','完了'],['user_postponed','ユーザー都合延期'],['self_postponed','自己都合延期'],['maker_postponed','メーカー都合延期'],['cancelled','キャンセル']].map(function(o) { return '<option value="' + o[0] + '"' + (j.work_status === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');
      var updatedBy = j.last_status_updated_by === 'admin' ? 'SVA管理者' : j.last_status_updated_by === 'partner' ? 'パートナー' : '-';

      ct.innerHTML = '<div class="grid md:grid-cols-3 gap-4 mb-5">'
        + '<div class="rounded-xl border border-gray-100 p-4 bg-gray-50/50"><div class="flex items-center gap-2 mb-3"><span class="text-sm font-bold text-gray-800">製品発送</span></div><div class="space-y-2.5"><div><label class="block text-[10px] font-medium text-gray-500 mb-1">発送ステータス</label><select id="jt_shipping" class="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-sm bg-white">' + shipOpts + '</select></div><div><label class="block text-[10px] font-medium text-gray-500 mb-1">発送日</label><p class="text-sm text-gray-700">' + fmtDt(j.shipped_at) + '</p></div><div><label class="block text-[10px] font-medium text-gray-500 mb-1">受取確認日</label><p class="text-sm text-gray-700">' + fmtDt(j.received_at) + '</p></div></div></div>'
        + '<div class="rounded-xl border border-gray-100 p-4 bg-gray-50/50"><div class="flex items-center gap-2 mb-3"><span class="text-sm font-bold text-gray-800">日程調整</span></div><div class="space-y-2.5"><div><label class="block text-[10px] font-medium text-gray-500 mb-1">日程調整ステータス</label><select id="jt_schedule" class="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-sm bg-white">' + schedOpts + '</select></div><div><label class="block text-[10px] font-medium text-gray-500 mb-1">確定作業日</label><input id="jt_work_date" type="text" value="' + esc(j.confirmed_work_date||'') + '" placeholder="例: 2026-04-15" class="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-sm"></div></div></div>'
        + '<div class="rounded-xl border border-gray-100 p-4 bg-gray-50/50"><div class="flex items-center gap-2 mb-3"><span class="text-sm font-bold text-gray-800">作業完了</span></div><div class="space-y-2.5"><div><label class="block text-[10px] font-medium text-gray-500 mb-1">作業ステータス</label><select id="jt_work" class="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-sm bg-white">' + workOpts + '</select></div><div><label class="block text-[10px] font-medium text-gray-500 mb-1">作業完了日</label><p class="text-sm text-gray-700">' + fmtDt(j.work_completed_at) + '</p></div></div></div>'
        + '</div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">ステータスメモ</label><textarea id="jt_note" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none">' + esc(j.status_note||'') + '</textarea></div>'
        + '<div class="flex items-center gap-3 mt-2"><button onclick="saveJobTracking(' + j.id + ')" class="px-6 py-2.5 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800">トラッキング更新</button><span id="jtMsg" class="text-sm"></span>'
        + (j.last_status_updated_at ? '<span class="text-[10px] text-gray-400 ml-auto">最終更新: ' + updatedBy + ' (' + fmtDt(j.last_status_updated_at) + ')</span>' : '') + '</div>';
    }

    // ===== Photos Tab =====
    function renderPhotosTab(ct) {
      var html = '';

      // Admin upload function for vehicle photos (R2 FormData)
      window.adminUploadVehiclePhoto = async function(jobId, vid, category, input) {
        if (!input || !input.files || !input.files[0]) return;
        var file = input.files[0];
        if (file.size > 25*1024*1024) { showToast('25MB以下の画像を選択してください'); input.value=''; return; }
        showToast('アップロード中...');
        try {
          var fd = new FormData();
          fd.append('photo', file);
          fd.append('category', category);
          var res = await fetch(API + '/admin/jobs/' + jobId + '/vehicles/' + vid + '/photos', {
            method:'POST', headers:{'Authorization':'Bearer '+authToken}, body: fd
          });
          input.value = '';
          if (res.ok) { showToast('写真をアップロードしました'); viewJob(jobId); }
          else { var d = await res.json().catch(function(){return {};}); showToast(d.error||'アップロード失敗', true); }
        } catch(e) { input.value=''; showToast('アップロード失敗: '+(e.message||''), true); }
      };

      // Admin upload for job-level photos (R2 FormData)
      window.adminUploadJobPhoto = async function(jobId, category, input) {
        if (!input || !input.files || !input.files[0]) return;
        var file = input.files[0];
        if (file.size > 25*1024*1024) { showToast('25MB以下の画像を選択してください'); input.value=''; return; }
        showToast('アップロード中...');
        try {
          var fd = new FormData();
          fd.append('photo', file);
          fd.append('category', category);
          var res = await fetch(API + '/admin/jobs/' + currentJobId + '/photos', {
            method:'POST', headers:{'Authorization':'Bearer '+authToken}, body: fd
          });
          input.value = '';
          if (res.ok) { showToast('写真をアップロードしました'); viewJob(currentJobId); }
          else { var d = await res.json().catch(function(){return {};}); showToast(d.error||'アップロード失敗', true); }
        } catch(e) { input.value=''; showToast('アップロード失敗: '+(e.message||''), true); }
      };

      // Admin delete photo
      window.adminDeletePhoto = async function(jobId, photoId) {
        if (!confirm('この写真を削除しますか？')) return;
        try {
          var res = await fetch(API + '/admin/jobs/' + jobId + '/photos/' + photoId, { method:'DELETE', headers:{'Authorization':'Bearer '+authToken} });
          if (res.ok) { showToast('写真を削除しました'); viewJob(jobId); }
          else showToast('削除失敗');
        } catch(e) { showToast('エラー'); }
      };

      var jobId = currentJobId;

      // Render vehicle photos with upload slots
      currentJobVehicles.forEach(function(v) {
        var pc = v.photo_counts||{}; var total=0; Object.values(pc).forEach(function(n){total+=n;});
        html += '<div class="mb-6 bg-white rounded-xl border border-gray-200 p-5">'
          + '<h4 class="text-sm font-bold text-sva-dark mb-3 flex items-center gap-2">'
          + '<span class="w-6 h-6 rounded-full bg-sva-red text-white text-xs flex items-center justify-center font-bold">' + v.seq + '</span>'
          + esc(v.maker_name||'') + ' ' + esc(v.car_model||'')
          + '<span class="text-xs text-gray-400 ml-auto">' + total + '枚</span></h4>';

        PHOTO_CATS_ARR.forEach(function(c) {
          var cnt = pc[c[0]]||0;
          html += '<div class="mb-3"><div class="flex items-center gap-2 mb-2">'
            + '<span class="text-xs font-bold text-gray-700">' + c[1] + '</span>'
            + '<span class="text-[10px] px-1.5 py-0.5 rounded-full font-medium ' + (cnt>0?'bg-green-100 text-green-700':'bg-gray-100 text-gray-400') + '">' + cnt + '枚</span></div>'
            + '<div class="flex gap-2 flex-wrap">';
          if (cnt > 0) {
            for (var i=0; i<cnt; i++) {
              html += '<div class="w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-sva-red text-gray-300" onclick="switchTab(\\'photogallery\\');document.getElementById(\\'pgJobSelect\\').value=\\'' + jobId + '\\';loadPhotoGallery(' + jobId + ')">'
                + '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>';
            }
          }
          html += '<label class="w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-sva-red hover:bg-red-50/30 transition-all">'
            + '<svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/></svg>'
            + '<span class="text-[8px] text-gray-400 mt-0.5">追加</span>'
            + '<input type="file" accept="image/*" class="hidden" onchange="adminUploadVehiclePhoto(' + jobId + ',' + v.id + ',\\'' + c[0] + '\\',this)"></label>';
          html += '</div></div>';
        });
        html += '</div>';
      });

      // Job-level photos
      html += '<div class="mb-6 bg-white rounded-xl border border-gray-200 p-5">'
        + '<h4 class="text-sm font-bold text-sva-dark mb-3 flex items-center gap-2">'
        + '<div class="w-1.5 h-5 bg-blue-500 rounded-full"></div>案件全体の写真</h4>';
      var jobPhotoCats = [['caution_plate','コーションプレート'],['pre_install','取付前製品'],['power_source','電源取得箇所'],['ground_point','アース取得箇所'],['completed','取付完了写真'],['claim_caution_plate','コーションプレート(クレーム)'],['claim_fault','故障原因箇所'],['claim_repair','修理内容'],['other','その他']];
      jobPhotoCats.forEach(function(c) {
        html += '<div class="mb-3"><div class="flex items-center gap-2 mb-2">'
          + '<span class="text-xs font-bold text-gray-700">' + c[1] + '</span></div>'
          + '<div class="flex gap-2 flex-wrap">'
          + '<label class="w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-sva-red hover:bg-red-50/30 transition-all">'
          + '<svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/></svg>'
          + '<span class="text-[8px] text-gray-400 mt-0.5">追加</span>'
          + '<input type="file" accept="image/*" class="hidden" onchange="adminUploadJobPhoto(' + jobId + ',\\'' + c[0] + '\\',this)"></label>'
          + '</div></div>';
      });
      html += '</div>';

      html += '<div class="text-center py-3">'
        + '<button onclick="switchTab(\\'photogallery\\');document.getElementById(\\'pgJobSelect\\').value=\\'' + jobId + '\\';loadPhotoGallery(' + jobId + ')" class="px-6 py-2.5 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">'
        + '<svg class="w-4 h-4 inline-block mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>'
        + '写真ギャラリーで全て確認</button></div>';

      if (!html || html.indexOf('rounded-xl') === -1) html = '<p class="text-sm text-gray-400 py-4">写真がアップロードされていません</p>';
      ct.innerHTML = html;
    }

    async function saveJobDetails(jobId) {
      var msgEl = document.getElementById('ajdMsg');
      try {
        var res = await fetch(API + '/admin/jobs/' + jobId, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({
            client_company: document.getElementById('aj_client_company').value,
            client_branch: document.getElementById('aj_client_branch').value,
            client_contact_name: document.getElementById('aj_client_contact_name').value,
            client_contact_phone: document.getElementById('aj_client_phone').value,
            client_contact_email: document.getElementById('aj_client_email').value,
            work_location_detail: document.getElementById('aj_work_location_detail').value,
            work_datetime: document.getElementById('aj_work_datetime').value,
            vehicle_count: Number(document.getElementById('aj_vehicle_count').value)||0,
            urgent_contact_note: document.getElementById('aj_urgent_note').value,
            products_maker: document.getElementById('aj_prod_maker').value,
            products_customer: document.getElementById('aj_prod_customer').value,
            products_partner: document.getElementById('aj_prod_partner').value,
            products_local: document.getElementById('aj_prod_local').value,
            cost_labor: Number(document.getElementById('aj_cost_labor').value)||0,
            cost_travel: Number(document.getElementById('aj_cost_travel').value)||0,
            cost_other: Number(document.getElementById('aj_cost_other').value)||0,
            cost_preliminary: Number(document.getElementById('aj_cost_prelim').value)||0,
            cost_memo: document.getElementById('aj_cost_memo').value
          })
        });
        if (res.ok) { msgEl.textContent = '保存しました'; msgEl.className = 'text-sm text-green-600'; showToast('お客様情報を保存しました'); }
        else { msgEl.textContent = '保存失敗'; msgEl.className = 'text-sm text-red-600'; }
      } catch(e) { msgEl.textContent = 'エラー'; msgEl.className = 'text-sm text-red-600'; }
    }

    async function saveJobOverview(jobId) {
      var msgEl = document.getElementById('ajoMsg');
      try {
        var res = await fetch(API + '/admin/jobs/' + jobId, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({ job_number: document.getElementById('aj_job_number').value })
        });
        if (res.ok) { msgEl.textContent = '保存しました'; msgEl.className = 'text-sm text-green-600'; showToast('案件Noを保存しました'); }
        else { msgEl.textContent = '保存失敗'; msgEl.className = 'text-sm text-red-600'; }
      } catch(e) { msgEl.textContent = 'エラー'; msgEl.className = 'text-sm text-red-600'; }
    }

    async function viewAdminPhoto(jobId, photoId) {
      try {
        var res = await fetch(API + '/admin/jobs/' + jobId + '/photos/' + photoId, { headers: { 'Authorization': 'Bearer ' + authToken } });
        var data = await res.json();
        if (data.photo && data.photo.supabase_url) {
          window.open(data.photo.supabase_url, '_blank');
        } else if (data.photo && data.photo.photo_data) {
          var w = window.open('', '_blank');
          w.document.write('<html><head><title>写真プレビュー</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#111;}img{max-width:100%;max-height:100vh;}</style></head><body><img src="data:' + (data.photo.mime_type || 'image/jpeg') + ';base64,' + data.photo.photo_data + '"></body></html>');
        }
      } catch(e) { showToast('写真の読み込みに失敗しました'); }
    }

    // ===== Attachment helpers =====
    function renderAttachmentsList(atts) {
      if (!atts || !atts.length) return '<p class="text-sm text-gray-400 py-2">添付ファイルはありません</p>';
      return '<div class="space-y-2">' + atts.map(function(a) {
        var size = a.file_size > 1048576 ? (a.file_size/1048576).toFixed(1) + 'MB' : (a.file_size/1024).toFixed(0) + 'KB';
        var isPdf = (a.mime_type||'').includes('pdf');
        var date = a.created_at ? new Date(a.created_at).toLocaleDateString('ja-JP') : '';
        return '<div class="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200">'
          + '<div class="w-8 h-8 rounded flex items-center justify-center shrink-0 ' + (isPdf ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500') + '">'
          + (isPdf ? '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/></svg>' : '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>')
          + '</div>'
          + '<div class="min-w-0 flex-1"><p class="text-sm font-medium text-gray-800 truncate">' + esc(a.file_name) + '</p>'
          + '<p class="text-[10px] text-gray-400">' + size + ' ・ ' + date + (a.description ? ' ・ ' + esc(a.description) : '') + '</p></div>'
          + '<button onclick="downloadAttachment(' + a.job_id + ',' + a.id + ',\\'' + esc(a.file_name) + '\\')" class="px-2.5 py-1 text-[10px] font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 shrink-0">DL</button>'
          + '<button onclick="deleteAttachment(' + a.job_id + ',' + a.id + ')" class="px-2 py-1 text-[10px] text-red-400 hover:text-red-600 shrink-0">削除</button></div>';
      }).join('') + '</div>';
    }

    async function uploadJobAttachment(jobId, input) {
      if (!input || !input.files || !input.files[0]) return;
      var file = input.files[0];
      var fileName = file.name || 'file';
      var fileType = file.type || 'application/pdf';
      if (file.size > 10 * 1024 * 1024) { showToast('ファイルサイズが10MBを超えています'); input.value = ''; return; }
      var desc = prompt('ファイルの説明（任意）', '') || '';
      showToast('アップロード中...');
      var reader = new FileReader();
      reader.onload = async function(e) {
        try {
          var result = e.target.result;
          if (typeof result !== 'string') { showToast('ファイル読込失敗'); input.value = ''; return; }
          var base64 = result.split(',')[1];
          if (!base64) { showToast('ファイル変換失敗'); input.value = ''; return; }
          var res = await fetch(API + '/admin/jobs/' + jobId + '/attachments', {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
            body: JSON.stringify({ file_name: fileName, file_data: base64, mime_type: fileType, description: desc })
          });
          input.value = '';
          if (res.ok) { showToast('添付ファイルをアップロードしました'); viewJob(jobId); }
          else { var d = await res.json().catch(function(){return {};}); showToast(d.error || 'アップロード失敗'); }
        } catch(err) { input.value = ''; showToast('アップロードエラー: ' + (err.message||'')); }
      };
      reader.onerror = function() { input.value = ''; showToast('ファイルの読み込みに失敗しました'); };
      reader.readAsDataURL(file);
    }

    async function downloadAttachment(jobId, attId, fileName) {
      try {
        showToast('ダウンロード中...');
        var res = await fetch(API + '/admin/jobs/' + jobId + '/attachments/' + attId, { headers: { 'Authorization': 'Bearer ' + authToken } });
        var data = await res.json();
        if (data.attachment && data.attachment.file_data) {
          var a = document.createElement('a');
          a.href = 'data:' + (data.attachment.mime_type||'application/pdf') + ';base64,' + data.attachment.file_data;
          a.download = fileName || 'attachment';
          a.click();
          showToast('ダウンロード完了');
        }
      } catch(e) { showToast('ダウンロード失敗'); }
    }

    async function deleteAttachment(jobId, attId) {
      if (!confirm('この添付ファイルを削除しますか？')) return;
      try {
        var res = await fetch(API + '/admin/jobs/' + jobId + '/attachments/' + attId, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + authToken } });
        if (res.ok) { showToast('添付ファイルを削除しました'); viewJob(jobId); }
        else { showToast('削除失敗'); }
      } catch(e) { showToast('エラー'); }
    }

    async function saveJobTracking(jobId) {
      var msgEl = document.getElementById('jtMsg');
      try {
        var res = await fetch(API + '/admin/jobs/' + jobId + '/tracking', {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({
            shipping_status: document.getElementById('jt_shipping').value,
            schedule_status: document.getElementById('jt_schedule').value,
            confirmed_work_date: document.getElementById('jt_work_date').value,
            work_status: document.getElementById('jt_work').value,
            status_note: document.getElementById('jt_note').value
          })
        });
        if (res.ok) { msgEl.textContent = '更新しました'; msgEl.className = 'text-sm text-green-600'; showToast('トラッキングステータスを更新しました'); viewJob(jobId); }
        else { var d = await res.json(); msgEl.textContent = d.error || '更新失敗'; msgEl.className = 'text-sm text-red-600'; }
      } catch(e) { msgEl.textContent = 'エラー'; msgEl.className = 'text-sm text-red-600'; }
    }

    // ==========================================
    // PHOTO GALLERY MANAGEMENT (写真管理)
    // ==========================================
    var PHOTO_CAT_LABELS = {
      'caution_plate': 'コーションプレート', 'pre_install': '取付前製品', 'power_source': '電源取得箇所',
      'ground_point': 'アース取得箇所', 'completed': '取付完了写真',
      'claim_caution_plate': 'コーションプレート(クレーム)', 'claim_fault': '故障原因箇所', 'claim_repair': '修理内容', 'other': 'その他'
    };
    var _adminPhotoList = [];
    var _adminPhotoIdx = 0;
    var _adminPhotoJobId = 0;

    // Helper: supabase_url があればそれを直接使用、なければ API proxy + token
    function getPhotoUrl(photo, jobId) {
      if (photo.supabase_url) return photo.supabase_url;
      return API + '/admin/jobs/' + jobId + '/photos/' + photo.id + '/image?token=' + encodeURIComponent(authToken);
    }

    async function refreshPhotoJobList() {
      var sel = document.getElementById('pgJobSelect');
      if (!sel) return;
      try {
        var res = await fetch(API + '/admin/jobs?limit=200', { headers: { 'Authorization': 'Bearer ' + authToken } });
        var data = await res.json();
        var jobs = data.jobs || [];
        var currentVal = sel.value;
        sel.innerHTML = '<option value="">-- 案件を選択してください (' + jobs.length + '件) --</option>'
          + jobs.map(function(j) {
            var label = (j.job_number||'') + ' ' + esc(j.title) + ' [' + (j.photo_count||0) + '枚]';
            return '<option value="' + j.id + '"' + (String(j.id) === currentVal ? ' selected' : '') + '>' + label + '</option>';
          }).join('');
      } catch(e) {}
    }

    async function loadPhotoGallery(jobId) {
      var content = document.getElementById('pgContent');
      if (!jobId) {
        content.innerHTML = '<div class="text-center py-16 text-gray-400"><svg class="w-16 h-16 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg><p class="text-sm">案件を選択してください</p></div>';
        return;
      }
      _adminPhotoJobId = Number(jobId);
      content.innerHTML = '<div class="flex justify-center py-12"><div class="w-8 h-8 border-3 border-gray-200 border-t-sva-red rounded-full animate-spin" style="border-width:3px"></div></div>';

      try {
        var res = await fetch(API + '/admin/jobs/' + jobId + '/photos/all', { headers: { 'Authorization': 'Bearer ' + authToken } });
        var data = await res.json();
        var photos = data.photos || [];
        var job = data.job || {};
        _adminPhotoList = photos;

        if (photos.length === 0) {
          content.innerHTML = '<div class="bg-white rounded-xl border border-gray-200 p-12 text-center"><svg class="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg><p class="text-sm text-gray-500">この案件にはまだ写真がアップロードされていません</p><p class="text-xs text-gray-400 mt-1">パートナーが作業写真をアップロードするとここに表示されます</p></div>';
          return;
        }

        // Group by vehicle
        var byVehicle = {};
        photos.forEach(function(p) {
          var key = p.vehicle_id ? 'v_' + p.vehicle_id : 'legacy';
          if (!byVehicle[key]) byVehicle[key] = { vehicle: p.vehicle_id ? { seq: p.vehicle_seq, maker: p.vehicle_maker, model: p.vehicle_model } : null, photos: [] };
          byVehicle[key].photos.push(p);
        });

        var html = '<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4">'
          + '<div class="flex items-center justify-between mb-4"><div>'
          + '<h3 class="text-base font-bold text-sva-dark">' + esc(job.title || '') + '</h3>'
          + (job.job_number ? '<span class="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">' + esc(job.job_number) + '</span>' : '')
          + '</div><span class="text-sm font-bold text-sva-red">' + photos.length + '枚</span></div>';

        // Stats bar
        var catCounts = {};
        photos.forEach(function(p) { catCounts[p.category] = (catCounts[p.category]||0) + 1; });
        html += '<div class="flex flex-wrap gap-2 mb-4">';
        Object.keys(catCounts).forEach(function(cat) {
          html += '<span class="px-2 py-1 text-[10px] rounded-full bg-gray-100 text-gray-600 font-medium">' + (PHOTO_CAT_LABELS[cat]||cat) + ' ' + catCounts[cat] + '</span>';
        });
        html += '</div></div>';

        // Render each vehicle group
        Object.keys(byVehicle).forEach(function(key) {
          var group = byVehicle[key];
          var vLabel = group.vehicle ? '#' + group.vehicle.seq + ' ' + esc(group.vehicle.maker||'') + ' ' + esc(group.vehicle.model||'') : '案件全体';
          html += '<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4">'
            + '<h4 class="text-sm font-bold text-sva-dark mb-3 flex items-center gap-2">'
            + '<div class="w-1.5 h-5 bg-blue-500 rounded-full"></div>' + vLabel
            + '<span class="text-xs text-gray-400 font-normal ml-auto">' + group.photos.length + '枚</span></h4>';

          // Group photos by category within vehicle
          var byCat = {};
          group.photos.forEach(function(p) {
            if (!byCat[p.category]) byCat[p.category] = [];
            byCat[p.category].push(p);
          });

          Object.keys(byCat).forEach(function(cat) {
            html += '<div class="mb-3"><p class="text-[10px] font-bold text-gray-500 uppercase mb-2">' + (PHOTO_CAT_LABELS[cat]||cat) + '</p>'
              + '<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">';
            byCat[cat].forEach(function(p, idx) {
              html += '<div class="aspect-square rounded-xl overflow-hidden border-2 border-gray-100 cursor-pointer hover:border-sva-red hover:shadow-md transition-all bg-gray-50 relative group" onclick="openAdminPhoto(' + jobId + ',' + p.id + ')">'
                + '<img src="' + getPhotoUrl(p, jobId) + '" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display=\\'none\\'">'
                + '<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">'
                + '<p class="text-[9px] text-white truncate">' + esc(p.file_name || '') + '</p>'
                + '<p class="text-[8px] text-white/60">' + new Date(p.created_at).toLocaleDateString('ja-JP') + '</p></div>'
                + '</div>';
            });
            html += '</div></div>';
          });
          html += '</div>';
        });

        content.innerHTML = html;
      } catch(e) {
        content.innerHTML = '<p class="text-sm text-red-500 text-center py-8">写真の読み込みに失敗しました</p>';
      }
    }

    function openAdminPhoto(jobId, photoId) {
      _adminPhotoJobId = jobId;
      var idx = _adminPhotoList.findIndex(function(p){return p.id===photoId;});
      _adminPhotoIdx = idx >= 0 ? idx : 0;
      var p = _adminPhotoList[_adminPhotoIdx];
      document.getElementById('adminPhotoImg').src = getPhotoUrl(p, jobId);
      document.getElementById('adminPhotoLabel').textContent = (PHOTO_CAT_LABELS[p.category]||p.category) + (p.vehicle_seq ? ' (#' + p.vehicle_seq + ' ' + (p.vehicle_maker||'') + ')' : '');
      document.getElementById('adminPhotoCounter').textContent = (_adminPhotoIdx+1) + ' / ' + _adminPhotoList.length;
      document.getElementById('adminPhotoPreview').classList.remove('hidden');
    }

    function adminNavigatePhoto(dir) {
      if (_adminPhotoList.length === 0) return;
      _adminPhotoIdx = (_adminPhotoIdx + dir + _adminPhotoList.length) % _adminPhotoList.length;
      var p = _adminPhotoList[_adminPhotoIdx];
      document.getElementById('adminPhotoImg').src = getPhotoUrl(p, _adminPhotoJobId);
      document.getElementById('adminPhotoLabel').textContent = (PHOTO_CAT_LABELS[p.category]||p.category) + (p.vehicle_seq ? ' (#' + p.vehicle_seq + ' ' + (p.vehicle_maker||'') + ')' : '');
      document.getElementById('adminPhotoCounter').textContent = (_adminPhotoIdx+1) + ' / ' + _adminPhotoList.length;
    }

    async function adminDeleteCurrentPhoto() {
      if (_adminPhotoList.length === 0) return;
      var p = _adminPhotoList[_adminPhotoIdx];
      if (!confirm('この写真を削除しますか？')) return;
      try {
        await fetch(API + '/admin/jobs/' + _adminPhotoJobId + '/photos/' + p.id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + authToken } });
        _adminPhotoList.splice(_adminPhotoIdx, 1);
        if (_adminPhotoList.length === 0) {
          document.getElementById('adminPhotoPreview').classList.add('hidden');
          loadPhotoGallery(_adminPhotoJobId);
          return;
        }
        if (_adminPhotoIdx >= _adminPhotoList.length) _adminPhotoIdx = _adminPhotoList.length - 1;
        adminNavigatePhoto(0);
        loadPhotoGallery(_adminPhotoJobId);
      } catch(e) { alert('削除に失敗しました'); }
    }

    // ==========================================
    // ACCOUNT MANAGEMENT
    // ==========================================
    async function loadAccountInfo() {
      try {
        var res = await fetch(API + '/admin/account/me', { headers: { 'Authorization': 'Bearer ' + authToken } });
        if (res.ok) {
          var data = await res.json();
          document.getElementById('currentUsername').textContent = data.user.username;
        }
      } catch(e) {}
    }

    document.getElementById('usernameForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      var msgEl = document.getElementById('usernameMsg');
      var newName = document.getElementById('newUsername').value.trim();
      var pw = document.getElementById('usernameConfirmPassword').value;
      if (!newName || !pw) { msgEl.textContent = '全項目を入力してください'; msgEl.className = 'text-sm text-red-600'; msgEl.classList.remove('hidden'); return; }
      try {
        var res = await fetch(API + '/admin/account/username', {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({ current_password: pw, new_username: newName })
        });
        var data = await res.json();
        if (res.ok) {
          msgEl.textContent = data.message;
          msgEl.className = 'text-sm text-green-600';
          document.getElementById('currentUsername').textContent = newName;
          document.getElementById('newUsername').value = '';
          document.getElementById('usernameConfirmPassword').value = '';
          showToast('ユーザー名を変更しました');
        } else {
          msgEl.textContent = data.error || '変更に失敗しました';
          msgEl.className = 'text-sm text-red-600';
        }
        msgEl.classList.remove('hidden');
      } catch(e) { msgEl.textContent = '通信エラーが発生しました'; msgEl.className = 'text-sm text-red-600'; msgEl.classList.remove('hidden'); }
    });

    document.getElementById('passwordForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      var msgEl = document.getElementById('passwordMsg');
      var currentPw = document.getElementById('currentAdminPassword').value;
      var newPw = document.getElementById('newAdminPassword').value;
      var confirmPw = document.getElementById('confirmAdminPassword').value;
      if (!currentPw || !newPw || !confirmPw) { msgEl.textContent = '全項目を入力してください'; msgEl.className = 'text-sm text-red-600'; msgEl.classList.remove('hidden'); return; }
      if (newPw !== confirmPw) { msgEl.textContent = '新しいパスワードが一致しません'; msgEl.className = 'text-sm text-red-600'; msgEl.classList.remove('hidden'); return; }
      if (newPw.length < 8) { msgEl.textContent = 'パスワードは8文字以上にしてください'; msgEl.className = 'text-sm text-red-600'; msgEl.classList.remove('hidden'); return; }
      try {
        var res = await fetch(API + '/admin/account/password', {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({ current_password: currentPw, new_password: newPw })
        });
        var data = await res.json();
        if (res.ok) {
          msgEl.textContent = 'パスワードを変更しました。再ログインしてください。';
          msgEl.className = 'text-sm text-green-600';
          msgEl.classList.remove('hidden');
          showToast('パスワードが変更されました');
          setTimeout(function() {
            authToken = ''; sessionStorage.removeItem('sva_token');
            document.getElementById('adminDashboard').classList.add('hidden');
            document.getElementById('loginScreen').classList.remove('hidden');
          }, 2000);
        } else {
          msgEl.textContent = data.error || '変更に失敗しました';
          msgEl.className = 'text-sm text-red-600';
          msgEl.classList.remove('hidden');
        }
      } catch(e) { msgEl.textContent = '通信エラーが発生しました'; msgEl.className = 'text-sm text-red-600'; msgEl.classList.remove('hidden'); }
    });
    // ===== お問い合わせ管理 (Inquiries Tab) =====
    var INQ_STATUS = {new:'新着',read:'確認済み',replied:'返信済み',in_progress:'対応中',resolved:'解決',spam:'スパム'};
    var INQ_STATUS_COLOR = {new:'bg-red-50 text-red-700',read:'bg-blue-50 text-blue-700',replied:'bg-green-50 text-green-700',in_progress:'bg-amber-50 text-amber-700',resolved:'bg-gray-100 text-gray-600',spam:'bg-gray-100 text-gray-400'};
    var INQ_CAT_COLOR = {'装置取付のご依頼・お見積もり':'bg-sva-red/10 text-sva-red','公認パートナーへの応募':'bg-indigo-50 text-indigo-700','サービスに関するご質問':'bg-cyan-50 text-cyan-700','その他':'bg-gray-100 text-gray-600'};

    async function loadInquiryBadge() {
      try {
        var res = await fetch(API + '/admin/inquiries/unread-count', { headers: { 'Authorization': 'Bearer ' + authToken } });
        var data = await res.json();
        var cnt = data.count || 0;
        var badge = document.getElementById('inquiryBadge');
        var headerBadge = document.getElementById('inquiryUnreadHeader');
        var headerAlert = document.getElementById('headerInquiryAlert');
        var headerCount = document.getElementById('headerInquiryCount');
        var mobileBadge = document.getElementById('mobileInquiryBadge');
        if (badge) { if (cnt > 0) { badge.textContent = cnt > 99 ? '99+' : String(cnt); badge.classList.remove('hidden'); } else { badge.classList.add('hidden'); } }
        if (headerBadge) { if (cnt > 0) { headerBadge.textContent = cnt + '件 未読'; headerBadge.classList.remove('hidden'); } else { headerBadge.classList.add('hidden'); } }
        if (headerAlert) { if (cnt > 0) { headerAlert.classList.remove('hidden'); } else { headerAlert.classList.add('hidden'); } }
        if (headerCount) { headerCount.textContent = cnt > 99 ? '99+' : String(cnt); }
        if (mobileBadge) { if (cnt > 0) { mobileBadge.textContent = cnt > 99 ? '99+' : String(cnt); mobileBadge.style.display = 'flex'; } else { mobileBadge.style.display = 'none'; } }
      } catch(e) {}
    }

    // Refresh badge every 30s
    setInterval(function(){ if (authToken) loadInquiryBadge(); }, 30000);

    // ===== Installation Requests (取付依頼) =====
    async function loadRequests(page) {
      var listView = document.getElementById('requestListView');
      var detailView = document.getElementById('requestDetailView');
      var backBtn = document.getElementById('backToRequestListBtn');
      if (listView) listView.classList.remove('hidden');
      if (detailView) detailView.classList.add('hidden');
      if (backBtn) backBtn.classList.add('hidden');
      document.getElementById('requestViewTitle').innerHTML = '取付依頼一覧 <span id="requestNewHeader" class="hidden px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full"></span>';

      var status = (document.getElementById('requestStatusFilter')||{}).value||'';
      var search = (document.getElementById('requestSearchInput')||{}).value||'';
      var q = '?page=' + page;
      if (status) q += '&status=' + encodeURIComponent(status);
      if (search) q += '&search=' + encodeURIComponent(search);

      try {
        var res = await fetch(API + '/admin/requests' + q, { headers: { 'Authorization': 'Bearer ' + authToken } });
        if (res.status === 401) { authToken = ''; sessionStorage.removeItem('sva_token'); location.reload(); return; }
        var data = await res.json();
        renderRequestList(data.requests || [], data.pagination || { total: 0, page: 1, pages: 1 });
      } catch(e) {
        var list = document.getElementById('requestList');
        if (list) list.innerHTML = '<div class="text-center py-16 text-gray-400"><p class="text-sm">取付依頼の読み込みに失敗しました</p></div>';
      }
    }

    function renderRequestList(requests, pagination) {
      var list = document.getElementById('requestList');
      if (!requests || requests.length === 0) {
        list.innerHTML = '<div class="text-center py-16 text-gray-400"><svg class="w-16 h-16 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg><p class="text-sm">取付依頼はまだありません</p><p class="text-xs text-gray-300 mt-1">メーカー・商社様からの取付依頼がここに表示されます</p></div>';
        return;
      }
      var statusLabels = { new: '新着', confirmed: '確認済み', assigned: '割当済', scheduled: '日程確定', in_progress: '施工中', completed: '完了', cancelled: 'キャンセル' };
      var statusColors = { new: 'bg-orange-100 text-orange-700', confirmed: 'bg-blue-100 text-blue-700', assigned: 'bg-purple-100 text-purple-700', scheduled: 'bg-indigo-100 text-indigo-700', in_progress: 'bg-yellow-100 text-yellow-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-gray-100 text-gray-500' };
      var html = '';
      requests.forEach(function(r) {
        var sLabel = statusLabels[r.status] || r.status;
        var sColor = statusColors[r.status] || 'bg-gray-100 text-gray-600';
        html += '<div class="bg-white rounded-xl border border-gray-100 p-4 hover:border-sva-red/20 transition-colors cursor-pointer" onclick="viewRequestDetail(' + r.id + ')">'
          + '<div class="flex items-center justify-between">'
          + '<div class="flex items-center gap-3">'
          + '<span class="px-2 py-0.5 text-[10px] font-bold rounded-full ' + sColor + '">' + sLabel + '</span>'
          + '<span class="text-sm font-medium text-sva-dark">' + (r.company_name || '---') + '</span>'
          + '<span class="text-xs text-gray-400">' + (r.contact_name || '') + '</span>'
          + '</div>'
          + '<span class="text-xs text-gray-400">' + (r.created_at ? r.created_at.slice(0,10) : '') + '</span>'
          + '</div>'
          + '<div class="mt-2 text-xs text-gray-500 truncate">' + (r.vehicle_type || '') + ' / ' + (r.device_type || '') + ' / ' + (r.quantity || '') + '台</div>'
          + '</div>';
      });
      list.innerHTML = html;

      // Pagination
      var pg = document.getElementById('requestPagination');
      if (pagination.pages <= 1) { pg.innerHTML = ''; return; }
      var pgHtml = '';
      for (var i = 1; i <= pagination.pages; i++) {
        pgHtml += '<button onclick="loadRequests(' + i + ')" class="px-3 py-1.5 text-sm rounded-lg ' + (i === pagination.page ? 'bg-sva-red text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50') + '">' + i + '</button>';
      }
      pg.innerHTML = pgHtml;
    }

    function viewRequestDetail(id) {
      // Placeholder - will be implemented when API is ready
      document.getElementById('requestListView').classList.add('hidden');
      document.getElementById('requestDetailView').classList.remove('hidden');
      document.getElementById('backToRequestListBtn').classList.remove('hidden');
      document.getElementById('requestViewTitle').textContent = '取付依頼詳細';
      document.getElementById('requestDetailView').innerHTML = '<div class="bg-white rounded-xl border border-gray-200 p-8 text-center"><p class="text-gray-400 text-sm">取付依頼詳細の表示機能は準備中です (ID: ' + id + ')</p></div>';
    }

    async function loadInquiries(page) {
      document.getElementById('inquiryListView').classList.remove('hidden');
      document.getElementById('inquiryDetailView').classList.add('hidden');
      document.getElementById('backToInquiryListBtn').classList.add('hidden');
      document.getElementById('inquiryViewTitle').innerHTML = 'お問い合わせ一覧 <span id="inquiryUnreadHeader" class="hidden px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full"></span>';
      loadInquiryBadge();

      var status = (document.getElementById('inquiryStatusFilter')||{}).value||'';
      var search = (document.getElementById('inquirySearchInput')||{}).value||'';
      var q = '?page=' + page;
      if (status) q += '&status=' + encodeURIComponent(status);
      if (search) q += '&search=' + encodeURIComponent(search);

      try {
        var res = await fetch(API + '/admin/inquiries' + q, { headers: { 'Authorization': 'Bearer ' + authToken } });
        if (res.status === 401) { authToken = ''; sessionStorage.removeItem('sva_token'); location.reload(); return; }
        var data = await res.json();
        renderInquiryList(data.inquiries, data.pagination);
      } catch(e) {
        document.getElementById('inquiryList').innerHTML = '<p class="text-sm text-red-500">読み込みに失敗しました</p>';
      }
    }

    function renderInquiryList(items, pag) {
      var el = document.getElementById('inquiryList');
      if (!items || items.length === 0) {
        el.innerHTML = '<div class="text-center py-16 text-gray-400"><svg class="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg><p class="text-sm">お問い合わせがありません</p></div>';
        return;
      }
      el.innerHTML = items.map(function(inq) {
        var isNew = inq.status === 'new';
        var statusLabel = INQ_STATUS[inq.status] || inq.status;
        var statusColor = INQ_STATUS_COLOR[inq.status] || 'bg-gray-100 text-gray-600';
        var catColor = INQ_CAT_COLOR[inq.category] || 'bg-gray-100 text-gray-600';
        var date = inq.created_at ? new Date(inq.created_at).toLocaleDateString('ja-JP', {month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '-';
        var borderClass = isNew ? 'border-red-200 bg-red-50/30' : 'border-gray-200';
        var newDot = isNew ? '<span class="w-2.5 h-2.5 bg-red-500 rounded-full shrink-0 animate-pulse"></span>' : '';
        return '<div class="bg-white rounded-lg border ' + borderClass + ' px-4 py-3 flex items-center gap-3 hover:border-gray-300 transition-colors cursor-pointer" onclick="viewInquiry(' + inq.id + ')">'
          + newDot
          + '<div class="min-w-0 flex-1">'
          + '<div class="flex items-center gap-2 mb-0.5 flex-wrap"><span class="px-2 py-0.5 ' + statusColor + ' text-xs font-medium rounded">' + statusLabel + '</span><span class="px-2 py-0.5 ' + catColor + ' text-[10px] font-medium rounded">' + esc(inq.category || '-') + '</span></div>'
          + '<p class="text-sm font-medium text-gray-800">' + esc(inq.name) + (inq.company ? ' <span class="text-gray-400 font-normal">/ ' + esc(inq.company) + '</span>' : '') + '</p>'
          + '<p class="text-xs text-gray-500 mt-0.5 truncate">' + esc((inq.message||'').substring(0, 80)) + '</p>'
          + '</div>'
          + '<div class="text-right shrink-0"><p class="text-[10px] text-gray-400">' + date + '</p><p class="text-[10px] text-gray-400">' + esc(inq.email) + '</p></div>'
          + '<svg class="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></div>';
      }).join('');
      renderPagination('inquiryPagination', pag, 'loadInquiries');
    }

    async function viewInquiry(id) {
      document.getElementById('inquiryListView').classList.add('hidden');
      document.getElementById('inquiryDetailView').classList.remove('hidden');
      document.getElementById('backToInquiryListBtn').classList.remove('hidden');
      document.getElementById('inquiryViewTitle').textContent = 'お問い合わせ詳細';

      try {
        var res = await fetch(API + '/admin/inquiries/' + id, { headers: { 'Authorization': 'Bearer ' + authToken } });
        var data = await res.json();
        if (!data.inquiry) { showToast('お問い合わせが見つかりません', true); loadInquiries(1); return; }
        renderInquiryDetail(data.inquiry);
        loadInquiryBadge(); // refresh badge after reading
      } catch(e) { showToast('読み込み失敗', true); }
    }

    function renderInquiryDetail(inq) {
      var statusLabel = INQ_STATUS[inq.status] || inq.status;
      var statusColor = INQ_STATUS_COLOR[inq.status] || 'bg-gray-100 text-gray-600';
      var catColor = INQ_CAT_COLOR[inq.category] || 'bg-gray-100 text-gray-600';
      var fmtDate = function(d) { return d ? new Date(d).toLocaleString('ja-JP') : '-'; };

      var statusOpts = Object.keys(INQ_STATUS).map(function(k) {
        return '<option value="' + k + '"' + (inq.status===k?' selected':'') + '>' + INQ_STATUS[k] + '</option>';
      }).join('');

      document.getElementById('inquiryDetailView').innerHTML = '<div class="max-w-3xl">'
        // Header card
        + '<div class="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">'
        + '<div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">'
        + '<div class="flex items-center gap-3"><span class="px-2 py-0.5 ' + statusColor + ' text-xs font-medium rounded">' + statusLabel + '</span><span class="px-2 py-0.5 ' + catColor + ' text-xs font-medium rounded">' + esc(inq.category) + '</span><span class="text-xs text-gray-400">ID: ' + inq.id + '</span></div>'
        + '<div class="text-xs text-gray-400">' + fmtDate(inq.created_at) + '</div>'
        + '</div>'

        // Contact info
        + '<div class="px-6 py-5 border-b border-gray-100">'
        + '<div class="grid sm:grid-cols-2 gap-4">'
        + '<div><p class="text-[10px] text-gray-400 uppercase tracking-wide mb-1">お名前</p><p class="text-sm font-medium text-sva-dark">' + esc(inq.name) + '</p></div>'
        + '<div><p class="text-[10px] text-gray-400 uppercase tracking-wide mb-1">会社名</p><p class="text-sm font-medium text-sva-dark">' + esc(inq.company || '-') + '</p></div>'
        + '<div><p class="text-[10px] text-gray-400 uppercase tracking-wide mb-1">メール</p><p class="text-sm"><a href="mailto:' + esc(inq.email) + '" class="text-blue-600 hover:underline">' + esc(inq.email) + '</a></p></div>'
        + '<div><p class="text-[10px] text-gray-400 uppercase tracking-wide mb-1">電話</p><p class="text-sm">' + (inq.phone ? '<a href="tel:' + esc(inq.phone) + '" class="text-blue-600 hover:underline">' + esc(inq.phone) + '</a>' : '<span class="text-gray-400">-</span>') + '</p></div>'
        + '</div></div>'

        // Message content
        + '<div class="px-6 py-5">'
        + '<p class="text-[10px] text-gray-400 uppercase tracking-wide mb-2">お問い合わせ内容</p>'
        + '<div class="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap border border-gray-100">' + esc(inq.message) + '</div>'
        + '</div></div>'

        // Status & actions
        + '<div class="bg-white rounded-xl border border-gray-200 p-6 mb-4">'
        + '<h4 class="text-sm font-bold text-sva-dark mb-4">ステータス・対応メモ</h4>'
        + '<div class="grid sm:grid-cols-2 gap-4 mb-4">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">ステータス</label><select id="inq_status" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-sva-red">' + statusOpts + '</select></div>'
        + '<div class="text-xs text-gray-400 space-y-1 pt-5"><p>受信: ' + fmtDate(inq.created_at) + '</p><p>既読: ' + fmtDate(inq.read_at) + '</p><p>返信: ' + fmtDate(inq.replied_at) + '</p></div>'
        + '</div>'
        + '<div class="mb-4"><label class="block text-xs font-medium text-gray-600 mb-1">管理者メモ</label><textarea id="inq_note" rows="3" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-sva-red" placeholder="対応内容メモ...">' + esc(inq.admin_note||'') + '</textarea></div>'
        + '<div class="flex items-center gap-3">'
        + '<button onclick="saveInquiry(' + inq.id + ')" class="px-6 py-2.5 bg-sva-red text-white text-sm font-bold rounded-lg hover:bg-red-800">保存</button>'
        + '<button onclick="deleteInquiry(' + inq.id + ')" class="px-4 py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50">削除</button>'
        + '<span id="inqMsg" class="text-sm"></span>'
        + '</div></div>'

        // Metadata
        + '<div class="bg-gray-50 rounded-xl border border-gray-100 px-6 py-4">'
        + '<p class="text-[10px] text-gray-400 mb-1">IP: ' + esc(inq.ip_address||'-') + '</p>'
        + '<p class="text-[10px] text-gray-400 truncate">UA: ' + esc((inq.user_agent||'-').substring(0, 120)) + '</p>'
        + '</div></div>';
    }

    async function saveInquiry(id) {
      try {
        var res = await fetch(API + '/admin/inquiries/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({
            status: document.getElementById('inq_status').value,
            admin_note: document.getElementById('inq_note').value
          })
        });
        if (res.ok) {
          showToast('保存しました');
          loadInquiryBadge();
          var m = document.getElementById('inqMsg'); if(m){m.textContent='保存完了'; m.className='text-sm text-green-600';}
        } else {
          var data = await res.json();
          var m = document.getElementById('inqMsg'); if(m){m.textContent=data.error||'保存失敗'; m.className='text-sm text-red-600';}
        }
      } catch(e) { var m = document.getElementById('inqMsg'); if(m){m.textContent='通信エラー'; m.className='text-sm text-red-600';} }
    }

    async function deleteInquiry(id) {
      if (!confirm('このお問い合わせを削除しますか？')) return;
      try {
        var res = await fetch(API + '/admin/inquiries/' + id, { method:'DELETE', headers:{'Authorization':'Bearer '+authToken} });
        if (res.ok) { showToast('削除しました'); loadInquiries(1); } else { showToast('削除失敗', true); }
      } catch(e) { showToast('通信エラー', true); }
    }

    window.loadInquiries = loadInquiries;
    window.viewInquiry = viewInquiry;
    window.saveInquiry = saveInquiry;
    window.deleteInquiry = deleteInquiry;

    // ===== 製品マスタ管理 (Products Tab) =====
    var allProductsData = [];
    var CATEGORY_LABELS = {camera:'カメラ',sensor:'センサー',light:'安全灯',control:'制御',recorder:'レコーダー',monitor:'モニター',other:'その他'};
    var CATEGORY_COLORS = {camera:'bg-blue-50 text-blue-700',sensor:'bg-amber-50 text-amber-700',light:'bg-yellow-50 text-yellow-700',control:'bg-purple-50 text-purple-700',recorder:'bg-green-50 text-green-700',monitor:'bg-cyan-50 text-cyan-700',other:'bg-gray-100 text-gray-600'};

    async function loadProductMaster() {
      document.getElementById('productListView').classList.remove('hidden');
      document.getElementById('productDetailView').classList.add('hidden');
      document.getElementById('backToProductListBtn').classList.add('hidden');
      document.getElementById('productViewTitle').textContent = '製品マスタ一覧';
      try {
        var res = await fetch(API + '/admin/products', { headers: { 'Authorization': 'Bearer ' + authToken } });
        if (res.status === 401) { authToken = ''; sessionStorage.removeItem('sva_token'); location.reload(); return; }
        var data = await res.json();
        allProductsData = data.products || [];
        filterProductList();
      } catch(e) {
        document.getElementById('productList').innerHTML = '<p class="text-sm text-red-500">読み込みに失敗しました</p>';
      }
    }

    function filterProductList() {
      var search = ((document.getElementById('productSearchInput')||{}).value||'').toLowerCase();
      var cat = ((document.getElementById('productCategoryFilter')||{}).value||'');
      var active = ((document.getElementById('productActiveFilter')||{}).value||'');
      var filtered = allProductsData.filter(function(p) {
        if (search && (p.product_name||'').toLowerCase().indexOf(search) === -1 && (p.model_number||'').toLowerCase().indexOf(search) === -1) return false;
        if (cat && p.category !== cat) return false;
        if (active !== '' && String(p.is_active) !== active) return false;
        return true;
      });
      renderProductList(filtered);
    }

    function renderProductList(products) {
      var el = document.getElementById('productList');
      if (!products || products.length === 0) {
        el.innerHTML = '<div class="text-center py-16 text-gray-400"><svg class="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg><p class="text-sm">該当する製品がありません</p></div>';
        return;
      }
      el.innerHTML = products.map(function(p) {
        var catLabel = CATEGORY_LABELS[p.category] || p.category;
        var catColor = CATEGORY_COLORS[p.category] || 'bg-gray-100 text-gray-600';
        var statusBadge = p.is_active ? '<span class="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded">有効</span>' : '<span class="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded">無効</span>';
        var modelNum = p.model_number ? '<span class="text-xs text-gray-400 font-mono ml-2">' + esc(p.model_number) + '</span>' : '';
        var sortBadge = '<span class="text-[10px] text-gray-400 mr-2">並び順:' + p.sort_order + '</span>';
        return '<div class="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-4 hover:border-gray-300 transition-colors cursor-pointer" onclick="editProduct(' + p.id + ')">'
          + '<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-sva-red/10 to-red-50 flex items-center justify-center shrink-0">'
          + '<svg class="w-5 h-5 text-sva-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg></div>'
          + '<div class="min-w-0 flex-1">'
          + '<div class="flex items-center gap-2 mb-0.5">' + statusBadge + '<span class="px-2 py-0.5 ' + catColor + ' text-xs font-medium rounded">' + catLabel + '</span></div>'
          + '<p class="text-sm font-medium text-gray-800">' + esc(p.product_name) + modelNum + '</p>'
          + '<p class="text-xs text-gray-400 mt-0.5">' + sortBadge + (p.description ? esc(p.description).substring(0, 60) : '-') + '</p>'
          + '</div>'
          + '<svg class="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></div>';
      }).join('');
    }

    function showNewProductForm() {
      showProductEditor(null);
    }

    async function editProduct(id) {
      try {
        var res = await fetch(API + '/admin/products/' + id, { headers: { 'Authorization': 'Bearer ' + authToken } });
        var data = await res.json();
        if (!data.product) { showToast('製品が見つかりません', true); return; }
        showProductEditor(data.product);
      } catch(e) { showToast('読み込み失敗', true); }
    }

    function showProductEditor(product) {
      var isNew = !product;
      document.getElementById('productListView').classList.add('hidden');
      document.getElementById('productDetailView').classList.remove('hidden');
      document.getElementById('backToProductListBtn').classList.remove('hidden');
      document.getElementById('productViewTitle').textContent = isNew ? '新規製品追加' : '製品編集';

      var p = product || { id:0, product_name:'', model_number:'', category:'camera', description:'', sort_order:0, is_active:1 };

      var catOptions = [
        {v:'camera',l:'カメラ'},{v:'sensor',l:'センサー'},{v:'light',l:'安全灯'},
        {v:'control',l:'制御'},{v:'recorder',l:'レコーダー'},{v:'monitor',l:'モニター'},{v:'other',l:'その他'}
      ].map(function(c){return '<option value="'+c.v+'"'+(p.category===c.v?' selected':'')+'>'+c.l+'</option>';}).join('');

      document.getElementById('productDetailView').innerHTML = '<div class="max-w-2xl">'
        + '<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">'
        + '<div class="px-6 py-5 border-b border-gray-100 bg-gray-50"><h3 class="text-base font-bold text-sva-dark">' + (isNew ? '新規製品を登録' : '製品情報を編集') + '</h3>'
        + '<p class="text-xs text-gray-500 mt-1">' + (isNew ? '製品マスタに新しい製品を追加します' : 'ID: ' + p.id + ' / 更新: ' + (p.updated_at||p.created_at||'-')) + '</p></div>'
        + '<div class="px-6 py-5 space-y-4">'
        + '<input type="hidden" id="pm_id" value="' + (p.id||'') + '">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">製品名 <span class="text-red-500">*</span></label>'
        + '<input id="pm_name" value="' + esc(p.product_name) + '" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red" placeholder="例: 人検知AIカメラ FLC-1"></div>'
        + '<div class="grid sm:grid-cols-2 gap-4">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">型番</label>'
        + '<input id="pm_model" value="' + esc(p.model_number) + '" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red" placeholder="例: FLC-1"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">カテゴリ</label>'
        + '<select id="pm_category" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red">' + catOptions + '</select></div>'
        + '</div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">説明</label>'
        + '<textarea id="pm_description" rows="3" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red" placeholder="製品の説明文...">' + esc(p.description) + '</textarea></div>'
        + '<div class="grid sm:grid-cols-2 gap-4">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">並び順（小さいほど上に表示）</label>'
        + '<input id="pm_sort" type="number" value="' + p.sort_order + '" min="0" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red" placeholder="0"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">ステータス</label>'
        + '<select id="pm_active" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red">'
        + '<option value="1"' + (p.is_active ? ' selected' : '') + '>有効（案件フォームに表示）</option>'
        + '<option value="0"' + (!p.is_active ? ' selected' : '') + '>無効（フォーム非表示）</option></select></div>'
        + '</div>'
        + '</div>'
        + '<div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3">'
        + '<button onclick="saveProduct()" class="px-6 py-2.5 bg-sva-red text-white text-sm font-bold rounded-lg hover:bg-red-800">' + (isNew ? '製品を登録' : '変更を保存') + '</button>'
        + (isNew ? '' : '<button onclick="deleteProduct(' + p.id + ')" class="px-4 py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50">削除する</button>')
        + '<span id="pmMsg" class="text-sm"></span>'
        + '</div></div></div>';
    }

    async function saveProduct() {
      var id = document.getElementById('pm_id').value;
      var name = document.getElementById('pm_name').value.trim();
      if (!name) { var m = document.getElementById('pmMsg'); m.textContent='製品名は必須です'; m.className='text-sm text-red-600'; return; }

      var payload = {
        product_name: name,
        model_number: document.getElementById('pm_model').value.trim(),
        category: document.getElementById('pm_category').value,
        description: document.getElementById('pm_description').value.trim(),
        sort_order: Number(document.getElementById('pm_sort').value) || 0,
        is_active: Number(document.getElementById('pm_active').value)
      };

      try {
        var url = id ? API + '/admin/products/' + id : API + '/admin/products';
        var method = id ? 'PUT' : 'POST';
        var res = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify(payload)
        });
        var data = await res.json();
        if (res.ok) {
          showToast(id ? '製品を更新しました' : '製品を登録しました');
          // Refresh master data for forms
          await loadProductMasterData();
          loadProductMaster();
        } else {
          var m = document.getElementById('pmMsg'); m.textContent = data.error || '保存に失敗しました'; m.className = 'text-sm text-red-600';
        }
      } catch(e) { var m = document.getElementById('pmMsg'); m.textContent = '通信エラーが発生しました'; m.className = 'text-sm text-red-600'; }
    }

    async function deleteProduct(id) {
      if (!confirm('この製品を削除しますか？\\n\\n※既存の案件で使用中の製品名には影響しません（案件側は製品名テキストで保持されています）')) return;
      try {
        var res = await fetch(API + '/admin/products/' + id, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + authToken }
        });
        if (res.ok) {
          showToast('製品を削除しました');
          await loadProductMasterData();
          loadProductMaster();
        } else {
          showToast('削除に失敗しました', true);
        }
      } catch(e) { showToast('通信エラー', true); }
    }

    // Make product functions global
    window.loadProductMaster = loadProductMaster;
    window.filterProductList = filterProductList;
    window.showNewProductForm = showNewProductForm;
    window.editProduct = editProduct;
    window.saveProduct = saveProduct;
    window.deleteProduct = deleteProduct;

  </script>
</body>
</html>`
}
