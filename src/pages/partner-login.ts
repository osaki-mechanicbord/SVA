import { siteHead } from './layout'

export function partnerLoginPage(): string {
  return `${siteHead(
    'パートナーログイン | SVA - Special Vehicle Assist',
    '公認パートナー専用ログインページ',
    '/partner/login',
    '<meta name="robots" content="noindex, nofollow">'
  )}
<body class="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 min-h-screen antialiased">
  <style>
    .login-card { backdrop-filter: blur(20px); }
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
    <!-- Header bar -->
    <header class="py-4 px-6">
      <a href="/" class="inline-flex items-center gap-2 text-gray-500 hover:text-sva-red transition-colors text-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        トップページに戻る
      </a>
    </header>

    <!-- Login form -->
    <main class="flex-1 flex items-center justify-center px-4 pb-12">
      <div class="w-full max-w-md animate-fade-in">
        <!-- Logo -->
        <div class="text-center mb-8">
          <a href="/">
            <img src="/static/images/sva-logo.png" alt="SVA" class="h-14 mx-auto mb-4 object-contain">
          </a>
          <h1 class="text-xl font-bold text-sva-dark">パートナーログイン</h1>
          <p class="text-sm text-gray-500 mt-1.5">公認パートナー専用のマイページへアクセス</p>
        </div>

        <!-- Card -->
        <div class="bg-white/80 login-card rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-8">
          <!-- Error message -->
          <div id="errorMsg" class="hidden mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
            <div class="flex items-start gap-2.5">
              <svg class="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <p id="errorText" class="text-sm text-red-700"></p>
            </div>
          </div>

          <form id="loginForm" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">メールアドレス</label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </span>
                <input id="email" type="email" required autocomplete="email"
                  class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm input-focus focus:outline-none focus:border-sva-red transition-all bg-white"
                  placeholder="partner@example.co.jp">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">パスワード</label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </span>
                <input id="password" type="password" required autocomplete="current-password"
                  class="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-sm input-focus focus:outline-none focus:border-sva-red transition-all bg-white"
                  placeholder="パスワードを入力">
                <button type="button" id="togglePassword" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg id="eyeIcon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  <svg id="eyeOffIcon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                </button>
              </div>
            </div>

            <button id="loginBtn" type="submit"
              class="w-full py-3.5 bg-sva-red text-white font-medium rounded-xl hover:bg-red-800 active:scale-[0.98] transition-all text-sm">
              ログイン
            </button>
          </form>
        </div>

        <!-- Footer note -->
        <div class="mt-6 text-center space-y-2">
          <p class="text-xs text-gray-400">
            パートナー登録をご希望の方は
            <a href="/#contact" class="text-sva-red hover:underline">お問い合わせ</a>
            からお申し込みください
          </p>
          <p class="text-xs text-gray-400">
            &copy; 2025 株式会社TCIサービス
          </p>
        </div>
      </div>
    </main>
  </div>

  <script>
    (function() {
      var form = document.getElementById('loginForm');
      var emailInput = document.getElementById('email');
      var passInput = document.getElementById('password');
      var loginBtn = document.getElementById('loginBtn');
      var errorMsg = document.getElementById('errorMsg');
      var errorText = document.getElementById('errorText');
      var toggleBtn = document.getElementById('togglePassword');
      var eyeIcon = document.getElementById('eyeIcon');
      var eyeOffIcon = document.getElementById('eyeOffIcon');

      // Toggle password visibility
      toggleBtn.addEventListener('click', function() {
        var isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        eyeIcon.classList.toggle('hidden', isPass);
        eyeOffIcon.classList.toggle('hidden', !isPass);
      });

      function showError(msg) {
        errorText.textContent = msg;
        errorMsg.classList.remove('hidden');
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      function hideError() {
        errorMsg.classList.add('hidden');
      }

      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        hideError();

        var email = emailInput.value.trim();
        var password = passInput.value;

        if (!email || !password) {
          showError('メールアドレスとパスワードを入力してください');
          return;
        }

        loginBtn.classList.add('btn-loading');
        loginBtn.disabled = true;

        try {
          var res = await fetch('/api/partner/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
          });

          var data = await res.json();

          if (!res.ok) {
            showError(data.error || 'ログインに失敗しました');
            loginBtn.classList.remove('btn-loading');
            loginBtn.disabled = false;
            return;
          }

          // Save to localStorage
          localStorage.setItem('sva_partner_token', data.token);
          localStorage.setItem('sva_partner', JSON.stringify(data.partner));

          // Redirect to mypage
          window.location.href = '/partner/mypage';
        } catch (err) {
          showError('通信エラーが発生しました。しばらくしてからお試しください。');
          loginBtn.classList.remove('btn-loading');
          loginBtn.disabled = false;
        }
      });

      // If already logged in, redirect
      var token = localStorage.getItem('sva_partner_token');
      if (token) {
        fetch('/api/partner/me', { headers: { 'Authorization': 'Bearer ' + token } })
          .then(function(r) { if (r.ok) window.location.href = '/partner/mypage'; })
          .catch(function() {});
      }
    })();
  </script>
</body>
</html>`
}
