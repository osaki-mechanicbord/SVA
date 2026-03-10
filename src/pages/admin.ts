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
          <span class="text-xs text-gray-400">コラム管理</span>
        </div>
        <div class="flex items-center gap-4">
          <a href="/column" target="_blank" class="text-xs text-gray-400 hover:text-white transition-colors">サイトを表示</a>
          <button id="logoutBtn" class="text-xs text-gray-400 hover:text-white transition-colors">ログアウト</button>
        </div>
      </div>
    </header>

    <!-- Toolbar -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div id="viewTitle" class="text-lg font-bold text-sva-dark">記事一覧</div>
        <div class="flex items-center gap-2">
          <button id="backToListBtn" class="hidden px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">一覧に戻る</button>
          <button id="newArticleBtn" class="px-4 py-1.5 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">新規作成</button>
        </div>
      </div>
    </div>

    <!-- Content Area -->
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
            <!-- Main content area -->
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
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">サムネイルURL</label>
                <input type="url" id="artThumbnail" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red bg-white" placeholder="https://...">
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

  <script>
    const API_BASE = '/api';
    let authToken = sessionStorage.getItem('sva_token') || '';
    let currentPage = 1;

    // Category labels
    const CATEGORY_LABELS = {
      'safety': '安全対策', 'technology': 'テクノロジー', 'regulation': '法規制',
      'installation': '取付ガイド', 'case-study': '導入事例', 'general': 'その他'
    };

    // ===== Auth =====
    if (authToken) {
      showDashboard();
      loadArticles(1);
    }

    document.getElementById('loginForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const errEl = document.getElementById('loginError');
      errEl.classList.add('hidden');
      try {
        const res = await fetch(API_BASE + '/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: document.getElementById('loginUsername').value,
            password: document.getElementById('loginPassword').value
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        authToken = data.token;
        sessionStorage.setItem('sva_token', authToken);
        showDashboard();
        loadArticles(1);
      } catch (err) {
        errEl.textContent = 'ユーザー名またはパスワードが正しくありません';
        errEl.classList.remove('hidden');
      }
    });

    document.getElementById('logoutBtn').addEventListener('click', function() {
      authToken = '';
      sessionStorage.removeItem('sva_token');
      document.getElementById('adminDashboard').classList.add('hidden');
      document.getElementById('loginScreen').classList.remove('hidden');
    });

    function showDashboard() {
      document.getElementById('loginScreen').classList.add('hidden');
      document.getElementById('adminDashboard').classList.remove('hidden');
    }

    // ===== List =====
    async function loadArticles(page) {
      currentPage = page;
      showListView();
      try {
        const res = await fetch(API_BASE + '/admin/articles?page=' + page, {
          headers: { 'Authorization': 'Bearer ' + authToken }
        });
        if (res.status === 401) { authToken = ''; sessionStorage.removeItem('sva_token'); location.reload(); return; }
        const data = await res.json();
        renderArticleList(data.articles, data.pagination);
      } catch (err) {
        document.getElementById('articleList').innerHTML = '<p class="text-sm text-red-500">読み込みに失敗しました</p>';
      }
    }

    function renderArticleList(articles, pagination) {
      const list = document.getElementById('articleList');
      if (!articles || articles.length === 0) {
        list.innerHTML = '<div class="text-center py-16 text-gray-400"><p class="text-sm">記事がまだありません</p></div>';
        return;
      }
      list.innerHTML = articles.map(function(a) {
        const statusBadge = a.status === 'published'
          ? '<span class="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded">公開</span>'
          : '<span class="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded">下書き</span>';
        const catLabel = CATEGORY_LABELS[a.category] || a.category;
        const date = a.updated_at ? new Date(a.updated_at).toLocaleDateString('ja-JP') : '-';
        return '<div class="bg-white rounded-lg border border-gray-200 px-5 py-4 flex items-center justify-between hover:border-gray-300 transition-colors cursor-pointer" onclick="editArticle(' + a.id + ')">'
          + '<div class="min-w-0 flex-1">'
          + '<div class="flex items-center gap-2 mb-1">' + statusBadge + '<span class="text-xs text-gray-400">' + catLabel + '</span></div>'
          + '<p class="text-sm font-medium text-gray-800 truncate">' + escapeHtml(a.title) + '</p>'
          + '<p class="text-xs text-gray-400 mt-0.5">/' + escapeHtml(a.slug) + ' ・ ' + date + '</p>'
          + '</div>'
          + '<svg class="w-4 h-4 text-gray-300 shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>'
          + '</div>';
      }).join('');

      // Pagination
      const pagEl = document.getElementById('listPagination');
      if (pagination.totalPages > 1) {
        let html = '';
        for (let i = 1; i <= pagination.totalPages; i++) {
          const active = i === pagination.page ? 'bg-sva-red text-white' : 'bg-white text-gray-600 hover:bg-gray-50';
          html += '<button onclick="loadArticles(' + i + ')" class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 ' + active + '">' + i + '</button>';
        }
        pagEl.innerHTML = html;
      } else {
        pagEl.innerHTML = '';
      }
    }

    // ===== Editor =====
    document.getElementById('newArticleBtn').addEventListener('click', function() {
      showEditorView('新規作成');
      clearForm();
    });

    document.getElementById('backToListBtn').addEventListener('click', function() {
      loadArticles(currentPage);
    });

    async function editArticle(id) {
      showEditorView('記事編集');
      try {
        const res = await fetch(API_BASE + '/admin/articles/' + id, {
          headers: { 'Authorization': 'Bearer ' + authToken }
        });
        const data = await res.json();
        if (!data.article) return;
        const a = data.article;
        document.getElementById('articleId').value = a.id;
        document.getElementById('artTitle').value = a.title || '';
        document.getElementById('artSlug').value = a.slug || '';
        document.getElementById('artExcerpt').value = a.excerpt || '';
        document.getElementById('artContent').value = a.content || '';
        document.getElementById('artStatus').value = a.status || 'draft';
        document.getElementById('artCategory').value = a.category || 'general';
        document.getElementById('artAuthor').value = a.author || 'SVA\u7de8\u96c6\u90e8';
        document.getElementById('artThumbnail').value = a.thumbnail_url || '';
        document.getElementById('deleteArticleBtn').classList.remove('hidden');
      } catch (err) {
        showEditorMsg('読み込みに失敗しました', true);
      }
    }

    document.getElementById('articleForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const id = document.getElementById('articleId').value;
      const body = {
        title: document.getElementById('artTitle').value,
        slug: document.getElementById('artSlug').value,
        excerpt: document.getElementById('artExcerpt').value,
        content: document.getElementById('artContent').value,
        status: document.getElementById('artStatus').value,
        category: document.getElementById('artCategory').value,
        author: document.getElementById('artAuthor').value,
        thumbnail_url: document.getElementById('artThumbnail').value
      };
      try {
        const url = id ? API_BASE + '/admin/articles/' + id : API_BASE + '/admin/articles';
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (!id && data.id) document.getElementById('articleId').value = data.id;
        if (!id) document.getElementById('deleteArticleBtn').classList.remove('hidden');
        showEditorMsg('保存しました', false);
      } catch (err) {
        showEditorMsg(err.message || '保存に失敗しました', true);
      }
    });

    document.getElementById('deleteArticleBtn').addEventListener('click', async function() {
      const id = document.getElementById('articleId').value;
      if (!id || !confirm('この記事を削除しますか？')) return;
      try {
        await fetch(API_BASE + '/admin/articles/' + id, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + authToken }
        });
        loadArticles(currentPage);
      } catch (err) {
        showEditorMsg('削除に失敗しました', true);
      }
    });

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
      document.getElementById('artAuthor').value = 'SVA\u7de8\u96c6\u90e8';
      document.getElementById('artThumbnail').value = '';
      document.getElementById('deleteArticleBtn').classList.add('hidden');
      document.getElementById('editorMsg').classList.add('hidden');
    }

    function showEditorMsg(msg, isError) {
      const el = document.getElementById('editorMsg');
      el.textContent = msg;
      el.className = 'text-sm p-2 rounded ' + (isError ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700');
      el.classList.remove('hidden');
      setTimeout(function() { el.classList.add('hidden'); }, 3000);
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    // Auto-generate slug from title
    document.getElementById('artTitle').addEventListener('input', function() {
      if (document.getElementById('articleId').value) return; // Don't auto-generate for existing articles
      const title = this.value;
      const slug = title.toLowerCase()
        .replace(/[\\s\\u3000]+/g, '-')
        .replace(/[^a-z0-9\\u3040-\\u309f\\u30a0-\\u30ff\\u4e00-\\u9faf-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 80);
      document.getElementById('artSlug').value = slug;
    });
  </script>
</body>
</html>`
}
