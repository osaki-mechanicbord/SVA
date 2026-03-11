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
          <!-- Job detail modal -->
          <div id="jobDetailModal" class="hidden fixed inset-0 bg-black/40 z-[90] flex items-center justify-center p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
              <div id="jobDetailContent" class="p-6"></div>
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
            + '<div class="flex items-center gap-2 mb-2"><span class="px-2 py-0.5 text-xs rounded font-medium border ' + s[1] + '">' + s[0] + '</span><span class="text-xs text-gray-400 ml-auto">' + date + '</span></div>'
            + '<p class="text-sm font-bold text-sva-dark mb-2">' + escH(j.title) + '</p>'
            + '<div class="flex items-center gap-1.5 flex-wrap mb-2"><span class="px-1.5 py-0.5 text-[10px] rounded font-medium ' + sh[1] + '">製品:' + sh[0] + '</span><span class="px-1.5 py-0.5 text-[10px] rounded font-medium ' + sc[1] + '">日程:' + sc[0] + '</span><span class="px-1.5 py-0.5 text-[10px] rounded font-medium ' + wk[1] + '">作業:' + wk[0] + '</span></div>'
            + '<div class="flex flex-wrap gap-3 text-xs text-gray-500">'
            + (j.vehicle_type ? '<span>車両: ' + escH(j.vehicle_type) + '</span>' : '')
            + (j.device_type ? '<span>装置: ' + escH(j.device_type) + '</span>' : '')
            + (j.location ? '<span>場所: ' + escH(j.location) + '</span>' : '')
            + '</div></div>';
        }).join('');
      } catch(e) { el.innerHTML = '<p class="text-sm text-red-500">読み込み失敗</p>'; }
    }

    async function openJobDetail(id) {
      var modal = document.getElementById('jobDetailModal');
      var content = document.getElementById('jobDetailContent');
      modal.classList.remove('hidden');
      content.innerHTML = '<div class="flex items-center justify-center py-8"><div class="w-6 h-6 border-2 border-sva-red border-t-transparent rounded-full animate-spin"></div></div>';
      try {
        var res = await fetch('/api/partner/me/jobs/' + id, { headers: { 'Authorization': 'Bearer ' + token } });
        var data = await res.json(); var j = data.job;
        var s = JOB_S[j.status] || JOB_S.pending;
        var sh = SHIP_S[j.shipping_status] || SHIP_S.not_shipped;
        var sc = SCHED_S[j.schedule_status] || SCHED_S.not_started;
        var wk = WORK_S[j.work_status] || WORK_S.scheduling;

        var statusBtns = '';
        if (j.status === 'pending') {
          statusBtns = '<div class="flex gap-2 mt-4"><button onclick="updateJobStatus(' + j.id + ',\\'accepted\\')" class="flex-1 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">受諾する</button><button onclick="updateJobStatus(' + j.id + ',\\'declined\\')" class="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">辞退する</button></div>';
        } else if (j.status === 'accepted') {
          statusBtns = '<div class="flex gap-2 mt-4"><button onclick="updateJobStatus(' + j.id + ',\\'in_progress\\')" class="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">対応開始</button></div>';
        } else if (j.status === 'in_progress') {
          statusBtns = '<div class="flex gap-2 mt-4"><button onclick="updateJobStatus(' + j.id + ',\\'completed\\')" class="flex-1 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">完了報告</button></div>';
        }

        // Tracking select options
        var shipOpts = [['not_shipped','未発送'],['shipped','発送済'],['received','受取済']].map(function(o) { return '<option value="' + o[0] + '"' + (j.shipping_status === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');
        var schedOpts = [['not_started','未着手'],['contacting','連絡中'],['waiting_callback','折り返し待ち'],['date_confirmed','作業日決定']].map(function(o) { return '<option value="' + o[0] + '"' + (j.schedule_status === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');
        var workOpts = [['scheduling','日程調整中'],['completed','完了'],['user_postponed','ユーザー都合延期'],['self_postponed','自己都合延期'],['maker_postponed','メーカー都合延期'],['cancelled','キャンセル']].map(function(o) { return '<option value="' + o[0] + '"' + (j.work_status === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');

        var updatedBy = j.last_status_updated_by === 'admin' ? 'SVA事務局' : j.last_status_updated_by === 'partner' ? 'パートナー' : '-';

        content.innerHTML = '<div class="flex items-center justify-between mb-4"><h3 class="text-base font-bold text-sva-dark">案件詳細</h3><button onclick="document.getElementById(\\'jobDetailModal\\').classList.add(\\'hidden\\')" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button></div>'
          + '<span class="px-2 py-0.5 text-xs rounded font-medium border ' + s[1] + '">' + s[0] + '</span>'
          + '<h4 class="text-sm font-bold text-sva-dark mt-3 mb-3">' + escH(j.title) + '</h4>'
          + '<div class="grid grid-cols-2 gap-3 text-sm mb-4">'
          + '<div><p class="text-xs text-gray-400">車両タイプ</p><p class="font-medium">' + escH(j.vehicle_type || '-') + '</p></div>'
          + '<div><p class="text-xs text-gray-400">取付装置</p><p class="font-medium">' + escH(j.device_type || '-') + '</p></div>'
          + '<div><p class="text-xs text-gray-400">作業場所</p><p class="font-medium">' + escH(j.location || '-') + '</p></div>'
          + '<div><p class="text-xs text-gray-400">希望日程</p><p class="font-medium">' + escH(j.preferred_date || '-') + '</p></div>'
          + '<div><p class="text-xs text-gray-400">予算</p><p class="font-medium">' + escH(j.budget || '-') + '</p></div>'
          + '</div>'
          + (j.description ? '<div class="mb-4"><p class="text-xs text-gray-400 mb-1">詳細</p><p class="text-sm text-gray-600 whitespace-pre-line bg-gray-50 rounded-lg p-3">' + escH(j.description) + '</p></div>' : '')

          // ===== Tracking Status Section =====
          + '<div class="border-t border-gray-100 pt-4 mt-4">'
          + '<h5 class="text-sm font-bold text-sva-dark mb-1">進捗トラッキング</h5>'
          + '<p class="text-[10px] text-gray-400 mb-3">SVA・パートナー双方が編集・確認できます</p>'

          // Progress bar
          + '<div class="flex items-center gap-1 mb-4">'
          + '<div class="flex-1 h-1.5 rounded-full ' + (j.shipping_status !== 'not_shipped' ? 'bg-green-400' : 'bg-gray-200') + '"></div>'
          + '<div class="flex-1 h-1.5 rounded-full ' + (j.shipping_status === 'received' ? 'bg-green-400' : 'bg-gray-200') + '"></div>'
          + '<div class="flex-1 h-1.5 rounded-full ' + (j.schedule_status === 'date_confirmed' ? 'bg-green-400' : j.schedule_status !== 'not_started' ? 'bg-yellow-400' : 'bg-gray-200') + '"></div>'
          + '<div class="flex-1 h-1.5 rounded-full ' + (j.work_status === 'completed' ? 'bg-green-400' : j.work_status !== 'scheduling' ? 'bg-yellow-400' : 'bg-gray-200') + '"></div>'
          + '</div>'

          // Tracking selects in compact grid
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
          + '</div></div>'

          // Memo & status buttons
          + '<div class="border-t border-gray-100 pt-4 mt-4">'
          + '<div class="mb-2"><label class="text-xs text-gray-400 mb-1 block">メモ（自分用）</label><textarea id="jobMemoInput" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-sva-red">' + escH(j.partner_memo || '') + '</textarea><button onclick="saveJobMemo(' + j.id + ')" class="mt-1 px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200">メモ保存</button></div>'
          + statusBtns + '</div>';
      } catch(e) { content.innerHTML = '<p class="text-sm text-red-500">読み込み失敗</p>'; }
    }

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

    async function updateJobStatus(id, status) {
      try {
        await fetch('/api/partner/me/jobs/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ status: status }) });
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
