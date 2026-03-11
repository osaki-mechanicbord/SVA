export function adminPage(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
          <a href="/column" target="_blank" class="text-xs text-gray-400 hover:text-white transition-colors">サイトを表示</a>
          <button id="logoutBtn" class="text-xs text-gray-400 hover:text-white transition-colors">ログアウト</button>
        </div>
      </div>
    </header>

    <!-- Tab Navigation -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-0">
        <button id="tabArticles" onclick="switchTab('articles')" class="px-5 py-3 text-sm font-medium border-b-2 transition-colors border-sva-red text-sva-red">記事管理</button>
        <button id="tabImages" onclick="switchTab('images')" class="px-5 py-3 text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700">画像管理</button>
        <button id="tabPartners" onclick="switchTab('partners')" class="px-5 py-3 text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700">パートナー管理</button>
        <button id="tabJobs" onclick="switchTab('jobs')" class="px-5 py-3 text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700">案件依頼</button>
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
    if (authToken) { showDashboard(); loadArticles(1); }

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
        showDashboard(); loadArticles(1);
      } catch (err) {
        errEl.textContent = 'ユーザー名またはパスワードが正しくありません';
        errEl.classList.remove('hidden');
      }
    });

    document.getElementById('logoutBtn').addEventListener('click', function() {
      authToken = ''; sessionStorage.removeItem('sva_token');
      document.getElementById('adminDashboard').classList.add('hidden');
      document.getElementById('loginScreen').classList.remove('hidden');
    });

    function showDashboard() {
      document.getElementById('loginScreen').classList.add('hidden');
      document.getElementById('adminDashboard').classList.remove('hidden');
    }

    // ===== Tabs =====
    const TABS = ['articles','images','partners','jobs'];
    function switchTab(tab) {
      TABS.forEach(function(t) {
        var el = document.getElementById(t + 'Tab'); if (el) el.classList.toggle('hidden', t !== tab);
        var btn = document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1));
        if (btn) { btn.classList.toggle('border-sva-red', t === tab); btn.classList.toggle('text-sva-red', t === tab); btn.classList.toggle('border-transparent', t !== tab); btn.classList.toggle('text-gray-500', t !== tab); }
      });
      if (tab === 'images') loadImages(1);
      if (tab === 'partners') loadPartners(1);
      if (tab === 'jobs') loadJobs(1);
    }

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
          body: JSON.stringify({ company_name: document.getElementById('ep_company').value, representative_name: document.getElementById('ep_name').value, phone: document.getElementById('ep_phone').value, region: document.getElementById('ep_region').value, specialties: document.getElementById('ep_specialties').value, rank: document.getElementById('ep_rank').value, status: document.getElementById('ep_status').value, notes: document.getElementById('ep_notes').value })
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
        + '<div class="flex items-center gap-3 mt-5"><button onclick="createPartner()" class="px-6 py-2 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800">登録する</button><span id="npMsg" class="text-sm"></span></div></div>';
    }

    async function createPartner() {
      var email = document.getElementById('np_email').value;
      var pw = document.getElementById('np_password').value;
      if (!email || !pw) { document.getElementById('npMsg').textContent = 'メールとパスワードは必須です'; document.getElementById('npMsg').className = 'text-sm text-red-600'; return; }
      try {
        var res = await fetch(API + '/admin/partners', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({ email: email, password: pw, company_name: document.getElementById('np_company').value, representative_name: document.getElementById('np_name').value, phone: document.getElementById('np_phone').value, region: document.getElementById('np_region').value, specialties: document.getElementById('np_specialties').value, rank: document.getElementById('np_rank').value })
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
      var url = API + '/admin/jobs?page=' + page;
      if (status) url += '&status=' + status;
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
          + '<div class="flex items-center gap-2 mb-1.5 flex-wrap"><span class="px-2 py-0.5 text-xs rounded font-medium border ' + s[1] + '">' + s[0] + '</span><span class="text-xs text-gray-400">' + esc(j.company_name || '-') + '</span></div>'
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

    function showNewJobForm() {
      document.getElementById('jobListView').classList.add('hidden');
      document.getElementById('jobDetailView').classList.remove('hidden');
      document.getElementById('backToJobListBtn').classList.remove('hidden');
      document.getElementById('jobViewTitle').textContent = '新規案件作成';
      document.getElementById('jobDetailView').innerHTML = '<div class="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">'
        + '<h3 class="font-bold text-sva-dark text-base mb-4">案件依頼を作成</h3>'
        + '<div class="mb-4"><label class="block text-xs font-medium text-gray-600 mb-1">送信先パートナー <span class="text-red-500">*</span></label>'
        + '<div class="flex gap-2"><input id="nj_partner_search" placeholder="会社名・名前で検索..." class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red">'
        + '<button onclick="searchJobPartner()" class="px-4 py-2 bg-gray-100 text-sm rounded-lg hover:bg-gray-200">検索</button></div>'
        + '<div id="njPartnerResults" class="mt-2 space-y-1"></div>'
        + '<input type="hidden" id="nj_partner_id" value="">'
        + '<p id="njSelectedPartner" class="text-sm text-sva-red font-medium mt-2"></p></div>'
        + '<div class="space-y-4">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">案件名 <span class="text-red-500">*</span></label><input id="nj_title" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="例: フォークリフトAIカメラ取付 10台"></div>'
        + '<div class="grid sm:grid-cols-2 gap-4">'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">車両タイプ</label><input id="nj_vehicle" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="フォークリフト"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">取付装置</label><input id="nj_device" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="人検知AIカメラ"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">作業場所</label><input id="nj_location" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="大阪府大阪市"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">希望日程</label><input id="nj_date" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="2026年4月中旬希望"></div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">予算</label><input id="nj_budget" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="¥500,000"></div>'
        + '</div>'
        + '<div><label class="block text-xs font-medium text-gray-600 mb-1">詳細説明</label><textarea id="nj_desc" rows="4" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" placeholder="案件の詳細..."></textarea></div>'
        + '</div>'
        + '<div class="flex items-center gap-3 mt-5"><button onclick="createJob()" class="px-6 py-2 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800">案件を送信</button><span id="njMsg" class="text-sm"></span></div></div>';
    }

    async function searchJobPartner() {
      var q = document.getElementById('nj_partner_search').value;
      if (!q) return;
      var res = await fetch(API + '/admin/partners?search=' + encodeURIComponent(q), { headers: { 'Authorization': 'Bearer ' + authToken } });
      var data = await res.json();
      var el = document.getElementById('njPartnerResults');
      if (!data.partners || !data.partners.length) { el.innerHTML = '<p class="text-xs text-gray-400">見つかりません</p>'; return; }
      el.innerHTML = data.partners.slice(0, 5).map(function(p) {
        return '<button onclick="selectJobPartner(' + p.id + ',\\'' + esc(p.company_name || p.representative_name) + '\\')" class="w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm">' + esc(p.company_name || '-') + ' / ' + esc(p.representative_name) + ' <span class="text-gray-400">(' + esc(p.email) + ')</span></button>';
      }).join('');
    }

    function selectJobPartner(id, name) {
      document.getElementById('nj_partner_id').value = id;
      document.getElementById('njSelectedPartner').textContent = '選択: ' + name;
      document.getElementById('njPartnerResults').innerHTML = '';
    }

    async function createJob() {
      var pid = document.getElementById('nj_partner_id').value;
      var title = document.getElementById('nj_title').value;
      if (!pid || !title) { document.getElementById('njMsg').textContent = 'パートナーと案件名は必須です'; document.getElementById('njMsg').className = 'text-sm text-red-600'; return; }
      try {
        var res = await fetch(API + '/admin/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({ partner_id: Number(pid), title: title, description: document.getElementById('nj_desc').value, vehicle_type: document.getElementById('nj_vehicle').value, device_type: document.getElementById('nj_device').value, location: document.getElementById('nj_location').value, preferred_date: document.getElementById('nj_date').value, budget: document.getElementById('nj_budget').value })
        });
        var data = await res.json();
        if (!res.ok) { document.getElementById('njMsg').textContent = data.error || '作成失敗'; document.getElementById('njMsg').className = 'text-sm text-red-600'; return; }
        showToast('案件を送信しました（パートナーに通知済み）');
        loadJobs(1);
      } catch(e) { document.getElementById('njMsg').textContent = 'エラー'; document.getElementById('njMsg').className = 'text-sm text-red-600'; }
    }

    var currentJobData = null;
    var currentJobVehicles = [];
    var currentVehicleId = null;

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
        + '<div class="flex items-center gap-2 mb-2"><span class="px-2 py-0.5 text-xs rounded font-medium border ' + s[1] + '">' + s[0] + '</span><span class="text-xs text-gray-400">ID: ' + j.id + '</span></div>'
        + '<h3 class="text-lg font-bold text-sva-dark">' + esc(j.title) + '</h3>'
        + '<p class="text-sm text-gray-500 mt-1">' + esc(j.company_name||'-') + ' / ' + esc(j.representative_name||'-') + '</p>'
        + '<div class="flex items-center gap-2 mt-3 flex-wrap">'
        + (vCount > 0 ? '<span class="px-2 py-1 text-xs rounded-lg font-medium bg-blue-50 text-blue-700">車両 ' + vDone + '/' + vCount + '台完了</span>' : '')
        + (totalProducts > 0 ? '<span class="px-2 py-1 text-xs rounded-lg font-medium bg-purple-50 text-purple-700">商品 ' + totalProducts + '点</span>' : '')
        + (totalPhotos > 0 ? '<span class="px-2 py-1 text-xs rounded-lg font-medium bg-emerald-50 text-emerald-700">写真 ' + totalPhotos + '枚</span>' : '')
        + '</div></div>'
        // Tabs
        + '<div class="bg-white border border-gray-200 border-t-0">'
        + '<div class="flex items-center gap-0 px-2">'
        + '<button onclick="switchJobTab(\\'overview\\')" id="jtab_overview" class="px-5 py-3 text-sm font-medium border-b-2 ' + (activeJobTab==='overview'?'border-sva-red text-sva-red':'border-transparent text-gray-500') + '">概要</button>'
        + '<button onclick="switchJobTab(\\'vehicles\\')" id="jtab_vehicles" class="px-5 py-3 text-sm font-medium border-b-2 ' + (activeJobTab==='vehicles'?'border-sva-red text-sva-red':'border-transparent text-gray-500') + '">車両明細 <span class="ml-1 px-1.5 py-0.5 bg-sva-red text-white text-[10px] rounded-full font-bold">' + vCount + '</span></button>'
        + '<button onclick="switchJobTab(\\'tracking\\')" id="jtab_tracking" class="px-5 py-3 text-sm font-medium border-b-2 ' + (activeJobTab==='tracking'?'border-sva-red text-sva-red':'border-transparent text-gray-500') + '">トラッキング</button>'
        + '<button onclick="switchJobTab(\\'photos\\')" id="jtab_photos" class="px-5 py-3 text-sm font-medium border-b-2 ' + (activeJobTab==='photos'?'border-sva-red text-sva-red':'border-transparent text-gray-500') + '">写真 <span class="ml-1 px-1.5 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded-full font-bold">' + totalPhotos + '</span></button>'
        + '</div></div>'
        + '<div class="bg-white border border-gray-200 border-t-0 rounded-b-xl p-6" id="jobTabContent"></div>';
      switchJobTab(activeJobTab);
    }

    function switchJobTab(tab) {
      activeJobTab = tab;
      ['overview','vehicles','tracking','photos'].forEach(function(t) {
        var btn = document.getElementById('jtab_'+t);
        if (btn) { if(t===tab){btn.className='px-5 py-3 text-sm font-medium border-b-2 border-sva-red text-sva-red';}else{btn.className='px-5 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500';}}
      });
      var ct = document.getElementById('jobTabContent');
      if (!ct || !currentJobData) return;
      if (tab==='overview') renderOverviewTab(ct);
      else if (tab==='vehicles') { if(currentVehicleId) renderVehicleDetailView(ct); else renderVehiclesTab(ct); }
      else if (tab==='tracking') renderTrackingTab(ct);
      else if (tab==='photos') renderPhotosTab(ct);
    }

    // ===== Overview Tab =====
    function renderOverviewTab(ct) {
      var j = currentJobData;
      ct.innerHTML = '<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-5">'
        + '<div><p class="text-xs text-gray-400">作業場所</p><p class="font-medium">' + esc(j.location||'-') + '</p></div>'
        + '<div><p class="text-xs text-gray-400">希望日程</p><p class="font-medium">' + esc(j.preferred_date||'-') + '</p></div>'
        + '<div><p class="text-xs text-gray-400">予算</p><p class="font-medium">' + esc(j.budget||'-') + '</p></div>'
        + '<div><p class="text-xs text-gray-400">送り状NO</p><p class="font-medium">' + esc(j.tracking_number||'-') + '</p></div>'
        + '<div><p class="text-xs text-gray-400">車両タイプ</p><p class="font-medium">' + esc(j.vehicle_type||'-') + '</p></div>'
        + '<div><p class="text-xs text-gray-400">装置</p><p class="font-medium">' + esc(j.device_type||'-') + '</p></div>'
        + '<div><p class="text-xs text-gray-400">作成日</p><p class="font-medium">' + fmtDt(j.created_at) + '</p></div>'
        + '</div>'
        + (j.description ? '<div class="mb-5"><p class="text-xs text-gray-400 mb-1">詳細説明</p><div class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-line">' + esc(j.description) + '</div></div>' : '')
        // 案件詳細フィールド（送り状・車両情報など - 既存）
        + '<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">'
        + '<div><p class="text-xs text-gray-400 mb-1">送り状NO</p><input id="aj_tracking" type="text" value="' + esc(j.tracking_number||'') + '" class="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="追跡番号"></div>'
        + '<div><p class="text-xs text-gray-400 mb-1">メーカー名</p><input id="aj_maker" type="text" value="' + esc(j.maker_name||'') + '" class="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '<div><p class="text-xs text-gray-400 mb-1">車種</p><input id="aj_car_model" type="text" value="' + esc(j.car_model||'') + '" class="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '<div><p class="text-xs text-gray-400 mb-1">車両型式</p><input id="aj_car_code" type="text" value="' + esc(j.car_model_code||'') + '" class="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red"></div>'
        + '</div>'
        + '<div class="mb-3"><p class="text-xs text-gray-400 mb-1">作業報告（パートナー記入）</p><div class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-line min-h-[40px]">' + esc(j.work_report||'未記入') + '</div></div>'
        + '<div class="mb-3"><p class="text-xs text-gray-400 mb-1">メモ</p><div class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-line min-h-[30px]">' + esc(j.general_memo||'未記入') + '</div></div>'
        + '<div class="flex items-center gap-3"><button onclick="saveJobDetails(' + j.id + ')" class="px-5 py-2 bg-sva-dark text-white text-sm font-medium rounded-lg hover:bg-gray-800">詳細情報を保存</button><span id="ajdMsg" class="text-sm"></span></div>'
        // 車両サマリー
        + (currentJobVehicles.length > 0
          ? '<div class="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100"><h4 class="text-sm font-bold text-sva-dark mb-3">車両進捗サマリー</h4>'
            + '<div class="grid grid-cols-' + Math.min(currentJobVehicles.length,5) + ' gap-2">' + currentJobVehicles.map(function(v){
              var vs = VEH_STATUS[v.status]||VEH_STATUS.pending;
              return '<div class="bg-white rounded-lg p-3 border border-white shadow-sm"><p class="text-[10px] text-gray-400">#' + v.seq + '</p><p class="text-xs font-bold text-gray-800 truncate">' + esc(v.maker_name) + ' ' + esc(v.car_model) + '</p><span class="inline-block mt-1 px-1.5 py-0.5 text-[10px] rounded font-medium border ' + vs[1] + '">' + vs[0] + '</span></div>';
            }).join('') + '</div><div class="mt-2 text-right"><button onclick="switchJobTab(\\'vehicles\\')" class="text-xs text-blue-700 font-medium hover:underline">車両明細を開く →</button></div></div>'
          : '');
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
      currentJobVehicles.forEach(function(v) {
        var pc = v.photo_counts||{}; var total=0; Object.values(pc).forEach(function(n){total+=n;});
        if (total === 0) return;
        html += '<div class="mb-5"><h4 class="text-sm font-bold text-sva-dark mb-2 flex items-center gap-2"><span class="w-6 h-6 rounded-full bg-sva-red text-white text-xs flex items-center justify-center font-bold">' + v.seq + '</span>' + esc(v.maker_name) + ' ' + esc(v.car_model) + '</h4><div class="flex gap-2 flex-wrap">';
        PHOTO_CATS_ARR.forEach(function(c) {
          var cnt = pc[c[0]]||0; if(cnt===0) return;
          for(var i=0;i<cnt;i++) html += '<div class="w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-sva-red"><svg class="w-5 h-5 text-gray-300 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg><p class="text-[8px] text-gray-400 text-center leading-tight">' + c[1] + '</p></div>';
        });
        html += '</div></div>';
      });
      if (!html) html = '<p class="text-sm text-gray-400 py-4">写真がアップロードされていません</p>';
      ct.innerHTML = html;
    }

    async function saveJobDetails(jobId) {
      var msgEl = document.getElementById('ajdMsg');
      try {
        var res = await fetch(API + '/admin/jobs/' + jobId, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({
            tracking_number: document.getElementById('aj_tracking').value,
            maker_name: document.getElementById('aj_maker').value,
            car_model: document.getElementById('aj_car_model').value,
            car_model_code: document.getElementById('aj_car_code').value
          })
        });
        if (res.ok) { msgEl.textContent = '保存しました'; msgEl.className = 'text-sm text-green-600'; showToast('詳細情報を保存しました'); }
        else { msgEl.textContent = '保存失敗'; msgEl.className = 'text-sm text-red-600'; }
      } catch(e) { msgEl.textContent = 'エラー'; msgEl.className = 'text-sm text-red-600'; }
    }

    async function viewAdminPhoto(jobId, photoId) {
      try {
        var res = await fetch(API + '/admin/jobs/' + jobId + '/photos/' + photoId, { headers: { 'Authorization': 'Bearer ' + authToken } });
        var data = await res.json();
        if (data.photo && data.photo.photo_data) {
          var w = window.open('', '_blank');
          w.document.write('<html><head><title>写真プレビュー</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#111;}img{max-width:100%;max-height:100vh;}</style></head><body><img src="data:' + (data.photo.mime_type || 'image/jpeg') + ';base64,' + data.photo.photo_data + '"></body></html>');
        }
      } catch(e) { showToast('写真の読み込みに失敗しました'); }
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
  </script>
</body>
</html>`
}
