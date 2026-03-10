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
    function switchTab(tab) {
      const isArticles = tab === 'articles';
      document.getElementById('articlesTab').classList.toggle('hidden', !isArticles);
      document.getElementById('imagesTab').classList.toggle('hidden', isArticles);
      document.getElementById('tabArticles').classList.toggle('border-sva-red', isArticles);
      document.getElementById('tabArticles').classList.toggle('text-sva-red', isArticles);
      document.getElementById('tabArticles').classList.toggle('border-transparent', !isArticles);
      document.getElementById('tabArticles').classList.toggle('text-gray-500', !isArticles);
      document.getElementById('tabImages').classList.toggle('border-sva-red', !isArticles);
      document.getElementById('tabImages').classList.toggle('text-sva-red', !isArticles);
      document.getElementById('tabImages').classList.toggle('border-transparent', isArticles);
      document.getElementById('tabImages').classList.toggle('text-gray-500', isArticles);
      if (!isArticles) loadImages(1);
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
  </script>
</body>
</html>`
}
