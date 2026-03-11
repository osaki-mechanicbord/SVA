import { siteHead } from './layout'

export function partnerInvitePage(token: string): string {
  return `${siteHead(
    '公認パートナー登録 | SVA - Special Vehicle Assist',
    '招待リンクからの公認パートナー初回登録ページ',
    '/partner/invite/' + token,
    '<meta name="robots" content="noindex, nofollow">'
  )}
<body class="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 min-h-screen antialiased">
  <style>
    .input-focus:focus { box-shadow: 0 0 0 3px rgba(196, 30, 58, 0.1); }
    .btn-loading { position: relative; color: transparent !important; }
    .btn-loading::after {
      content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 20px; height: 20px; border: 2px solid transparent; border-top-color: #fff;
      border-radius: 50%; animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeInUp 0.5s ease-out forwards; }
  </style>

  <div class="min-h-screen flex flex-col">
    <header class="py-4 px-6">
      <a href="/" class="inline-flex items-center gap-2 text-gray-500 hover:text-sva-red transition-colors text-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        トップページに戻る
      </a>
    </header>

    <main class="flex-1 flex items-center justify-center px-4 py-8">
      <!-- Loading state -->
      <div id="loadingState" class="text-center">
        <div class="w-8 h-8 border-2 border-sva-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-sm text-gray-500">招待リンクを確認中...</p>
      </div>

      <!-- Error state -->
      <div id="errorState" class="hidden max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
          </div>
          <h2 class="text-lg font-bold text-gray-800 mb-2">招待リンクエラー</h2>
          <p id="errorMessage" class="text-sm text-gray-600 mb-6"></p>
          <a href="/partner/login" class="inline-block px-6 py-2.5 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">ログインページへ</a>
        </div>
      </div>

      <!-- Registration form -->
      <div id="registerState" class="hidden max-w-lg w-full animate-fade-in">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-sva-red to-red-700 px-8 py-6 text-white">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
              </div>
              <div>
                <h1 class="text-xl font-bold">公認パートナー登録</h1>
                <p class="text-white/80 text-sm">SVA招待リンクからの初回登録</p>
              </div>
            </div>
            <p id="inviteMemo" class="text-sm text-white/70 hidden"></p>
          </div>

          <!-- Form -->
          <div class="p-8 space-y-5">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">メールアドレス <span class="text-red-500">*</span></label>
              <input id="reg_email" type="email" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm input-focus focus:outline-none focus:border-sva-red transition-colors" placeholder="your@company.co.jp">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">パスワード <span class="text-red-500">*</span><span class="text-gray-400 font-normal normal-case ml-1">（8文字以上）</span></label>
              <input id="reg_password" type="password" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm input-focus focus:outline-none focus:border-sva-red transition-colors" placeholder="8文字以上">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">パスワード（確認）<span class="text-red-500">*</span></label>
              <input id="reg_password2" type="password" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm input-focus focus:outline-none focus:border-sva-red transition-colors" placeholder="もう一度入力">
            </div>

            <div class="border-t border-gray-100 pt-5">
              <p class="text-xs text-gray-400 mb-3">以下は任意です（後からマイページで変更できます）</p>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">会社名</label>
                  <input id="reg_company" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm input-focus focus:outline-none focus:border-sva-red" placeholder="株式会社〇〇">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">担当者名</label>
                  <input id="reg_name" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm input-focus focus:outline-none focus:border-sva-red" placeholder="山田太郎">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">電話番号</label>
                  <input id="reg_phone" type="tel" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm input-focus focus:outline-none focus:border-sva-red" placeholder="03-1234-5678">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">対応地域</label>
                  <input id="reg_region" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm input-focus focus:outline-none focus:border-sva-red" placeholder="関東エリア">
                </div>
              </div>
              <div class="mt-3">
                <label class="block text-xs font-medium text-gray-600 mb-1">得意分野</label>
                <input id="reg_specialties" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm input-focus focus:outline-none focus:border-sva-red" placeholder="フォークリフト、トラック、ドライブレコーダー取付">
              </div>
            </div>

            <div class="border-t border-gray-100 pt-5">
              <p class="text-xs text-gray-400 mb-3">住所・インボイス情報（任意・後からマイページで変更できます）</p>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">郵便番号</label>
                  <input id="reg_postal" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm input-focus focus:outline-none focus:border-sva-red" placeholder="000-0000">
                </div>
                <div class="col-span-2">
                  <label class="block text-xs font-medium text-gray-600 mb-1">住所</label>
                  <input id="reg_address" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm input-focus focus:outline-none focus:border-sva-red" placeholder="都道府県 市区町村 番地">
                </div>
              </div>
              <div class="mt-3">
                <label class="block text-xs font-medium text-gray-600 mb-1">インボイス番号（適格請求書発行事業者登録番号）</label>
                <input id="reg_invoice" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm input-focus focus:outline-none focus:border-sva-red" placeholder="T1234567890123">
                <p class="text-xs text-gray-400 mt-1">「T」+ 13桁の数字で入力</p>
              </div>
            </div>

            <div id="regError" class="hidden text-sm text-red-600 bg-red-50 rounded-lg p-3"></div>

            <button id="regBtn" onclick="doRegister()" class="w-full py-3 bg-sva-red text-white font-bold rounded-xl hover:bg-red-800 transition-colors text-sm">
              登録してマイページへ進む
            </button>
            <p class="text-center text-xs text-gray-400">既にアカウントをお持ちの方は<a href="/partner/login" class="text-sva-red hover:underline font-medium">こちらからログイン</a></p>
          </div>
        </div>
      </div>

      <!-- Success state -->
      <div id="successState" class="hidden max-w-md w-full animate-fade-in">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2 class="text-lg font-bold text-gray-800 mb-2">登録完了</h2>
          <p class="text-sm text-gray-600 mb-6">公認パートナーとして登録されました。<br>マイページへ移動します...</p>
          <div class="w-6 h-6 border-2 border-sva-red border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </main>

    <footer class="py-4 text-center text-xs text-gray-400">
      &copy; 2024 SVA - Special Vehicle Assist. All rights reserved.
    </footer>
  </div>

  <script>
    var inviteToken = '${token}';

    // ページ読み込み時に招待トークンを検証
    (async function() {
      try {
        var res = await fetch('/api/partner/invite/' + inviteToken);
        var data = await res.json();
        if (!res.ok) {
          document.getElementById('loadingState').classList.add('hidden');
          document.getElementById('errorState').classList.remove('hidden');
          document.getElementById('errorMessage').textContent = data.error || '招待リンクが無効です';
          return;
        }
        // 有効 → 登録フォーム表示
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('registerState').classList.remove('hidden');
        if (data.memo) {
          var memoEl = document.getElementById('inviteMemo');
          memoEl.textContent = data.memo;
          memoEl.classList.remove('hidden');
        }
      } catch(e) {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('errorState').classList.remove('hidden');
        document.getElementById('errorMessage').textContent = '通信エラーが発生しました';
      }
    })();

    async function doRegister() {
      var errEl = document.getElementById('regError');
      var btn = document.getElementById('regBtn');
      errEl.classList.add('hidden');

      var email = document.getElementById('reg_email').value.trim();
      var pw = document.getElementById('reg_password').value;
      var pw2 = document.getElementById('reg_password2').value;

      if (!email || !pw) { errEl.textContent = 'メールアドレスとパスワードは必須です'; errEl.classList.remove('hidden'); return; }
      if (pw.length < 8) { errEl.textContent = 'パスワードは8文字以上にしてください'; errEl.classList.remove('hidden'); return; }
      if (pw !== pw2) { errEl.textContent = 'パスワードが一致しません'; errEl.classList.remove('hidden'); return; }

      btn.classList.add('btn-loading');
      btn.disabled = true;

      try {
        var res = await fetch('/api/partner/invite/' + inviteToken + '/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            password: pw,
            company_name: document.getElementById('reg_company').value.trim(),
            representative_name: document.getElementById('reg_name').value.trim(),
            phone: document.getElementById('reg_phone').value.trim(),
            region: document.getElementById('reg_region').value.trim(),
            specialties: document.getElementById('reg_specialties').value.trim(),
            postal_code: document.getElementById('reg_postal').value.trim(),
            address: document.getElementById('reg_address').value.trim(),
            invoice_number: document.getElementById('reg_invoice').value.trim()
          })
        });
        var data = await res.json();
        if (!res.ok) {
          errEl.textContent = data.error || '登録に失敗しました';
          errEl.classList.remove('hidden');
          btn.classList.remove('btn-loading');
          btn.disabled = false;
          return;
        }

        // 成功 → トークン保存してマイページへ
        localStorage.setItem('partnerToken', data.token);
        document.getElementById('registerState').classList.add('hidden');
        document.getElementById('successState').classList.remove('hidden');
        setTimeout(function() { location.href = '/partner/mypage'; }, 1500);
      } catch(e) {
        errEl.textContent = '通信エラーが発生しました';
        errEl.classList.remove('hidden');
        btn.classList.remove('btn-loading');
        btn.disabled = false;
      }
    }

    // Enterキーで送信
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !document.getElementById('registerState').classList.contains('hidden')) {
        doRegister();
      }
    });
  </script>
</body>
</html>`;
}
