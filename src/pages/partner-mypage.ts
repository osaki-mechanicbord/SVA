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
    /* Mobile sub-tab scrolling */
    .subtab-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; scrollbar-width: none; }
    .subtab-scroll::-webkit-scrollbar { display: none; }
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
            <button data-page="jobs" class="sidebar-link w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 text-left">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              案件一覧
              <span id="sidebarJobBadge" class="hidden ml-auto px-1.5 py-0.5 text-[10px] bg-sva-red text-white rounded-full font-bold"></span>
            </button>
            <button data-page="messages" class="sidebar-link w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 text-left">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              メッセージ
              <span id="sidebarMsgBadge" class="hidden ml-auto px-1.5 py-0.5 text-[10px] bg-sva-red text-white rounded-full font-bold"></span>
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
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-xl p-5 card-shadow border border-gray-100 fade-in fade-in-delay-2 cursor-pointer hover:border-yellow-200" onclick="document.querySelector('[data-page=jobs]').click()">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div><p class="text-xs text-gray-500">未対応案件</p><p id="statPending" class="text-lg font-bold text-sva-dark">-</p></div>
              </div>
            </div>
            <div class="bg-white rounded-xl p-5 card-shadow border border-gray-100 fade-in fade-in-delay-2 cursor-pointer hover:border-blue-200" onclick="document.querySelector('[data-page=jobs]').click()">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                </div>
                <div><p class="text-xs text-gray-500">対応中案件</p><p id="statActive" class="text-lg font-bold text-sva-dark">-</p></div>
              </div>
            </div>
            <div class="bg-white rounded-xl p-5 card-shadow border border-gray-100 fade-in fade-in-delay-3">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div><p class="text-xs text-gray-500">累計案件</p><p id="statTotal" class="text-lg font-bold text-sva-dark">-</p></div>
              </div>
            </div>
            <div class="bg-white rounded-xl p-5 card-shadow border border-gray-100 fade-in fade-in-delay-4 cursor-pointer hover:border-amber-200" onclick="document.querySelector('[data-page=messages]').click()">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div><p class="text-xs text-gray-500">未読メッセージ</p><p id="statUnread" class="text-lg font-bold text-sva-dark">-</p></div>
              </div>
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
              <div class="border-t border-gray-100 pt-5 mt-1">
                <p class="text-sm font-medium text-gray-700 mb-4">住所・インボイス情報</p>
                <div class="grid sm:grid-cols-3 gap-5">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">郵便番号</label>
                    <input id="prof_postal" type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm input-focus focus:outline-none focus:border-sva-red transition-all" placeholder="000-0000">
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">住所</label>
                    <input id="prof_address" type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm input-focus focus:outline-none focus:border-sva-red transition-all" placeholder="都道府県 市区町村 番地 建物名">
                  </div>
                </div>
                <div class="mt-5">
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">インボイス番号（適格請求書発行事業者登録番号）</label>
                  <input id="prof_invoice" type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm input-focus focus:outline-none focus:border-sva-red transition-all" placeholder="T1234567890123">
                  <p class="text-xs text-gray-400 mt-1">「T」+ 13桁の数字で入力してください</p>
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

        <!-- Jobs page -->
        <div id="page-jobs" class="page-content hidden">
          <h2 class="text-lg font-bold text-sva-dark mb-5 fade-in">案件一覧</h2>
          <div id="jobsList" class="space-y-3 fade-in fade-in-delay-1"></div>
          <!-- Job detail modal (expanded for photos/details) -->
          <div id="jobDetailModal" class="hidden fixed inset-0 bg-black/40 z-[90] flex items-center justify-center p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
              <div id="jobDetailContent" class="p-6"></div>
            </div>
          </div>
          <!-- Photo preview modal (メルカリ風フルスクリーン) -->
          <div id="photoPreviewModal" class="hidden fixed inset-0 bg-black z-[95] flex flex-col">
            <div class="flex items-center justify-between px-4 py-3 bg-black/80">
              <span id="photoPreviewLabel" class="text-white text-sm font-medium"></span>
              <button onclick="closePhotoPreview()" class="text-white/80 hover:text-white p-1"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div class="flex-1 flex items-center justify-center p-4 overflow-auto">
              <img id="photoPreviewImg" src="" class="max-w-full max-h-full rounded-lg shadow-2xl object-contain">
            </div>
            <div class="flex items-center justify-center gap-4 px-4 py-3 bg-black/80">
              <button onclick="navigatePhoto(-1)" class="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
              <span id="photoCounter" class="text-white/60 text-sm"></span>
              <button onclick="navigatePhoto(1)" class="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>
            </div>
          </div>
          <!-- Photo Grid modal (全写真一覧) -->
          <div id="photoGridModal" class="hidden fixed inset-0 bg-black/50 z-[92] flex items-end sm:items-center justify-center">
            <div class="bg-white w-full sm:w-[90vw] sm:max-w-3xl sm:rounded-xl max-h-[90vh] overflow-auto rounded-t-2xl">
              <div class="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
                <span class="text-sm font-bold text-sva-dark">全写真一覧</span>
                <button onclick="document.getElementById('photoGridModal').classList.add('hidden')" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>
              <div id="photoGridContent" class="p-4"></div>
            </div>
          </div>
        </div>

        <!-- Messages page -->
        <div id="page-messages" class="page-content hidden">
          <h2 class="text-lg font-bold text-sva-dark mb-5 fade-in">メッセージ</h2>
          <!-- Reply form -->
          <div class="bg-white rounded-xl card-shadow border border-gray-100 p-5 mb-5 fade-in fade-in-delay-1">
            <p class="text-xs font-medium text-gray-600 mb-2">SVA事務局に返信</p>
            <input id="replySubject" placeholder="件名" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2 focus:outline-none focus:border-sva-red">
            <textarea id="replyBody" rows="3" placeholder="メッセージ本文..." class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2 focus:outline-none focus:border-sva-red resize-none"></textarea>
            <button id="sendReplyBtn" class="px-5 py-2 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800">送信</button>
          </div>
          <div id="messagesList" class="space-y-3 fade-in fade-in-delay-2"></div>
        </div>

      </main>
    </div>
  </div>

  <!-- Mobile bottom nav -->
  <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-pb">
    <div class="flex items-center justify-around py-2">
      <button data-page="dashboard" class="mobile-nav flex flex-col items-center gap-1 px-3 py-1.5 text-sva-red">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        <span class="text-[10px] font-medium">ホーム</span>
      </button>
      <button data-page="jobs" class="mobile-nav flex flex-col items-center gap-1 px-3 py-1.5 text-gray-400 relative">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        <span class="text-[10px] font-medium">案件</span>
      </button>
      <button data-page="messages" class="mobile-nav flex flex-col items-center gap-1 px-3 py-1.5 text-gray-400 relative">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        <span class="text-[10px] font-medium">メッセージ</span>
      </button>
      <button data-page="profile" class="mobile-nav flex flex-col items-center gap-1 px-3 py-1.5 text-gray-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        <span class="text-[10px] font-medium">設定</span>
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
      document.getElementById('prof_postal').value = partnerData.postal_code || '';
      document.getElementById('prof_address').value = partnerData.address || '';
      document.getElementById('prof_invoice').value = partnerData.invoice_number || '';

      setupNav();
      setupForms();
      setupLogout();
      loadStats();
    }

    // --- Stats ---
    async function loadStats() {
      try {
        var res = await fetch('/api/partner/me/stats', { headers: { 'Authorization': 'Bearer ' + token } });
        var data = await res.json();
        if (data.stats) {
          document.getElementById('statPending').textContent = data.stats.pending_jobs + '件';
          document.getElementById('statActive').textContent = data.stats.active_jobs + '件';
          document.getElementById('statTotal').textContent = data.stats.total_jobs + '件';
          document.getElementById('statUnread').textContent = data.stats.unread_messages + '件';
          // Sidebar badges
          if (data.stats.pending_jobs > 0) { var jb = document.getElementById('sidebarJobBadge'); jb.textContent = data.stats.pending_jobs; jb.classList.remove('hidden'); }
          if (data.stats.unread_messages > 0) { var mb = document.getElementById('sidebarMsgBadge'); mb.textContent = data.stats.unread_messages; mb.classList.remove('hidden'); }
        }
      } catch(e) {}
    }

    // --- Navigation ---
    function setupNav() {
      var pages = ['dashboard', 'profile', 'password', 'jobs', 'messages'];
      var allBtns = document.querySelectorAll('[data-page]');
      var gotoBtns = document.querySelectorAll('[data-goto]');

      function switchPage(name) {
        pages.forEach(function(p) {
          var el = document.getElementById('page-' + p);
          if (el) el.classList.toggle('hidden', p !== name);
        });
        // Load data on page switch
        if (name === 'jobs') loadJobs();
        if (name === 'messages') loadMessages();
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
              postal_code: document.getElementById('prof_postal').value,
              address: document.getElementById('prof_address').value,
              invoice_number: document.getElementById('prof_invoice').value,
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

    // --- Jobs ---
    var JOB_S = { 'pending': ['未対応','bg-yellow-50 text-yellow-700 border-yellow-200'], 'accepted': ['受諾','bg-blue-50 text-blue-700 border-blue-200'], 'in_progress': ['対応中','bg-indigo-50 text-indigo-700 border-indigo-200'], 'completed': ['完了','bg-green-50 text-green-700 border-green-200'], 'declined': ['辞退','bg-gray-50 text-gray-500 border-gray-200'], 'cancelled': ['キャンセル','bg-red-50 text-red-600 border-red-200'] };
    var SHIP_S = { 'not_shipped': ['未発送','bg-gray-100 text-gray-500'], 'shipped': ['発送済','bg-orange-50 text-orange-700'], 'received': ['受取済','bg-green-50 text-green-700'] };
    var SCHED_S = { 'not_started': ['未着手','bg-gray-100 text-gray-500'], 'contacting': ['連絡中','bg-blue-50 text-blue-700'], 'waiting_callback': ['折り返し待ち','bg-amber-50 text-amber-700'], 'date_confirmed': ['作業日決定','bg-green-50 text-green-700'] };
    var WORK_S = { 'scheduling': ['日程調整中','bg-blue-50 text-blue-700'], 'completed': ['完了','bg-green-50 text-green-700'], 'user_postponed': ['ユーザー都合延期','bg-amber-50 text-amber-700'], 'self_postponed': ['自己都合延期','bg-orange-50 text-orange-700'], 'maker_postponed': ['メーカー都合延期','bg-purple-50 text-purple-700'], 'cancelled': ['キャンセル','bg-red-50 text-red-600'] };
    var PHOTO_CATS = {
      'caution_plate': 'コーションプレート', 'pre_install': '取付前製品', 'power_source': '電源取得箇所',
      'ground_point': 'アース取得箇所', 'completed': '取付完了写真',
      'claim_caution_plate': 'コーションプレート(クレーム)', 'claim_fault': '故障原因箇所', 'claim_repair': '修理内容', 'other': 'その他'
    };

    function fmtDt(d) { if (!d) return '-'; try { return new Date(d).toLocaleString('ja-JP'); } catch(e) { return d; } }

    async function loadJobs() {
      var el = document.getElementById('jobsList');
      try {
        var res = await fetch('/api/partner/me/jobs', { headers: { 'Authorization': 'Bearer ' + token } });
        var data = await res.json();
        if (!data.jobs || !data.jobs.length) { el.innerHTML = '<div class="bg-white rounded-xl card-shadow border border-gray-100 p-12 text-center"><p class="text-gray-400 text-sm">まだ案件がありません</p><p class="text-xs text-gray-300 mt-1">SVAから案件が届くとここに表示されます</p></div>'; return; }
        el.innerHTML = data.jobs.map(function(j) {
          var s = JOB_S[j.status] || JOB_S.pending;
          var sh = SHIP_S[j.shipping_status] || SHIP_S.not_shipped;
          var sc = SCHED_S[j.schedule_status] || SCHED_S.not_started;
          var wk = WORK_S[j.work_status] || WORK_S.scheduling;
          var date = j.created_at ? new Date(j.created_at).toLocaleDateString('ja-JP') : '';
          return '<div class="bg-white rounded-xl card-shadow border border-gray-100 p-5 cursor-pointer hover:border-gray-200 transition-colors" onclick="openJobDetail(' + j.id + ')">'
            + '<div class="flex items-center gap-2 mb-2"><span class="px-2 py-0.5 text-xs rounded font-medium border ' + s[1] + '">' + s[0] + '</span>'
            + (j.job_number ? '<span class="px-2 py-0.5 text-xs rounded font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">' + escH(j.job_number) + '</span>' : '')
            + (j.tracking_number ? '<span class="text-[10px] text-gray-400"><svg class="w-3 h-3 inline mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4"/></svg>送り状有</span>' : '')
            + '<span class="text-xs text-gray-400 ml-auto">' + date + '</span></div>'
            + '<p class="text-sm font-bold text-sva-dark mb-2">' + escH(j.title) + '</p>'
            + '<div class="flex items-center gap-1.5 flex-wrap mb-2"><span class="px-1.5 py-0.5 text-[10px] rounded font-medium ' + sh[1] + '">製品:' + sh[0] + '</span><span class="px-1.5 py-0.5 text-[10px] rounded font-medium ' + sc[1] + '">日程:' + sc[0] + '</span><span class="px-1.5 py-0.5 text-[10px] rounded font-medium ' + wk[1] + '">作業:' + wk[0] + '</span>'
            + (j.actual_vehicle_count > 0 ? '<span class="px-1.5 py-0.5 text-[10px] rounded font-medium bg-blue-50 text-blue-700">車両 ' + (j.vehicle_done_count||0) + '/' + j.actual_vehicle_count + '台</span>' : '')
            + (j.product_count > 0 ? '<span class="px-1.5 py-0.5 text-[10px] rounded font-medium bg-purple-50 text-purple-700">商品 ' + j.product_count + '点</span>' : '')
            + '</div>'
            + '<div class="flex flex-wrap gap-3 text-xs text-gray-500">'
            + (j.vehicle_type ? '<span>車両: ' + escH(j.vehicle_type) + '</span>' : '')
            + (j.device_type ? '<span>装置: ' + escH(j.device_type) + '</span>' : '')
            + (j.location ? '<span>場所: ' + escH(j.location) + '</span>' : '')
            + '</div></div>';
        }).join('');
      } catch(e) { el.innerHTML = '<p class="text-sm text-red-500">読み込み失敗</p>'; }
    }

    // Current job detail tab
    var currentJobTab = 'info';
    var currentJobVehicles = [];
    var currentJobAttachments = [];

    async function openJobDetail(id) {
      var modal = document.getElementById('jobDetailModal');
      var content = document.getElementById('jobDetailContent');
      modal.classList.remove('hidden');
      content.innerHTML = '<div class="flex items-center justify-center py-8"><div class="w-6 h-6 border-2 border-sva-red border-t-transparent rounded-full animate-spin"></div></div>';
      currentJobTab = 'info';
      currentJobVehicles = [];
      currentJobAttachments = [];      try {
        var res = await fetch('/api/partner/me/jobs/' + id, { headers: { 'Authorization': 'Bearer ' + token } });
        var data = await res.json(); var j = data.job;
        currentJobVehicles = data.vehicles || [];
        currentJobAttachments = data.attachments || [];
        // Also load legacy photos (job-level, no vehicle_id)
        var pRes = await fetch('/api/partner/me/jobs/' + id + '/photos', { headers: { 'Authorization': 'Bearer ' + token } });
        var pData = await pRes.json();
        var photos = pData.photos || [];
        window._currentPhotoList = photos;
        renderJobDetail(j, photos, data);
      } catch(e) { content.innerHTML = '<p class="text-sm text-red-500">読み込み失敗</p>'; }
    }

    var VEH_STATUS = { 'pending': ['未着手','bg-gray-100 text-gray-500 border-gray-200'], 'in_progress': ['作業中','bg-blue-50 text-blue-700 border-blue-200'], 'completed': ['完了','bg-green-50 text-green-700 border-green-200'], 'issue': ['問題あり','bg-red-50 text-red-600 border-red-200'] };
    var PHOTO_CATS_ARR = [['caution_plate','コーションプレート'],['pre_install','取付前製品'],['power_source','電源取得箇所'],['ground_point','アース取得箇所'],['completed','取付完了写真'],['calibration','キャリブレーション'],['claim_caution_plate','コーションプレート(クレーム)'],['claim_fault','故障原因箇所'],['claim_repair','修理内容'],['other','その他']];

    function renderJobDetail(j, photos, data) {
      var content = document.getElementById('jobDetailContent');
      var s = JOB_S[j.status] || JOB_S.pending;

      var vCount = currentJobVehicles.length;
      var vDone = currentJobVehicles.filter(function(v){return v.status==='completed'}).length;
      var totalProducts = 0; currentJobVehicles.forEach(function(v){totalProducts += (v.products||[]).length;});

      var statusBtns = '';
      if (j.status === 'pending') {
        statusBtns = '<div class="flex gap-2 mt-4"><button onclick="updateJobStatus(' + j.id + ',\\'accepted\\')" class="flex-1 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">受諾する</button><button onclick="updateJobStatus(' + j.id + ',\\'declined\\')" class="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">辞退する</button></div>';
      } else if (j.status === 'accepted') {
        statusBtns = '<div class="flex gap-2 mt-4"><button onclick="updateJobStatus(' + j.id + ',\\'in_progress\\')" class="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">対応開始</button></div>';
      } else if (j.status === 'in_progress') {
        statusBtns = '<div class="flex gap-2 mt-4"><button onclick="updateJobStatus(' + j.id + ',\\'completed\\')" class="flex-1 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">完了報告</button></div>';
      }

      // Build tab navigation - 5タブ構成（案件概要・お客様情報・車両・トラッキング・写真）
      var clientAllowed = data.client_info_allowed;
      var tabNav = '<div class="subtab-scroll border-b border-gray-200 mb-4 -mx-6 px-4 sm:px-6"><div class="flex items-center gap-0">'
        + '<button onclick="switchJobTab(\\'info\\',' + j.id + ')" id="jt_tab_info" class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 border-sva-red text-sva-red whitespace-nowrap flex-shrink-0">概要</button>'
        + '<button onclick="switchJobTab(\\'client\\',' + j.id + ')" id="jt_tab_client" class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap flex-shrink-0">お客様' + (clientAllowed ? '' : ' <svg class="w-3 h-3 inline text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>') + '</button>'
        + (vCount > 0 ? '<button onclick="switchJobTab(\\'vehicles\\',' + j.id + ')" id="jt_tab_vehicles" class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap flex-shrink-0">車両 <span class="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded-full font-bold">' + vDone + '/' + vCount + '</span></button>' : '')
        + '<button onclick="switchJobTab(\\'tracking\\',' + j.id + ')" id="jt_tab_tracking" class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap flex-shrink-0">追跡</button>'
        + '<button onclick="switchJobTab(\\'photos\\',' + j.id + ')" id="jt_tab_photos" class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap flex-shrink-0 relative">写真<span id="photoBadge" class="' + (photos.length > 0 ? '' : 'hidden') + ' ml-1 px-1.5 py-0.5 text-[10px] bg-sva-red text-white rounded-full">' + photos.length + '</span></button>'
        + '</div></div>';

      // ===== TAB: 基本情報 =====
      var vehicleSummary = '';
      if (vCount > 0) {
        var progress = vCount > 0 ? Math.round(vDone/vCount*100) : 0;
        vehicleSummary = '<div class="mb-4 bg-blue-50 rounded-xl p-4 border border-blue-100">'
          + '<div class="flex items-center justify-between mb-2"><span class="text-sm font-bold text-sva-dark">車両進捗</span><span class="text-xs text-gray-500">' + vDone + '/' + vCount + '台完了 (' + progress + '%)</span></div>'
          + '<div class="w-full bg-blue-200 rounded-full h-2 mb-3"><div class="bg-blue-600 h-2 rounded-full" style="width:' + progress + '%"></div></div>'
          + '<div class="grid grid-cols-' + Math.min(vCount,4) + ' gap-2">' + currentJobVehicles.map(function(v){
            var vs = VEH_STATUS[v.status]||VEH_STATUS.pending;
            var pc = v.photo_counts||{}; var photoCount=0; Object.values(pc).forEach(function(n){photoCount+=n;});
            return '<div class="bg-white rounded-lg p-2.5 border border-white shadow-sm cursor-pointer hover:border-blue-200" onclick="switchJobTab(\\'vehicles\\','+j.id+')">'
              + '<p class="text-[10px] text-gray-400">#' + v.seq + '</p>'
              + '<p class="text-xs font-bold text-gray-800 truncate">' + escH(v.maker_name) + ' ' + escH(v.car_model) + '</p>'
              + '<div class="flex items-center gap-1 mt-1"><span class="px-1 py-0.5 text-[9px] rounded font-medium border ' + vs[1] + '">' + vs[0] + '</span>'
              + '<span class="text-[9px] text-gray-400 ml-auto">' + (v.products||[]).length + '品 ' + photoCount + '写</span></div></div>';
          }).join('') + '</div></div>';
      }

      var infoTab = '<div id="jt_panel_info">'
        + vehicleSummary
        + '<div class="grid grid-cols-2 gap-3 text-sm mb-4">'
        + (j.job_number ? '<div><p class="text-xs text-gray-400">案件No</p><p class="font-bold font-mono text-indigo-700">' + escH(j.job_number) + '</p></div>' : '')
        + '<div><p class="text-xs text-gray-400">車両タイプ</p><p class="font-medium">' + escH(j.vehicle_type || '-') + '</p></div>'
        + '<div><p class="text-xs text-gray-400">取付装置</p><p class="font-medium">' + escH(j.device_type || '-') + '</p></div>'
        + '<div><p class="text-xs text-gray-400">作業場所</p><p class="font-medium">' + escH(j.location || '-') + '</p></div>'
        + '<div><p class="text-xs text-gray-400">希望日程</p><p class="font-medium">' + escH(j.preferred_date || '-') + '</p></div>'
        + '<div><p class="text-xs text-gray-400">予算</p><p class="font-medium">' + escH(j.budget || '-') + '</p></div>'
        + '<div><p class="text-xs text-gray-400">送り状NO</p><p class="font-medium ' + (j.tracking_number ? 'text-blue-700' : '') + '">' + escH(j.tracking_number || '未登録') + '</p></div>'
        + '</div>'
        + (j.description ? '<div class="mb-4"><p class="text-xs text-gray-400 mb-1">詳細</p><p class="text-sm text-gray-600 whitespace-pre-line bg-gray-50 rounded-lg p-3">' + escH(j.description) + '</p></div>' : '');

      // infoTab: お客様情報・添付ファイルはclientタブに移動済み

      infoTab += ''
        + '<div class="border-t border-gray-100 pt-4">'
        + '<div class="mb-3"><label class="text-xs text-gray-400 mb-1 block">メモ（自分用）</label><textarea id="jobMemoInput" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-sva-red">' + escH(j.partner_memo || '') + '</textarea><button onclick="saveJobMemo(' + j.id + ')" class="mt-1 px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200">メモ保存</button></div>'
        + statusBtns + '</div></div>';

      // ===== TAB: 車両明細 =====
      var vehiclesTab = '';
      if (vCount > 0) {
        var vProgress = vCount > 0 ? Math.round(vDone/vCount*100) : 0;
        vehiclesTab = '<div id="jt_panel_vehicles" class="hidden">'
          + '<div class="flex items-center justify-between mb-4"><div><span class="text-sm font-bold text-sva-dark">車両一覧</span><span class="text-xs text-gray-500 ml-2">' + vDone + '/' + vCount + '台完了 (' + vProgress + '%)</span></div></div>'
          + '<div class="space-y-3">' + currentJobVehicles.map(function(v) {
            var vs = VEH_STATUS[v.status]||VEH_STATUS.pending;
            var pc = v.photo_counts||{}; var photoCount=0; Object.values(pc).forEach(function(n){photoCount+=n;});
            var photoTotal = PHOTO_CATS_ARR.length;
            var photoDone = 0; PHOTO_CATS_ARR.forEach(function(c){if(pc[c[0]]>0) photoDone++;});
            return '<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">'
              + '<div class="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50" onclick="toggleVehiclePanel('+v.id+')">'
              + '<div class="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ' + (v.status==='completed'?'bg-green-50 text-green-600':v.status==='in_progress'?'bg-blue-50 text-blue-600':'bg-gray-50 text-gray-400') + '">#' + v.seq + '</div>'
              + '<div class="min-w-0 flex-1">'
              + '<div class="flex items-center gap-2 mb-0.5"><span class="px-1.5 py-0.5 text-[10px] rounded font-medium border ' + vs[1] + '">' + vs[0] + '</span><span class="text-xs text-gray-400">' + escH(v.car_model_code) + '</span></div>'
              + '<p class="text-sm font-bold text-gray-800">' + escH(v.maker_name) + ' ' + escH(v.car_model) + '</p>'
              + '<div class="flex items-center gap-3 mt-1 text-[10px] text-gray-500">'
              + '<span>商品 ' + (v.products||[]).length + '点</span>'
              + '<span>写真 ' + photoDone + '/' + photoTotal + 'カテゴリ</span>'
              + (v.work_report ? '<span class="text-green-600 font-medium">報告済</span>' : '<span class="text-amber-600">報告待ち</span>')
              + '</div></div>'
              + '<svg class="w-4 h-4 text-gray-300 shrink-0 transition-transform" id="vchev_'+v.id+'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>'
              + '</div>'
              // 展開パネル
              + '<div id="vpanel_'+v.id+'" class="hidden border-t border-gray-100">'
              + '<div class="p-4 space-y-4">'
              // 商品一覧
              + '<div><p class="text-[10px] font-bold text-gray-500 uppercase mb-2">取付商品</p>'
              + ((v.products||[]).length > 0
                ? '<div class="space-y-1.5">' + (v.products||[]).map(function(p){
                  return '<div class="flex items-center gap-2 text-sm"><span class="w-5 h-5 bg-gray-100 rounded text-[10px] flex items-center justify-center font-medium text-gray-500">' + p.quantity + '</span><span class="font-medium text-gray-800">' + escH(p.product_name) + '</span>' + (p.serial_number ? '<span class="text-[10px] text-gray-400 font-mono ml-auto">' + escH(p.serial_number) + '</span>' : '') + '</div>';
                }).join('') + '</div>'
                : '<p class="text-xs text-gray-400">商品未登録</p>')
              + '</div>'
              // 写真撮影スロット
              + '<div><p class="text-[10px] font-bold text-gray-500 uppercase mb-2">写真撮影</p>'
              + '<div class="grid grid-cols-3 gap-2">' + PHOTO_CATS_ARR.map(function(c){
                var cnt = pc[c[0]]||0;
                return '<div class="rounded-lg border ' + (cnt>0?'border-green-200 bg-green-50':'border-gray-200 bg-gray-50') + ' p-2 text-center">'
                  + (cnt>0
                    ? '<svg class="w-4 h-4 text-green-500 mx-auto mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg><p class="text-[9px] font-medium text-green-700">' + c[1] + '</p><p class="text-[8px] text-green-500">' + cnt + '枚</p>'
                    : '<div><p class="text-[9px] text-gray-500 mb-1">' + c[1] + '</p><div class="flex gap-1 justify-center"><label class="cursor-pointer flex flex-col items-center px-1.5 py-1 rounded bg-gray-100 hover:bg-blue-50 active:scale-95 transition-all"><svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg><span class="text-[7px] text-gray-400">撮影</span><input type="file" accept="image/*" capture="environment" class="hidden" onchange="uploadVehiclePhoto('+j.id+','+v.id+',\\''+c[0]+'\\',this)"></label><label class="cursor-pointer flex flex-col items-center px-1.5 py-1 rounded bg-gray-100 hover:bg-blue-50 active:scale-95 transition-all"><svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><span class="text-[7px] text-gray-400">選択</span><input type="file" accept="image/*" class="hidden" onchange="uploadVehiclePhoto('+j.id+','+v.id+',\\''+c[0]+'\\',this)"></label></div></div>')
                  + '</div>';
              }).join('') + '</div>'
              + '</div>'
              // 作業報告
              + '<div><p class="text-[10px] font-bold text-gray-500 uppercase mb-2">作業報告</p>'
              + '<textarea id="vr_'+v.id+'" rows="4" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs resize-none focus:outline-none focus:border-sva-red" placeholder="配線経路・電源取得箇所・動作確認結果などを記載...">' + escH(v.work_report||'') + '</textarea>'
              + '<div class="flex items-center gap-2 mt-2">'
              + '<button onclick="saveVehicleReport('+j.id+','+v.id+')" class="px-4 py-1.5 bg-sva-red text-white text-[10px] font-medium rounded-lg hover:bg-red-800">報告を保存</button>'
              + '<select id="vs_'+v.id+'" class="px-2 py-1.5 border border-gray-200 rounded-lg text-[10px] bg-white">'
              + [['pending','未着手'],['in_progress','作業中'],['completed','完了'],['issue','問題あり']].map(function(o){return '<option value="'+o[0]+'"'+(v.status===o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('')
              + '</select>'
              + '<button onclick="saveVehicleStatus('+j.id+','+v.id+')" class="px-3 py-1.5 text-[10px] bg-gray-100 rounded-lg hover:bg-gray-200">ステータス更新</button>'
              + '<span id="vrMsg_'+v.id+'" class="text-[10px]"></span>'
              + '</div></div>'
              + '</div></div></div>';
          }).join('') + '</div></div>';
      }

      // ===== TAB: 詳細情報 =====
      // ===== TAB: お客様情報 =====
      var clientTab = '';
      if (clientAllowed && (j.client_company || j.client_contact_name || j.work_location_detail || j.work_datetime)) {
        function taxIncl(v) { return Math.round(v * 1.1); }
        function fmtYen(v) { return v ? '¥' + v.toLocaleString() : '¥0'; }
        var costLabor = j.cost_labor || 0;
        var costTravel = j.cost_travel || 0;
        var costOther = j.cost_other || 0;
        var costPrelim = j.cost_preliminary || 0;
        var costSubtotal = costLabor + costTravel + costOther + costPrelim;
        var costTotal = costSubtotal + Math.round(costSubtotal * 0.1);

        clientTab = '<div id="jt_panel_client" class="hidden">'
          + '<div class="rounded-xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden mb-4">'
          + '<div class="bg-orange-500 text-white px-5 py-3 flex items-center gap-2">'
          + '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>'
          + '<span class="font-bold text-sm">お客様詳細情報</span>'
          + '<span class="text-[10px] bg-orange-600 px-2 py-0.5 rounded-full ml-auto">機密情報</span></div>'

          + (j.urgent_contact_note
            ? '<div class="mx-4 mt-4 p-3 rounded-lg bg-red-50 border border-red-200"><div class="flex items-center gap-2 mb-1"><svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg><span class="text-xs font-bold text-red-700">受諾後 即連絡</span></div><p class="text-sm text-red-800 font-medium">' + escH(j.urgent_contact_note) + '</p></div>'
            : '')

          + '<div class="p-4 space-y-4">'
          + '<div><p class="text-[10px] font-bold text-orange-700 uppercase tracking-wide mb-2">お客様連絡先</p>'
          + '<div class="grid grid-cols-2 gap-3 text-sm">'
          + '<div class="bg-white rounded-lg p-3 border border-orange-100"><p class="text-[10px] text-gray-400 mb-0.5">会社名</p><p class="font-bold text-gray-800">' + escH(j.client_company||'-') + '</p></div>'
          + '<div class="bg-white rounded-lg p-3 border border-orange-100"><p class="text-[10px] text-gray-400 mb-0.5">支店名</p><p class="font-bold text-gray-800">' + escH(j.client_branch||'-') + '</p></div>'
          + '<div class="bg-white rounded-lg p-3 border border-orange-100"><p class="text-[10px] text-gray-400 mb-0.5">担当者名</p><p class="font-bold text-gray-800">' + escH(j.client_contact_name||'-') + '</p></div>'
          + '<div class="bg-white rounded-lg p-3 border border-orange-100"><p class="text-[10px] text-gray-400 mb-0.5">打合せ連絡先</p><p class="font-bold text-blue-700">' + (j.client_contact_phone ? '<a href="tel:' + escH(j.client_contact_phone) + '">' + escH(j.client_contact_phone) + '</a>' : '-') + '</p></div>'
          + '<div class="bg-white rounded-lg p-3 border border-orange-100"><p class="text-[10px] text-gray-400 mb-0.5">メール</p><p class="font-medium text-blue-700 text-xs break-all">' + (j.client_contact_email ? '<a href="mailto:' + escH(j.client_contact_email) + '">' + escH(j.client_contact_email) + '</a>' : '-') + '</p></div>'
          + '</div></div>'

          + '<div><p class="text-[10px] font-bold text-orange-700 uppercase tracking-wide mb-2">作業情報</p>'
          + '<div class="grid grid-cols-2 gap-3 text-sm">'
          + '<div class="sm:col-span-2 bg-white rounded-lg p-3 border border-orange-100"><p class="text-[10px] text-gray-400 mb-0.5">作業場所（詳細住所）</p><p class="font-bold text-gray-800">' + escH(j.work_location_detail||'-') + '</p></div>'
          + '<div class="bg-white rounded-lg p-3 border border-orange-100"><p class="text-[10px] text-gray-400 mb-0.5">作業希望日時</p><p class="font-bold text-gray-800">' + escH(j.work_datetime||'-') + '</p></div>'
          + '<div class="bg-white rounded-lg p-3 border border-orange-100"><p class="text-[10px] text-gray-400 mb-0.5">車両台数</p><p class="font-bold text-gray-800">' + (j.vehicle_count||0) + '台</p></div>'
          + '</div></div>'

          + '<div><p class="text-[10px] font-bold text-orange-700 uppercase tracking-wide mb-2">取付製品（準備区分）</p>'
          + '<div class="grid grid-cols-2 gap-3 text-sm">'
          + '<div class="bg-white rounded-lg p-3 border border-orange-100"><p class="text-[10px] text-gray-400 mb-0.5">メーカー準備</p><p class="font-medium text-gray-800 whitespace-pre-line text-xs">' + escH(j.products_maker||'なし') + '</p></div>'
          + '<div class="bg-white rounded-lg p-3 border border-orange-100"><p class="text-[10px] text-gray-400 mb-0.5">お客様準備</p><p class="font-medium text-gray-800 whitespace-pre-line text-xs">' + escH(j.products_customer||'なし') + '</p></div>'
          + '<div class="bg-white rounded-lg p-3 border border-orange-100"><p class="text-[10px] text-gray-400 mb-0.5">公認パートナー準備</p><p class="font-medium text-gray-800 whitespace-pre-line text-xs">' + escH(j.products_partner||'なし') + '</p></div>'
          + '<div class="bg-white rounded-lg p-3 border border-orange-100"><p class="text-[10px] text-gray-400 mb-0.5">現地調達</p><p class="font-medium text-gray-800 whitespace-pre-line text-xs">' + escH(j.products_local||'なし') + '</p></div>'
          + '</div></div>'

          + '<div><p class="text-[10px] font-bold text-orange-700 uppercase tracking-wide mb-2">費用情報 <span class="text-orange-400 font-normal">（税込10%）</span></p>'
          + '<div class="bg-white rounded-xl border border-orange-200 overflow-hidden">'
          + '<table class="w-full text-sm"><tbody>'
          + '<tr class="border-b border-gray-100"><td class="px-4 py-2.5 text-gray-600">推定希望工賃</td><td class="px-4 py-2.5 text-right font-mono text-gray-400 text-xs">' + fmtYen(costLabor) + '</td><td class="px-4 py-2.5 text-right font-mono font-bold text-gray-800">' + fmtYen(taxIncl(costLabor)) + '</td></tr>'
          + '<tr class="border-b border-gray-100"><td class="px-4 py-2.5 text-gray-600">出張費用</td><td class="px-4 py-2.5 text-right font-mono text-gray-400 text-xs">' + fmtYen(costTravel) + '</td><td class="px-4 py-2.5 text-right font-mono font-bold text-gray-800">' + fmtYen(taxIncl(costTravel)) + '</td></tr>'
          + '<tr class="border-b border-gray-100"><td class="px-4 py-2.5 text-gray-600">その他費用</td><td class="px-4 py-2.5 text-right font-mono text-gray-400 text-xs">' + fmtYen(costOther) + '</td><td class="px-4 py-2.5 text-right font-mono font-bold text-gray-800">' + fmtYen(taxIncl(costOther)) + '</td></tr>'
          + '<tr class="border-b border-gray-100"><td class="px-4 py-2.5 text-gray-600">事前打合せ工賃</td><td class="px-4 py-2.5 text-right font-mono text-gray-400 text-xs">' + fmtYen(costPrelim) + '</td><td class="px-4 py-2.5 text-right font-mono font-bold text-gray-800">' + fmtYen(taxIncl(costPrelim)) + '</td></tr>'
          + '<tr class="bg-orange-50 border-t-2 border-orange-200"><td class="px-4 py-3 font-bold text-gray-800">合計（税込10%）</td><td class="px-4 py-3 text-right font-mono text-xs text-gray-500">税抜 ' + fmtYen(costSubtotal) + '</td><td class="px-4 py-3 text-right font-mono font-bold text-lg text-orange-700">' + fmtYen(costTotal) + '</td></tr>'
          + '</tbody></table></div>'
          + (j.cost_memo ? '<p class="text-xs text-gray-500 mt-2 bg-gray-50 rounded-lg p-2">備考: ' + escH(j.cost_memo) + '</p>' : '')
          + '</div>'
          + '</div></div>'

          // 添付ファイル（取付マニュアル等）
          + (currentJobAttachments.length > 0
            ? '<div class="rounded-xl border border-blue-100 bg-blue-50/50 p-4"><div class="flex items-center gap-2 mb-2"><svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/></svg><span class="text-sm font-bold text-sva-dark">添付ファイル（取付マニュアル等）</span></div>'
              + '<div class="space-y-2">' + currentJobAttachments.map(function(a) {
                var size = a.file_size > 1048576 ? (a.file_size/1048576).toFixed(1) + 'MB' : (a.file_size/1024).toFixed(0) + 'KB';
                var isPdf = (a.mime_type||'').includes('pdf');
                return '<div class="flex items-center gap-3 px-3 py-2.5 bg-white rounded-lg border border-gray-100">'
                  + '<div class="w-8 h-8 rounded flex items-center justify-center shrink-0 ' + (isPdf ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500') + '">'
                  + (isPdf ? '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/></svg>' : '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>')
                  + '</div>'
                  + '<div class="min-w-0 flex-1"><p class="text-sm font-medium text-gray-800 truncate">' + escH(a.file_name) + '</p>'
                  + '<p class="text-[10px] text-gray-400">' + size + (a.description ? ' ・ ' + escH(a.description) : '') + '</p></div>'
                  + '<button onclick="downloadPartnerAttachment(' + j.id + ',' + a.id + ',\\'' + escH(a.file_name).replace(/'/g,"\\\\'") + '\\')" class="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shrink-0"><svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>ダウンロード</button></div>';
              }).join('') + '</div></div>'
            : '')
          + '</div>';
      } else {
        clientTab = '<div id="jt_panel_client" class="hidden">'
          + '<div class="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">'
          + '<svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>'
          + '<p class="text-sm font-medium text-gray-500">お客様の詳細情報は案件を受諾後に表示されます</p>'
          + '<p class="text-xs text-gray-400 mt-1">受諾 → 対応開始でお客様連絡先・費用情報・添付ファイルが開示されます</p></div></div>';
      }

      // ===== TAB: トラッキング =====
      var sh = SHIP_S[j.shipping_status] || SHIP_S.not_shipped;
      var sc = SCHED_S[j.schedule_status] || SCHED_S.not_started;
      var wk = WORK_S[j.work_status] || WORK_S.scheduling;
      var shipOpts = [['not_shipped','未発送'],['shipped','発送済'],['received','受取済']].map(function(o) { return '<option value="' + o[0] + '"' + (j.shipping_status === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');
      var schedOpts = [['not_started','未着手'],['contacting','連絡中'],['waiting_callback','折り返し待ち'],['date_confirmed','作業日決定']].map(function(o) { return '<option value="' + o[0] + '"' + (j.schedule_status === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');
      var workOpts = [['scheduling','日程調整中'],['completed','完了'],['user_postponed','ユーザー都合延期'],['self_postponed','自己都合延期'],['maker_postponed','メーカー都合延期'],['cancelled','キャンセル']].map(function(o) { return '<option value="' + o[0] + '"' + (j.work_status === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');
      var updatedBy = j.last_status_updated_by === 'admin' ? 'SVA事務局' : j.last_status_updated_by === 'partner' ? 'パートナー' : '-';

      var trackingTab = '<div id="jt_panel_tracking" class="hidden">'
        + '<div class="flex items-center gap-1 mb-4">'
        + '<div class="flex-1 h-1.5 rounded-full ' + (j.shipping_status !== 'not_shipped' ? 'bg-green-400' : 'bg-gray-200') + '"></div>'
        + '<div class="flex-1 h-1.5 rounded-full ' + (j.shipping_status === 'received' ? 'bg-green-400' : 'bg-gray-200') + '"></div>'
        + '<div class="flex-1 h-1.5 rounded-full ' + (j.schedule_status === 'date_confirmed' ? 'bg-green-400' : j.schedule_status !== 'not_started' ? 'bg-yellow-400' : 'bg-gray-200') + '"></div>'
        + '<div class="flex-1 h-1.5 rounded-full ' + (j.work_status === 'completed' ? 'bg-green-400' : j.work_status !== 'scheduling' ? 'bg-yellow-400' : 'bg-gray-200') + '"></div>'
        + '</div>'
        + '<div class="space-y-3">'
        + '<div class="grid grid-cols-2 gap-3">'
        + '<div><label class="block text-[10px] font-bold text-gray-500 mb-1">製品発送</label><select id="pt_shipping" class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-sva-red">' + shipOpts + '</select>'
        + (j.shipped_at ? '<p class="text-[10px] text-gray-400 mt-0.5">発送: ' + fmtDt(j.shipped_at) + '</p>' : '')
        + (j.received_at ? '<p class="text-[10px] text-gray-400">受取: ' + fmtDt(j.received_at) + '</p>' : '')
        + '</div>'
        + '<div><label class="block text-[10px] font-bold text-gray-500 mb-1">日程調整</label><select id="pt_schedule" class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-sva-red">' + schedOpts + '</select>'
        + '<input id="pt_work_date" type="text" value="' + escH(j.confirmed_work_date || '') + '" placeholder="作業日 例: 2026-04-15" class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs mt-1 focus:outline-none focus:border-sva-red">'
        + '</div>'
        + '</div>'
        + '<div><label class="block text-[10px] font-bold text-gray-500 mb-1">作業完了</label><select id="pt_work" class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-sva-red">' + workOpts + '</select>'
        + (j.work_completed_at ? '<p class="text-[10px] text-gray-400 mt-0.5">完了日: ' + fmtDt(j.work_completed_at) + '</p>' : '')
        + '</div>'
        + '<div><label class="block text-[10px] font-bold text-gray-500 mb-1">メモ</label><textarea id="pt_note" rows="2" class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs resize-none focus:outline-none focus:border-sva-red" placeholder="ステータスの備考...">' + escH(j.status_note || '') + '</textarea></div>'
        + '<div class="flex items-center gap-2">'
        + '<button onclick="saveJobTracking(' + j.id + ')" class="px-4 py-2 bg-sva-red text-white text-xs font-medium rounded-lg hover:bg-red-800">トラッキング更新</button>'
        + '<span id="ptTrackMsg" class="text-xs"></span>'
        + '</div>'
        + (j.last_status_updated_at ? '<p class="text-[10px] text-gray-400 mt-1">最終更新: ' + updatedBy + ' (' + fmtDt(j.last_status_updated_at) + ')</p>' : '')
        + '</div></div>';

      // ===== TAB: 写真 (メルカリ風UI) =====
      var normalCats = [['caution_plate','コーションプレート'],['pre_install','取付前製品'],['power_source','電源取得箇所'],['ground_point','アース取得箇所'],['completed','取付完了写真'],['calibration','キャリブレーション']];
      var claimCats = [['claim_caution_plate','コーションプレート'],['claim_fault','故障原因箇所(不良個所)'],['claim_repair','修理内容']];

      function buildPhotoSlots(cats, photosArr) {
        return cats.map(function(c) {
          var existing = photosArr.filter(function(p) { return p.category === c[0]; });
          var thumbs = existing.map(function(p) {
            // Supabase URLがある場合は直接CDNから取得（高速）、なければAPI経由
            var imgUrl = p.supabase_url || ('/api/partner/me/jobs/' + j.id + '/photos/' + p.id + '/image');
            return '<div class="relative group">'
              + '<div class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-gray-100 overflow-hidden cursor-pointer bg-gray-50 shadow-sm hover:shadow-md transition-shadow" onclick="viewPhotoImage(' + j.id + ',' + p.id + ')">'
              + '<img src="' + imgUrl + '" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display=\\'none\\';this.parentNode.style.cssText=\\'display:flex;align-items:center;justify-content:center;\\';this.parentNode.insertAdjacentHTML(\\'beforeend\\',\\'<span style=color:#ccc;font-size:24px>📷</span>\\')">'
              + '</div>'
              + '<button onclick="event.stopPropagation();deletePhoto(' + j.id + ',' + p.id + ')" class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs shadow-lg opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 flex items-center justify-center transition-opacity" style="opacity:0.8">&times;</button>'
              + '<p class="text-[8px] text-gray-400 mt-0.5 text-center truncate w-20 sm:w-24">' + (p.file_name ? escH(p.file_name).substring(0,12) : fmtDt(p.created_at).split(' ')[0]) + '</p></div>';
          }).join('');
          return '<div class="py-3 border-b border-gray-50 last:border-0">'
            + '<div class="flex items-center gap-2 mb-2"><span class="text-xs font-bold text-gray-700">' + c[1] + '</span>'
            + '<span class="text-[10px] px-1.5 py-0.5 rounded-full font-medium ' + (existing.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400') + '">' + existing.length + '枚</span></div>'
            + '<div class="flex gap-2.5 flex-wrap">' + thumbs
            + '<div class="flex flex-col gap-1.5">'
            + '<label class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-sva-red hover:bg-red-50/30 transition-all active:scale-95">'
            + '<svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>'
            + '<span class="text-[8px] text-gray-400 mt-0.5">撮影</span>'
            + '<input type="file" accept="image/*" capture="environment" class="hidden" onchange="uploadJobPhoto(' + j.id + ',\\'' + c[0] + '\\',this)">'
            + '</label>'
            + '<label class="w-20 h-6 sm:w-24 rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:border-sva-red hover:bg-red-50/30 transition-all active:scale-95 gap-1">'
            + '<svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
            + '<span class="text-[8px] text-gray-400">選択</span>'
            + '<input type="file" accept="image/*" class="hidden" onchange="uploadJobPhoto(' + j.id + ',\\'' + c[0] + '\\',this)">'
            + '</label></div></div></div>';
        }).join('');
      }

      var photoCount = photos.length;
      // 車両ごとの写真を集計
      var vehiclePhotoMap = {};
      var orphanPhotos = [];
      photos.forEach(function(p) {
        if (p.vehicle_id) {
          if (!vehiclePhotoMap[p.vehicle_id]) vehiclePhotoMap[p.vehicle_id] = [];
          vehiclePhotoMap[p.vehicle_id].push(p);
        } else {
          orphanPhotos.push(p);
        }
      });

      function buildVehiclePhotoSummary(v, vPhotos) {
        var pc = v.photo_counts || {};
        var allCats = normalCats.concat(claimCats).concat([['other','その他']]);
        var doneCats = 0; allCats.forEach(function(c){ if(pc[c[0]]>0) doneCats++; });
        var totalCats = allCats.length;
        var vPhotoCount = 0; Object.values(pc).forEach(function(n){vPhotoCount+=n;});
        var vs = VEH_STATUS[v.status]||VEH_STATUS.pending;

        var catIcons = allCats.map(function(c){
          var cnt = pc[c[0]]||0;
          return '<div class="flex items-center gap-1 text-[10px] ' + (cnt>0?'text-green-600':'text-gray-400') + '">'
            + (cnt>0?'<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>':'<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-width="1.5"/></svg>')
            + '<span>' + c[1] + (cnt>0?' ('+cnt+')':'') + '</span></div>';
        }).join('');

        return '<div class="bg-white rounded-xl border border-gray-200 overflow-hidden mb-3">'
          + '<div class="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50" onclick="toggleVehiclePhotoPanel('+v.id+')">'
          + '<div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ' + (v.status==='completed'?'bg-green-50 text-green-600':'bg-gray-50 text-gray-400') + '">#' + v.seq + '</div>'
          + '<div class="min-w-0 flex-1">'
          + '<p class="text-sm font-bold text-gray-800">' + escH(v.maker_name) + ' ' + escH(v.car_model) + '</p>'
          + '<div class="flex items-center gap-2 mt-0.5"><span class="px-1.5 py-0.5 text-[9px] rounded font-medium border ' + vs[1] + '">' + vs[0] + '</span>'
          + '<span class="text-[10px] text-gray-500">' + vPhotoCount + '枚 (' + doneCats + '/' + totalCats + '\u30AB\u30C6\u30B4\u30EA)</span></div></div>'
          + '<div class="w-12 h-2 bg-gray-200 rounded-full shrink-0"><div class="h-2 rounded-full ' + (doneCats===totalCats?'bg-green-500':'bg-blue-500') + '" style="width:' + Math.round(doneCats/totalCats*100) + '%"></div></div>'
          + '<svg class="w-4 h-4 text-gray-300 shrink-0 transition-transform" id="vphchev_'+v.id+'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>'
          + '</div>'
          + '<div id="vphpanel_'+v.id+'" class="hidden border-t border-gray-100 p-3">'
          + '<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">' + catIcons + '</div>'
          + '<div class="mt-3"><button onclick="switchJobTab(\\'vehicles\\','+j.id+');setTimeout(function(){toggleVehiclePanel('+v.id+')},100)" class="text-xs text-blue-600 font-medium hover:underline">\u2192 \u3053\u306e\u8eca\u4e21\u306e\u5199\u771f\u3092\u64ae\u5f71\u30fb\u7ba1\u7406</button></div>'
          + '</div></div>';
      }

      var photosTab = '<div id="jt_panel_photos" class="hidden">'
        // サマリーバー
        + '<div class="flex items-center justify-between mb-4 bg-gradient-to-r from-gray-50 to-white rounded-xl p-3 border border-gray-100">'
        + '<div class="flex items-center gap-2"><svg class="w-5 h-5 text-sva-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="3"/></svg>'
        + '<span class="text-sm font-bold text-sva-dark">\u5199\u771f\u7ba1\u7406</span><span class="text-xs text-gray-500">\u5168' + photoCount + '\u679a</span></div>'
        + '<button onclick="openPhotoGrid(' + j.id + ')" class="px-3 py-1.5 text-[10px] font-medium bg-sva-red text-white rounded-lg hover:bg-red-800 flex items-center gap-1">'
        + '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>\u5168\u5199\u771f\u4e00\u89a7</button></div>'
        // 案内メッセージ
        + '<div class="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-100">'
        + '<p class="text-xs text-blue-700"><svg class="w-3.5 h-3.5 inline mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>\u5199\u771f\u306f\u5404\u8eca\u4e21\u306e\u5c55\u958b\u30d1\u30cd\u30eb\u304b\u3089\u64ae\u5f71\u30fb\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u8eca\u4e21\u30bf\u30d6\u3067\u5404\u8eca\u4e21\u3092\u5c55\u958b\u3059\u308b\u3068\u64ae\u5f71\u30b9\u30ed\u30c3\u30c8\u304c\u8868\u793a\u3055\u308c\u307e\u3059\u3002</p></div>'
        // 車両別写真サマリー
        + (vCount > 0
          ? '<div class="mb-4"><h5 class="text-xs font-bold text-gray-500 uppercase mb-2">\u8eca\u4e21\u5225\u5199\u771f\u72b6\u6cc1</h5>'
            + currentJobVehicles.map(function(v){ return buildVehiclePhotoSummary(v, vehiclePhotoMap[v.id]||[]); }).join('')
            + '</div>'
          : '')
        // 案件共通写真（vehicle_id=NULL の既存写真）
        + (orphanPhotos.length > 0
          ? '<div class="bg-white rounded-xl border border-gray-100 p-4">'
            + '<div class="flex items-center gap-2 mb-1"><div class="w-1 h-4 bg-amber-400 rounded-full"></div><h5 class="text-sm font-bold text-sva-dark">\u6848\u4ef6\u5171\u901a\u5199\u771f</h5><span class="text-[10px] text-gray-400">\u203b\u8eca\u4e21\u672a\u7d10\u4ed8\u304d</span></div>'
            + buildPhotoSlots(normalCats.concat(claimCats).concat([['other','\u305d\u306e\u4ed6\u306e\u5199\u771f']]), orphanPhotos)
            + '</div>'
          : '')
        + '</div>';

      // ===== TAB: 作業報告 =====
      content.innerHTML = '<div class="flex items-center justify-between mb-3"><div class="flex items-center gap-2 flex-wrap"><span class="px-2 py-0.5 text-xs rounded font-medium border ' + s[1] + '">' + s[0] + '</span>'
        + (j.job_number ? '<span class="px-2 py-0.5 text-xs rounded font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">' + escH(j.job_number) + '</span>' : '')
        + '<h3 class="text-base font-bold text-sva-dark">' + escH(j.title) + '</h3>'
        + (vCount > 0 ? '<span class="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">車両 ' + vDone + '/' + vCount + '台</span>' : '')
        + (totalProducts > 0 ? '<span class="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-medium">商品 ' + totalProducts + '点</span>' : '')
        + '</div><button onclick="document.getElementById(\\'jobDetailModal\\').classList.add(\\'hidden\\')" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button></div>'
        + tabNav + infoTab + clientTab + vehiclesTab + trackingTab + photosTab;
    }

    function switchJobTab(tab, jobId) {
      currentJobTab = tab;
      ['info','client','vehicles','tracking','photos'].forEach(function(t) {
        var panel = document.getElementById('jt_panel_' + t);
        var tabBtn = document.getElementById('jt_tab_' + t);
        if (panel) panel.classList.toggle('hidden', t !== tab);
        if (tabBtn) { tabBtn.classList.toggle('border-sva-red', t === tab); tabBtn.classList.toggle('text-sva-red', t === tab); tabBtn.classList.toggle('border-transparent', t !== tab); tabBtn.classList.toggle('text-gray-500', t !== tab); }
      });
      // Auto-scroll active tab into view on mobile
      var activeBtn = document.getElementById('jt_tab_' + tab);
      if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    window.switchJobTab = switchJobTab;

    function toggleVehiclePanel(vid) {
      var panel = document.getElementById('vpanel_' + vid);
      var chev = document.getElementById('vchev_' + vid);
      if (panel) {
        var isHidden = panel.classList.contains('hidden');
        panel.classList.toggle('hidden');
        if (chev) chev.style.transform = isHidden ? 'rotate(180deg)' : '';
      }
    }
    window.toggleVehiclePanel = toggleVehiclePanel;

    function toggleVehiclePhotoPanel(vid) {
      var panel = document.getElementById('vphpanel_' + vid);
      var chev = document.getElementById('vphchev_' + vid);
      if (panel) {
        var isHidden = panel.classList.contains('hidden');
        panel.classList.toggle('hidden');
        if (chev) chev.style.transform = isHidden ? 'rotate(180deg)' : '';
      }
    }
    window.toggleVehiclePhotoPanel = toggleVehiclePhotoPanel;

    async function downloadPartnerAttachment(jobId, attId, fileName) {
      try {
        showToast('ダウンロード中...');
        var res = await fetch('/api/partner/me/jobs/' + jobId + '/attachments/' + attId, { headers: { 'Authorization': 'Bearer ' + token } });
        var data = await res.json();
        if (data.attachment && data.attachment.file_data) {
          var a = document.createElement('a');
          a.href = 'data:' + (data.attachment.mime_type||'application/pdf') + ';base64,' + data.attachment.file_data;
          a.download = fileName || 'attachment';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          showToast('ダウンロード完了');
        } else { showToast('ダウンロード失敗', true); }
      } catch(e) { showToast('ダウンロードエラー', true); }
    }
    window.downloadPartnerAttachment = downloadPartnerAttachment;

    // === 画像リサイズユーティリティ（スマホ高解像度対応、Blobで返す） ===
    function resizeImageToBlob(file, maxWidth, maxHeight, quality) {
      maxWidth = maxWidth || 1920;
      maxHeight = maxHeight || 1920;
      quality = quality || 0.80;
      return new Promise(function(resolve, reject) {
        // 小さい画像（1.5MB以下）はリサイズ不要
        if (file.size <= 1.5 * 1024 * 1024) { resolve(file); return; }
        var blobUrl = null;
        function cleanup() { if (blobUrl) { try { URL.revokeObjectURL(blobUrl); } catch(e){} } }
        try { blobUrl = URL.createObjectURL(file); } catch(e) { resolve(file); return; }
        var img = new Image();
        img.onload = function() {
          try {
            var w = img.width, h = img.height;
            if (w <= maxWidth && h <= maxHeight && file.size <= 3 * 1024 * 1024) { cleanup(); resolve(file); return; }
            if (w > maxWidth || h > maxHeight) {
              var ratio = Math.min(maxWidth / w, maxHeight / h);
              w = Math.round(w * ratio); h = Math.round(h * ratio);
            }
            var canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            var ctx = canvas.getContext('2d');
            if (!ctx) { cleanup(); resolve(file); return; }
            ctx.drawImage(img, 0, 0, w, h);
            canvas.toBlob(function(blob) {
              canvas.width = 0; canvas.height = 0; cleanup();
              if (blob && blob.size > 0) { resolve(new File([blob], file.name || 'photo.jpg', { type: 'image/jpeg' })); }
              else { resolve(file); }
            }, 'image/jpeg', quality);
          } catch(e) { cleanup(); resolve(file); }
        };
        img.onerror = function() { cleanup(); resolve(file); };
        img.src = blobUrl;
      });
    }

    // === リトライ付きfetch ===
    async function fetchWithRetry(url, options, maxRetries) {
      maxRetries = maxRetries || 3;
      var lastError;
      for (var attempt = 0; attempt < maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            showToast('リトライ中... (' + (attempt + 1) + '/' + maxRetries + ')');
            await new Promise(function(r) { setTimeout(r, 1000 * attempt); });
          }
          var res = await fetch(url, options);
          return res;
        } catch(e) {
          lastError = e;
          // AbortErrorの場合はリトライしない
          if (e.name === 'AbortError') throw e;
        }
      }
      throw lastError;
    }

    // === 写真アップロード（車両単位） ===
    async function uploadVehiclePhoto(jobId, vid, category, input) {
      if (!input || !input.files || !input.files[0]) return;
      var file = input.files[0];
      // ファイル参照を保持してからクリア
      var fileRef = file;
      
      if (fileRef.size > 25 * 1024 * 1024) { showToast('25MB以下の画像を選択してください', true); input.value = ''; return; }
      
      // プログレスUI表示
      var toastId = 'upload_' + Date.now();
      showUploadProgress(toastId, '写真を処理中...', 0);
      
      try {
        // Step 1: リサイズ
        showUploadProgress(toastId, '画像を最適化中...', 10);
        var resized = await resizeImageToBlob(fileRef, 1920, 1920, 0.80);
        
        // リサイズ後も大きすぎる場合、さらに圧縮
        if (resized.size > 8 * 1024 * 1024) {
          showUploadProgress(toastId, 'さらに圧縮中...', 20);
          resized = await resizeImageToBlob(resized, 1280, 1280, 0.65);
        }
        
        // Step 2: FormDataでバイナリ送信
        showUploadProgress(toastId, 'アップロード中...', 30);
        var fd = new FormData();
        fd.append('photo', resized);
        fd.append('category', category);

        // タイムアウト付き（60秒）
        var controller = new AbortController();
        var timeoutId = setTimeout(function() { controller.abort(); }, 60000);
        
        var res = await fetchWithRetry('/api/partner/me/jobs/' + jobId + '/vehicles/' + vid + '/photos', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token },
          body: fd,
          signal: controller.signal
        }, 3);
        
        clearTimeout(timeoutId);
        input.value = '';
        
        if (res.ok) {
          showUploadProgress(toastId, 'アップロード完了!', 100);
          setTimeout(function() { hideUploadProgress(toastId); }, 1500);
          openJobDetail(jobId);
        } else {
          var d = await res.json().catch(function(){return {};});
          hideUploadProgress(toastId);
          showToast(d.error || 'アップロード失敗 (' + res.status + ')', true);
        }
      } catch(e) {
        input.value = '';
        hideUploadProgress(toastId);
        if (e.name === 'AbortError') {
          showToast('タイムアウト: 回線状況を確認してください', true);
        } else {
          showToast('アップロード失敗: ' + (e.message || '不明なエラー'), true);
        }
      }
    }
    window.uploadVehiclePhoto = uploadVehiclePhoto;

    async function saveVehicleReport(jobId, vid) {
      var report = document.getElementById('vr_' + vid).value;
      var msgEl = document.getElementById('vrMsg_' + vid);
      try {
        var res = await fetch('/api/partner/me/jobs/' + jobId + '/vehicles/' + vid, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ work_report: report })
        });
        if (res.ok) { msgEl.textContent = '保存しました'; msgEl.className = 'text-[10px] text-green-600'; showToast('作業報告を保存しました'); }
        else { msgEl.textContent = '保存失敗'; msgEl.className = 'text-[10px] text-red-600'; }
      } catch(e) { msgEl.textContent = 'エラー'; msgEl.className = 'text-[10px] text-red-600'; }
    }
    window.saveVehicleReport = saveVehicleReport;

    async function saveVehicleStatus(jobId, vid) {
      var status = document.getElementById('vs_' + vid).value;
      var msgEl = document.getElementById('vrMsg_' + vid);
      try {
        var res = await fetch('/api/partner/me/jobs/' + jobId + '/vehicles/' + vid, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ status: status })
        });
        if (res.ok) { msgEl.textContent = '更新しました'; msgEl.className = 'text-[10px] text-green-600'; showToast('ステータスを更新しました'); }
        else { msgEl.textContent = '更新失敗'; msgEl.className = 'text-[10px] text-red-600'; }
      } catch(e) { msgEl.textContent = 'エラー'; msgEl.className = 'text-[10px] text-red-600'; }
    }
    window.saveVehicleStatus = saveVehicleStatus;

    async function saveJobDetails(jobId) {
      var msgEl = document.getElementById('jdMsg');
      try {
        var res = await fetch('/api/partner/me/jobs/' + jobId + '/details', {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({
            tracking_number: document.getElementById('jd_tracking').value,
            maker_name: document.getElementById('jd_maker').value,
            car_model: document.getElementById('jd_car_model').value,
            car_model_code: document.getElementById('jd_car_code').value,
            general_memo: document.getElementById('jd_memo').value
          })
        });
        if (res.ok) { msgEl.textContent = '保存しました'; msgEl.className = 'text-xs text-green-600'; showToast('詳細情報を保存しました'); }
        else { msgEl.textContent = '保存失敗'; msgEl.className = 'text-xs text-red-600'; }
      } catch(e) { msgEl.textContent = 'エラー'; msgEl.className = 'text-xs text-red-600'; }
    }
    window.saveJobDetails = saveJobDetails;

    async function saveJobReport(jobId) {
      var msgEl = document.getElementById('jrMsg');
      try {
        var res = await fetch('/api/partner/me/jobs/' + jobId + '/details', {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ work_report: document.getElementById('jr_report').value })
        });
        if (res.ok) { msgEl.textContent = '保存しました'; msgEl.className = 'text-xs text-green-600'; showToast('作業報告を保存しました'); }
        else { msgEl.textContent = '保存失敗'; msgEl.className = 'text-xs text-red-600'; }
      } catch(e) { msgEl.textContent = 'エラー'; msgEl.className = 'text-xs text-red-600'; }
    }
    window.saveJobReport = saveJobReport;

    // === 写真アップロード（案件単位） ===
    async function uploadJobPhoto(jobId, category, input) {
      if (!input || !input.files || !input.files[0]) return;
      var file = input.files[0];
      var fileRef = file;
      
      if (fileRef.size > 25 * 1024 * 1024) { showToast('25MB以下の画像を選択してください', true); input.value = ''; return; }
      
      var toastId = 'upload_' + Date.now();
      showUploadProgress(toastId, '写真を処理中...', 0);
      
      try {
        showUploadProgress(toastId, '画像を最適化中...', 10);
        var resized = await resizeImageToBlob(fileRef, 1920, 1920, 0.80);
        
        if (resized.size > 8 * 1024 * 1024) {
          showUploadProgress(toastId, 'さらに圧縮中...', 20);
          resized = await resizeImageToBlob(resized, 1280, 1280, 0.65);
        }
        
        showUploadProgress(toastId, 'アップロード中...', 30);
        var fd = new FormData();
        fd.append('photo', resized);
        fd.append('category', category);
        
        var controller = new AbortController();
        var timeoutId = setTimeout(function() { controller.abort(); }, 60000);
        
        var res = await fetchWithRetry('/api/partner/me/jobs/' + jobId + '/photos', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token },
          body: fd,
          signal: controller.signal
        }, 3);
        
        clearTimeout(timeoutId);
        input.value = '';
        
        if (res.ok) {
          showUploadProgress(toastId, 'アップロード完了!', 100);
          setTimeout(function() { hideUploadProgress(toastId); }, 1500);
          openJobDetail(jobId);
        } else {
          var d = await res.json().catch(function(){return {};});
          hideUploadProgress(toastId);
          showToast(d.error || 'アップロード失敗 (' + res.status + ')', true);
        }
      } catch(e) {
        input.value = '';
        hideUploadProgress(toastId);
        if (e.name === 'AbortError') {
          showToast('タイムアウト: 回線状況を確認してください', true);
        } else {
          showToast('アップロード失敗: ' + (e.message || '不明なエラー'), true);
        }
      }
    }
    window.uploadJobPhoto = uploadJobPhoto;

    async function viewPhotoImage(jobId, photoId) {
      var modal = document.getElementById('photoPreviewModal');
      var img = document.getElementById('photoPreviewImg');
      var label = document.getElementById('photoPreviewLabel');
      // supabase_urlがある場合は直接URL使用
      var photoList = window._currentPhotoList || [];
      var photo = photoList.find(function(p){return p.id===photoId;});
      var imgUrl = (photo && photo.supabase_url) ? photo.supabase_url : ('/api/partner/me/jobs/' + jobId + '/photos/' + photoId + '/image');
      img.src = imgUrl;
      label.textContent = '写真プレビュー';
      // Find photo index for navigation
      window._photoViewJobId = jobId;
      window._photoViewList = window._currentPhotoList || [];
      var idx = window._photoViewList.findIndex(function(p){return p.id===photoId;});
      window._photoViewIdx = idx >= 0 ? idx : 0;
      updatePhotoCounter();
      modal.classList.remove('hidden');
    }
    window.viewPhotoImage = viewPhotoImage;

    function closePhotoPreview() {
      document.getElementById('photoPreviewModal').classList.add('hidden');
    }
    window.closePhotoPreview = closePhotoPreview;

    function navigatePhoto(dir) {
      var list = window._photoViewList || [];
      if (list.length === 0) return;
      window._photoViewIdx = (window._photoViewIdx + dir + list.length) % list.length;
      var p = list[window._photoViewIdx];
      var img = document.getElementById('photoPreviewImg');
      var imgUrl = p.supabase_url || ('/api/partner/me/jobs/' + window._photoViewJobId + '/photos/' + p.id + '/image');
      img.src = imgUrl;
      var catName = PHOTO_CATS[p.category] || p.category;
      document.getElementById('photoPreviewLabel').textContent = catName;
      updatePhotoCounter();
    }
    window.navigatePhoto = navigatePhoto;

    function updatePhotoCounter() {
      var list = window._photoViewList || [];
      var counter = document.getElementById('photoCounter');
      if (list.length > 0) counter.textContent = (window._photoViewIdx + 1) + ' / ' + list.length;
      else counter.textContent = '';
    }

    async function openPhotoGrid(jobId) {
      var modal = document.getElementById('photoGridModal');
      var content = document.getElementById('photoGridContent');
      modal.classList.remove('hidden');
      content.innerHTML = '<div class="flex justify-center py-8"><div class="w-6 h-6 border-2 border-sva-red border-t-transparent rounded-full animate-spin"></div></div>';
      try {
        var res = await fetch('/api/partner/me/jobs/' + jobId + '/photos', { headers: { 'Authorization': 'Bearer ' + token } });
        var data = await res.json();
        var photos = data.photos || [];
        window._currentPhotoList = photos;
        if (photos.length === 0) {
          content.innerHTML = '<div class="text-center py-12 text-gray-400"><svg class="w-12 h-12 mx-auto mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg><p class="text-sm">まだ写真がありません</p></div>';
          return;
        }
        // Group by category
        var grouped = {};
        photos.forEach(function(p) {
          var cat = p.category || 'other';
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(p);
        });
        var html = '<div class="text-xs text-gray-500 mb-3">合計 ' + photos.length + '枚</div>';
        Object.keys(grouped).forEach(function(cat) {
          var catName = PHOTO_CATS[cat] || cat;
          html += '<div class="mb-4"><p class="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-sva-red"></span>' + catName + ' (' + grouped[cat].length + ')</p>';
          html += '<div class="grid grid-cols-3 sm:grid-cols-4 gap-2">';
          grouped[cat].forEach(function(p) {
            var imgUrl = p.supabase_url || ('/api/partner/me/jobs/' + jobId + '/photos/' + p.id + '/image');
            html += '<div class="aspect-square rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:shadow-md transition-shadow bg-gray-50" onclick="viewPhotoImage(' + jobId + ',' + p.id + ')">'
              + '<img src="' + imgUrl + '" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display=\\'none\\'">'
              + '</div>';
          });
          html += '</div></div>';
        });
        content.innerHTML = html;
      } catch(e) { content.innerHTML = '<p class="text-sm text-red-500 text-center">読み込み失敗</p>'; }
    }
    window.openPhotoGrid = openPhotoGrid;

    async function viewPhoto(jobId, photoId) {
      // Legacy: fallback to image endpoint
      viewPhotoImage(jobId, photoId);
    }
    window.viewPhoto = viewPhoto;

    async function deletePhoto(jobId, photoId) {
      if (!confirm('この写真を削除しますか？')) return;
      try {
        await fetch('/api/partner/me/jobs/' + jobId + '/photos/' + photoId, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
        showToast('写真を削除しました');
        openJobDetail(jobId);
      } catch(e) { showToast('削除失敗', true); }
    }
    window.deletePhoto = deletePhoto;

    async function saveJobTracking(jobId) {
      var msgEl = document.getElementById('ptTrackMsg');
      try {
        var res = await fetch('/api/partner/me/jobs/' + jobId + '/tracking', {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({
            shipping_status: document.getElementById('pt_shipping').value,
            schedule_status: document.getElementById('pt_schedule').value,
            confirmed_work_date: document.getElementById('pt_work_date').value,
            work_status: document.getElementById('pt_work').value,
            status_note: document.getElementById('pt_note').value
          })
        });
        if (res.ok) { msgEl.textContent = '更新しました'; msgEl.className = 'text-xs text-green-600'; showToast('トラッキングを更新しました'); loadStats(); }
        else { var d = await res.json(); msgEl.textContent = d.error || '更新失敗'; msgEl.className = 'text-xs text-red-600'; }
      } catch(e) { msgEl.textContent = 'エラー'; msgEl.className = 'text-xs text-red-600'; }
    }

    async function updateJobStatus(id, status, forceComplete) {
      try {
        var payload = { status: status };
        if (forceComplete) payload.force_complete = true;
        var res = await fetch('/api/partner/me/jobs/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify(payload) });
        if (!res.ok) {
          var d = await res.json().catch(function(){ return {}; });
          if (d.code === 'ALL_PENDING') {
            showToast(d.error, true);
            return;
          }
          if (d.code === 'INCOMPLETE_VEHICLES') {
            var vehList = (d.vehicles || []).map(function(v) {
              var sl = { pending: '未着手', in_progress: '作業中', issue: '問題あり' };
              return '#' + v.seq + ' ' + v.maker + ' ' + v.model + '（' + (sl[v.status]||v.status) + '）';
            }).join('\\n');
            var msg = '以下の車両が未完了です:\\n\\n' + vehList + '\\n\\nこのまま完了報告しますか？';
            if (confirm(msg)) {
              updateJobStatus(id, status, true);
            }
            return;
          }
          showToast(d.error || 'ステータス更新失敗', true);
          return;
        }
        document.getElementById('jobDetailModal').classList.add('hidden');
        showToast('ステータスを更新しました');
        loadJobs(); loadStats();
      } catch(e) { showToast('更新失敗', true); }
    }

    async function saveJobMemo(id) {
      var memo = document.getElementById('jobMemoInput').value;
      try {
        await fetch('/api/partner/me/jobs/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ partner_memo: memo }) });
        showToast('メモを保存しました');
      } catch(e) { showToast('保存失敗', true); }
    }

    // --- Messages ---
    async function loadMessages() {
      var el = document.getElementById('messagesList');
      try {
        var res = await fetch('/api/partner/me/messages', { headers: { 'Authorization': 'Bearer ' + token } });
        var data = await res.json();
        if (!data.messages || !data.messages.length) { el.innerHTML = '<div class="bg-white rounded-xl card-shadow border border-gray-100 p-12 text-center"><p class="text-gray-400 text-sm">メッセージはありません</p></div>'; return; }
        el.innerHTML = data.messages.map(function(m) {
          var isFromSVA = m.direction === 'to_partner';
          var unread = isFromSVA && !m.is_read;
          var time = m.created_at ? new Date(m.created_at).toLocaleString('ja-JP') : '';
          return '<div class="bg-white rounded-xl card-shadow border ' + (unread ? 'border-sva-red/30 bg-red-50/20' : 'border-gray-100') + ' p-5' + (unread ? ' cursor-pointer" onclick="markRead(' + m.id + ',this)"' : '"') + '>'
            + '<div class="flex items-center gap-2 mb-2"><span class="text-xs font-medium px-2 py-0.5 rounded ' + (isFromSVA ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700') + '">' + (isFromSVA ? 'SVA事務局から' : '送信済み') + '</span>'
            + (unread ? '<span class="text-[10px] bg-sva-red text-white px-1.5 py-0.5 rounded font-bold">未読</span>' : '')
            + '<span class="text-[10px] text-gray-400 ml-auto">' + time + '</span></div>'
            + '<p class="text-sm font-bold text-sva-dark mb-1">' + escH(m.subject) + '</p>'
            + '<p class="text-sm text-gray-600 whitespace-pre-line">' + escH(m.body) + '</p></div>';
        }).join('');
      } catch(e) { el.innerHTML = '<p class="text-sm text-red-500">読み込み失敗</p>'; }
    }

    async function markRead(id, el) {
      try {
        await fetch('/api/partner/me/messages/' + id + '/read', { method: 'PUT', headers: { 'Authorization': 'Bearer ' + token } });
        if (el) { el.classList.remove('border-sva-red/30', 'bg-red-50/20'); el.classList.add('border-gray-100'); el.onclick = null; var badge = el.querySelector('.bg-sva-red'); if (badge) badge.remove(); }
        loadStats();
      } catch(e) {}
    }

    // Reply
    document.getElementById('sendReplyBtn').addEventListener('click', async function() {
      var subj = document.getElementById('replySubject').value;
      var body = document.getElementById('replyBody').value;
      if (!body) { showToast('本文を入力してください', true); return; }
      try {
        await fetch('/api/partner/me/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ subject: subj || '返信', body: body }) });
        document.getElementById('replySubject').value = '';
        document.getElementById('replyBody').value = '';
        showToast('メッセージを送信しました');
        loadMessages();
      } catch(e) { showToast('送信失敗', true); }
    });

    function escH(s) { if (!s) return ''; var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

    // Expose to global scope for inline onclick handlers
    window.openJobDetail = openJobDetail;
    window.updateJobStatus = updateJobStatus;
    window.saveJobMemo = saveJobMemo;
    window.saveJobTracking = saveJobTracking;
    window.markRead = markRead;

    // --- Toast ---
    // === アップロードプログレスUI ===
    function showUploadProgress(id, msg, percent) {
      var el = document.getElementById(id);
      if (!el) {
        el = document.createElement('div');
        el.id = id;
        el.className = 'fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-[100] bg-white rounded-xl shadow-2xl border border-gray-200 p-4';
        el.innerHTML = '<div class="flex items-center gap-3 mb-2">'
          + '<div class="w-8 h-8 rounded-full bg-sva-red/10 flex items-center justify-center shrink-0"><svg class="w-4 h-4 text-sva-red animate-spin" id="' + id + '_spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg></div>'
          + '<div class="min-w-0 flex-1"><p class="text-sm font-medium text-gray-800" id="' + id + '_msg"></p>'
          + '<div class="w-full bg-gray-200 rounded-full h-1.5 mt-1"><div class="bg-sva-red h-1.5 rounded-full transition-all duration-300" id="' + id + '_bar" style="width:0%"></div></div></div></div>';
        document.body.appendChild(el);
      }
      var msgEl = document.getElementById(id + '_msg');
      var barEl = document.getElementById(id + '_bar');
      var spinEl = document.getElementById(id + '_spin');
      if (msgEl) msgEl.textContent = msg;
      if (barEl) barEl.style.width = percent + '%';
      if (percent >= 100 && spinEl) spinEl.classList.remove('animate-spin');
    }
    function hideUploadProgress(id) {
      var el = document.getElementById(id);
      if (el) { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);}, 300); }
    }

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
