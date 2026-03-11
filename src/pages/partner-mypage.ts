import { siteHead } from './layout'

export function partnerMypagePage(): string {
  return `${siteHead(
    'マイページ | SVA - Special Vehicle Assist',
    '公認パートナー専用マイページ',
    '/partner/mypage',
    '<meta name="robots" content="noindex, nofollow">'
  )}
<body class="bg-gray-50 min-h-screen antialiased">
  <style>
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .fade-in { animation: fadeIn 0.4s ease-out forwards; }
    .fade-in-delay-1 { animation-delay: 0.05s; opacity: 0; }
    .fade-in-delay-2 { animation-delay: 0.1s; opacity: 0; }
    .fade-in-delay-3 { animation-delay: 0.15s; opacity: 0; }
    .fade-in-delay-4 { animation-delay: 0.2s; opacity: 0; }
    .sidebar-link { transition: all 0.15s ease; }
    .sidebar-link:hover { background: rgba(196,30,58,0.05); }
    .sidebar-link.active { background: rgba(196,30,58,0.08); color: #C41E3A; border-left: 3px solid #C41E3A; }
    .card-shadow { box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03); }
    .input-focus:focus { box-shadow: 0 0 0 3px rgba(196,30,58,0.1); }
    .toast { transform: translateY(-100%); opacity: 0; transition: all 0.3s ease; }
    .toast.show { transform: translateY(0); opacity: 1; }
  </style>

  <!-- Toast notification -->
  <div id="toast" class="toast fixed top-4 right-4 z-[100] bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
    <span id="toastText">保存しました</span>
  </div>

  <!-- Loading overlay -->
  <div id="loadingOverlay" class="fixed inset-0 bg-white z-[90] flex items-center justify-center">
    <div class="text-center">
      <div class="w-10 h-10 border-3 border-gray-200 border-t-sva-red rounded-full animate-spin mx-auto mb-3" style="border-width:3px"></div>
      <p class="text-sm text-gray-500">読み込み中...</p>
    </div>
  </div>

  <!-- Header -->
  <header class="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-4">
          <a href="/" class="shrink-0">
            <img src="/static/images/sva-logo.png" alt="SVA" class="h-9 w-auto object-contain">
          </a>
          <span class="hidden sm:block text-xs text-gray-400 border-l border-gray-200 pl-4">パートナーマイページ</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex items-center gap-2 text-sm">
            <div class="w-8 h-8 bg-sva-red/10 text-sva-red rounded-full flex items-center justify-center text-xs font-bold">
              <span id="headerInitial">P</span>
            </div>
            <span id="headerName" class="text-gray-700 font-medium text-sm max-w-[150px] truncate"></span>
          </div>
          <button id="logoutBtn" class="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50" title="ログアウト">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </button>
        </div>
      </div>
    </div>
  </header>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
    <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">

      <!-- Sidebar -->
      <aside class="lg:w-60 shrink-0">
        <nav class="bg-white rounded-xl card-shadow border border-gray-100 overflow-hidden">
          <div class="p-4 border-b border-gray-50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-sva-red to-red-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                <span id="sidebarInitial">P</span>
              </div>
              <div class="min-w-0">
                <p id="sidebarName" class="text-sm font-bold text-sva-dark truncate"></p>
                <p id="sidebarCompany" class="text-xs text-gray-400 truncate"></p>
              </div>
            </div>
          </div>
          <div class="py-2">
            <button data-page="dashboard" class="sidebar-link active w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              ダッシュボード
            </button>
            <button data-page="profile" class="sidebar-link w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 text-left">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              プロフィール設定
            </button>
            <button data-page="password" class="sidebar-link w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 text-left">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              パスワード変更
            </button>
          </div>
          <div class="border-t border-gray-50 py-2">
            <a href="/" class="sidebar-link w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 text-left">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              サイトに戻る
            </a>
          </div>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="flex-1 min-w-0">

        <!-- Dashboard page -->
        <div id="page-dashboard" class="page-content">
          <h2 class="text-lg font-bold text-sva-dark mb-5 fade-in">ダッシュボード</h2>

          <!-- Welcome banner -->
          <div class="bg-gradient-to-r from-sva-dark to-blue-900 rounded-xl p-6 sm:p-8 mb-6 fade-in fade-in-delay-1">
            <h3 class="text-white font-bold text-lg mb-1">ようこそ、<span id="welcomeName"></span>さん</h3>
            <p class="text-blue-200 text-sm">公認パートナーマイページへようこそ。こちらから各種情報の確認・設定が行えます。</p>
          </div>

          <!-- Stats cards -->
          <div class="grid sm:grid-cols-3 gap-4 mb-6">
            <div class="bg-white rounded-xl p-5 card-shadow border border-gray-100 fade-in fade-in-delay-2">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">案件情報</p>
                  <p class="text-lg font-bold text-sva-dark">準備中</p>
                </div>
              </div>
              <p class="text-xs text-gray-400">案件管理機能は近日公開予定です</p>
            </div>
            <div class="bg-white rounded-xl p-5 card-shadow border border-gray-100 fade-in fade-in-delay-3">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">ステータス</p>
                  <p class="text-lg font-bold text-green-600">有効</p>
                </div>
              </div>
              <p class="text-xs text-gray-400">パートナーアカウントは有効です</p>
            </div>
            <div class="bg-white rounded-xl p-5 card-shadow border border-gray-100 fade-in fade-in-delay-4">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">お知らせ</p>
                  <p class="text-lg font-bold text-sva-dark">0件</p>
                </div>
              </div>
              <p class="text-xs text-gray-400">新しいお知らせはありません</p>
            </div>
          </div>

          <!-- Quick actions & info -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="bg-white rounded-xl p-6 card-shadow border border-gray-100 fade-in fade-in-delay-3">
              <h4 class="font-bold text-sva-dark text-sm mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-sva-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                クイックアクション
              </h4>
              <div class="space-y-2">
                <button data-goto="profile" class="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-left">
                  <span class="text-sm text-gray-700">プロフィールを編集</span>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>
                <button data-goto="password" class="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-left">
                  <span class="text-sm text-gray-700">パスワードを変更</span>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
            <div class="bg-white rounded-xl p-6 card-shadow border border-gray-100 fade-in fade-in-delay-4">
              <h4 class="font-bold text-sva-dark text-sm mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-sva-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                お問い合わせ
              </h4>
              <p class="text-sm text-gray-500 mb-4 leading-relaxed">ご不明な点がございましたら、SVA運営事務局までお気軽にお問い合わせください。</p>
              <div class="space-y-1.5 text-sm">
                <p class="text-gray-600"><span class="text-gray-400 inline-block w-8">TEL</span> <a href="tel:06-6152-7511" class="text-sva-red hover:underline">06-6152-7511</a></p>
                <p class="text-gray-600"><span class="text-gray-400 inline-block w-8">時間</span> 9:00〜18:00（平日）</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile page -->
        <div id="page-profile" class="page-content hidden">
          <h2 class="text-lg font-bold text-sva-dark mb-5 fade-in">プロフィール設定</h2>
          <div class="bg-white rounded-xl card-shadow border border-gray-100 p-6 sm:p-8 fade-in fade-in-delay-1">
            <form id="profileForm" class="space-y-5">
              <div class="grid sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">担当者名</label>
                  <input id="prof_name" type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm input-focus focus:outline-none focus:border-sva-red transition-all" placeholder="山田 太郎">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">会社名・屋号</label>
                  <input id="prof_company" type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm input-focus focus:outline-none focus:border-sva-red transition-all" placeholder="株式会社○○">
                </div>
              </div>
              <div class="grid sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">メールアドレス</label>
                  <input id="prof_email" type="email" disabled class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">電話番号</label>
                  <input id="prof_phone" type="tel" class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm input-focus focus:outline-none focus:border-sva-red transition-all" placeholder="090-0000-0000">
                </div>
              </div>
              <div class="grid sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">対応エリア</label>
                  <input id="prof_region" type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm input-focus focus:outline-none focus:border-sva-red transition-all" placeholder="大阪府、兵庫県、京都府">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">専門分野</label>
                  <input id="prof_specialties" type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm input-focus focus:outline-none focus:border-sva-red transition-all" placeholder="ドラレコ取付、AIカメラ取付">
                </div>
              </div>
              <div class="pt-2">
                <button id="profileSaveBtn" type="submit" class="inline-flex items-center justify-center px-8 py-3 bg-sva-red text-white font-medium rounded-xl hover:bg-red-800 active:scale-[0.98] transition-all text-sm">
                  保存する
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Password page -->
        <div id="page-password" class="page-content hidden">
          <h2 class="text-lg font-bold text-sva-dark mb-5 fade-in">パスワード変更</h2>
          <div class="bg-white rounded-xl card-shadow border border-gray-100 p-6 sm:p-8 fade-in fade-in-delay-1">
            <div id="pwError" class="hidden mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700"></div>
            <div id="pwSuccess" class="hidden mb-5 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700"></div>
            <form id="passwordForm" class="space-y-5 max-w-md">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">現在のパスワード</label>
                <input id="pw_current" type="password" required class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm input-focus focus:outline-none focus:border-sva-red transition-all">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">新しいパスワード</label>
                <input id="pw_new" type="password" required minlength="8" class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm input-focus focus:outline-none focus:border-sva-red transition-all">
                <p class="text-xs text-gray-400 mt-1">8文字以上で設定してください</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">新しいパスワード（確認）</label>
                <input id="pw_confirm" type="password" required class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm input-focus focus:outline-none focus:border-sva-red transition-all">
              </div>
              <div class="pt-2">
                <button id="pwSaveBtn" type="submit" class="inline-flex items-center justify-center px-8 py-3 bg-sva-red text-white font-medium rounded-xl hover:bg-red-800 active:scale-[0.98] transition-all text-sm">
                  パスワードを変更
                </button>
              </div>
            </form>
          </div>
        </div>

      </main>
    </div>
  </div>

  <!-- Mobile bottom nav -->
  <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-pb">
    <div class="flex items-center justify-around py-2">
      <button data-page="dashboard" class="mobile-nav flex flex-col items-center gap-1 px-4 py-1.5 text-sva-red">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        <span class="text-[10px] font-medium">ホーム</span>
      </button>
      <button data-page="profile" class="mobile-nav flex flex-col items-center gap-1 px-4 py-1.5 text-gray-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        <span class="text-[10px] font-medium">プロフィール</span>
      </button>
      <button data-page="password" class="mobile-nav flex flex-col items-center gap-1 px-4 py-1.5 text-gray-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        <span class="text-[10px] font-medium">パスワード</span>
      </button>
    </div>
  </div>

  <script>
  (function() {
    var TOKEN_KEY = 'sva_partner_token';
    var PARTNER_KEY = 'sva_partner';
    var token = localStorage.getItem(TOKEN_KEY);
    var partnerData = null;

    // --- Auth check ---
    if (!token) { window.location.href = '/partner/login'; return; }

    fetch('/api/partner/me', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(function(r) {
        if (!r.ok) throw new Error('unauthorized');
        return r.json();
      })
      .then(function(data) {
        partnerData = data.partner;
        localStorage.setItem(PARTNER_KEY, JSON.stringify(partnerData));
        initUI();
        document.getElementById('loadingOverlay').style.display = 'none';
      })
      .catch(function() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(PARTNER_KEY);
        window.location.href = '/partner/login';
      });

    function initUI() {
      var name = partnerData.representative_name || partnerData.email;
      var initial = (name || 'P').charAt(0).toUpperCase();
      var company = partnerData.company_name || '';

      document.getElementById('headerInitial').textContent = initial;
      document.getElementById('headerName').textContent = name;
      document.getElementById('sidebarInitial').textContent = initial;
      document.getElementById('sidebarName').textContent = name;
      document.getElementById('sidebarCompany').textContent = company;
      document.getElementById('welcomeName').textContent = name;

      // Profile form
      document.getElementById('prof_name').value = partnerData.representative_name || '';
      document.getElementById('prof_company').value = partnerData.company_name || '';
      document.getElementById('prof_email').value = partnerData.email || '';
      document.getElementById('prof_phone').value = partnerData.phone || '';
      document.getElementById('prof_region').value = partnerData.region || '';
      document.getElementById('prof_specialties').value = partnerData.specialties || '';

      setupNav();
      setupForms();
      setupLogout();
    }

    // --- Navigation ---
    function setupNav() {
      var pages = ['dashboard', 'profile', 'password'];
      var allBtns = document.querySelectorAll('[data-page]');
      var gotoBtns = document.querySelectorAll('[data-goto]');

      function switchPage(name) {
        pages.forEach(function(p) {
          var el = document.getElementById('page-' + p);
          if (el) el.classList.toggle('hidden', p !== name);
        });
        allBtns.forEach(function(b) {
          var isActive = b.getAttribute('data-page') === name;
          // Sidebar
          if (b.classList.contains('sidebar-link')) {
            b.classList.toggle('active', isActive);
            if (!isActive) b.classList.add('text-gray-600');
            else b.classList.remove('text-gray-600');
          }
          // Mobile
          if (b.classList.contains('mobile-nav')) {
            if (isActive) { b.classList.remove('text-gray-400'); b.classList.add('text-sva-red'); }
            else { b.classList.add('text-gray-400'); b.classList.remove('text-sva-red'); }
          }
        });
      }

      allBtns.forEach(function(btn) {
        btn.addEventListener('click', function() { switchPage(this.getAttribute('data-page')); });
      });
      gotoBtns.forEach(function(btn) {
        btn.addEventListener('click', function() { switchPage(this.getAttribute('data-goto')); });
      });
    }

    // --- Forms ---
    function setupForms() {
      // Profile save
      document.getElementById('profileForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        var btn = document.getElementById('profileSaveBtn');
        btn.disabled = true; btn.textContent = '保存中...';

        try {
          var res = await fetch('/api/partner/me', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({
              representative_name: document.getElementById('prof_name').value,
              company_name: document.getElementById('prof_company').value,
              phone: document.getElementById('prof_phone').value,
              region: document.getElementById('prof_region').value,
              specialties: document.getElementById('prof_specialties').value,
            })
          });
          if (res.ok) {
            showToast('プロフィールを保存しました');
            // Update sidebar
            var newName = document.getElementById('prof_name').value || partnerData.email;
            document.getElementById('headerName').textContent = newName;
            document.getElementById('sidebarName').textContent = newName;
            document.getElementById('sidebarCompany').textContent = document.getElementById('prof_company').value;
            document.getElementById('headerInitial').textContent = newName.charAt(0).toUpperCase();
            document.getElementById('sidebarInitial').textContent = newName.charAt(0).toUpperCase();
            document.getElementById('welcomeName').textContent = newName;
          } else {
            showToast('保存に失敗しました', true);
          }
        } catch(err) { showToast('通信エラーが発生しました', true); }
        btn.disabled = false; btn.textContent = '保存する';
      });

      // Password change
      document.getElementById('passwordForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        var pwErr = document.getElementById('pwError');
        var pwOk = document.getElementById('pwSuccess');
        pwErr.classList.add('hidden'); pwOk.classList.add('hidden');

        var cur = document.getElementById('pw_current').value;
        var nw = document.getElementById('pw_new').value;
        var cf = document.getElementById('pw_confirm').value;

        if (nw !== cf) { pwErr.textContent = '新しいパスワードが一致しません'; pwErr.classList.remove('hidden'); return; }
        if (nw.length < 8) { pwErr.textContent = 'パスワードは8文字以上で設定してください'; pwErr.classList.remove('hidden'); return; }

        var btn = document.getElementById('pwSaveBtn');
        btn.disabled = true; btn.textContent = '変更中...';

        try {
          var res = await fetch('/api/partner/me/password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ current_password: cur, new_password: nw })
          });
          var data = await res.json();
          if (res.ok) {
            pwOk.textContent = 'パスワードを変更しました'; pwOk.classList.remove('hidden');
            document.getElementById('pw_current').value = '';
            document.getElementById('pw_new').value = '';
            document.getElementById('pw_confirm').value = '';
          } else {
            pwErr.textContent = data.error || 'パスワード変更に失敗しました'; pwErr.classList.remove('hidden');
          }
        } catch(err) { pwErr.textContent = '通信エラーが発生しました'; pwErr.classList.remove('hidden'); }
        btn.disabled = false; btn.textContent = 'パスワードを変更';
      });
    }

    // --- Logout ---
    function setupLogout() {
      document.getElementById('logoutBtn').addEventListener('click', async function() {
        if (!confirm('ログアウトしますか？')) return;
        try {
          await fetch('/api/partner/logout', {
            method: 'POST', headers: { 'Authorization': 'Bearer ' + token }
          });
        } catch(e) {}
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(PARTNER_KEY);
        window.location.href = '/partner/login';
      });
    }

    // --- Toast ---
    function showToast(msg, isError) {
      var toast = document.getElementById('toast');
      var text = document.getElementById('toastText');
      text.textContent = msg;
      toast.className = isError
        ? 'toast show fixed top-4 right-4 z-[100] bg-red-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2'
        : 'toast show fixed top-4 right-4 z-[100] bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2';
      setTimeout(function() { toast.classList.remove('show'); }, 3000);
    }
  })();
  </script>
</body>
</html>`
}
