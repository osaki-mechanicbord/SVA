export function adminSamplePage(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <title>SVA CMS - 案件依頼 新規作成 サンプルUI</title>
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
    .fade-in { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .vehicle-card { transition: all 0.2s ease; }
    .vehicle-card:hover { border-color: #C41E3A; }
    .product-row { transition: all 0.15s ease; }
    .product-row:hover { background: #fef2f2; }
  </style>
</head>
<body class="bg-gray-50 text-gray-800 antialiased">

  <!-- Header -->
  <header class="bg-sva-dark text-white sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
      <div class="flex items-center gap-3">
        <h1 class="text-sm font-bold">SVA CMS</h1>
        <span class="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded">SAMPLE UI</span>
      </div>
      <a href="/admin" class="text-xs text-gray-400 hover:text-white transition-colors">← 本番管理画面に戻る</a>
    </div>
  </header>

  <!-- Banner -->
  <div class="bg-amber-50 border-b border-amber-200">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-3">
      <p class="text-sm text-amber-800"><strong>サンプルUI</strong> — 案件依頼「新規作成」の改善デモです。モックデータで動作しています。実際のデータには影響しません。</p>
    </div>
  </div>

  <!-- ============================== -->
  <!-- MAIN: 新規案件作成フォーム -->
  <!-- ============================== -->
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
    <div class="flex items-center gap-3 mb-6">
      <button onclick="alert('一覧に戻る（デモ）')" class="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">← 一覧に戻る</button>
      <h2 class="text-lg font-bold text-sva-dark">新規案件作成</h2>
    </div>

    <!-- ======================================= -->
    <!-- STEP 1: 送信先パートナー選択 -->
    <!-- ======================================= -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6 fade-in">
      <div class="flex items-center gap-2 mb-5">
        <span class="w-7 h-7 rounded-full bg-sva-red text-white text-xs flex items-center justify-center font-bold">1</span>
        <h3 class="text-base font-bold text-sva-dark">送信先パートナー選択</h3>
      </div>

      <!-- 都道府県フィルター + 検索 -->
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <div class="sm:w-56">
          <label class="block text-xs font-medium text-gray-500 mb-1">都道府県で絞り込み</label>
          <select id="prefFilter" onchange="filterPartners()" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red bg-white">
            <option value="">全国（すべて表示）</option>
            <optgroup label="北海道・東北">
              <option>北海道</option><option>青森県</option><option>岩手県</option><option>宮城県</option><option>秋田県</option><option>山形県</option><option>福島県</option>
            </optgroup>
            <optgroup label="関東">
              <option>茨城県</option><option>栃木県</option><option>群馬県</option><option>埼玉県</option><option>千葉県</option><option>東京都</option><option>神奈川県</option>
            </optgroup>
            <optgroup label="中部">
              <option>新潟県</option><option>富山県</option><option>石川県</option><option>福井県</option><option>山梨県</option><option>長野県</option><option>岐阜県</option><option>静岡県</option><option>愛知県</option>
            </optgroup>
            <optgroup label="近畿">
              <option>三重県</option><option>滋賀県</option><option>京都府</option><option>大阪府</option><option>兵庫県</option><option>奈良県</option><option>和歌山県</option>
            </optgroup>
            <optgroup label="中国">
              <option>鳥取県</option><option>島根県</option><option>岡山県</option><option>広島県</option><option>山口県</option>
            </optgroup>
            <optgroup label="四国">
              <option>徳島県</option><option>香川県</option><option>愛媛県</option><option>高知県</option>
            </optgroup>
            <optgroup label="九州・沖縄">
              <option>福岡県</option><option>佐賀県</option><option>長崎県</option><option>熊本県</option><option>大分県</option><option>宮崎県</option><option>鹿児島県</option><option>沖縄県</option>
            </optgroup>
          </select>
        </div>
        <div class="flex-1">
          <label class="block text-xs font-medium text-gray-500 mb-1">会社名・担当者名で検索</label>
          <input id="partnerSearch" type="text" oninput="filterPartners()" placeholder="キーワードで絞り込み..." class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red">
        </div>
      </div>

      <!-- パートナー プルダウン -->
      <div class="mb-3">
        <label class="block text-xs font-medium text-gray-500 mb-1">パートナーを選択 <span class="text-red-500">*</span></label>
        <select id="partnerSelect" onchange="onPartnerSelect()" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red bg-white">
          <option value="">--- パートナーを選択してください ---</option>
        </select>
      </div>

      <!-- 選択されたパートナー情報 -->
      <div id="selectedPartnerCard" class="hidden mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100 fade-in">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-sva-red/10 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-sva-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-sva-dark" id="selPartnerName">-</p>
            <p class="text-xs text-gray-500 mt-0.5" id="selPartnerDetail">-</p>
            <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span id="selPartnerRegion" class="inline-flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>-</span>
              <span id="selPartnerSpec" class="inline-flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>-</span>
            </div>
          </div>
          <button onclick="clearPartner()" class="text-xs text-gray-400 hover:text-red-500 shrink-0">✕ 解除</button>
        </div>
      </div>
    </div>

    <!-- ======================================= -->
    <!-- STEP 2: 案件基本情報 -->
    <!-- ======================================= -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6 fade-in">
      <div class="flex items-center gap-2 mb-5">
        <span class="w-7 h-7 rounded-full bg-sva-red text-white text-xs flex items-center justify-center font-bold">2</span>
        <h3 class="text-base font-bold text-sva-dark">案件基本情報</h3>
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">案件名 <span class="text-red-500">*</span></label>
          <input id="njTitle" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red" placeholder="例: フォークリフトAIカメラ取付 5台">
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">案件No</label>
          <input id="njJobNo" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red" placeholder="例: SVA-2026-0003">
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">作業場所</label>
          <input class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red" placeholder="大阪府堺市">
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">希望日程</label>
          <input class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red" placeholder="2026年4月中旬希望">
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">予算</label>
          <input class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red" placeholder="¥500,000">
        </div>
      </div>
      <div class="mt-4">
        <label class="block text-xs font-medium text-gray-600 mb-1">詳細説明</label>
        <textarea rows="3" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red" placeholder="案件の詳細..."></textarea>
      </div>
    </div>

    <!-- ======================================= -->
    <!-- STEP 3: 車両・取付製品 (複数台対応) -->
    <!-- ======================================= -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6 fade-in">
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-2">
          <span class="w-7 h-7 rounded-full bg-sva-red text-white text-xs flex items-center justify-center font-bold">3</span>
          <h3 class="text-base font-bold text-sva-dark">車両・取付製品</h3>
          <span class="text-xs text-gray-400 ml-1">（複数台登録可能）</span>
        </div>
        <div class="flex items-center gap-2">
          <span id="vehicleCountLabel" class="text-sm text-gray-500 font-medium">0台</span>
          <button onclick="addVehicle()" class="inline-flex items-center gap-1.5 px-4 py-2 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            車両を追加
          </button>
        </div>
      </div>

      <!-- 車両が0台のとき -->
      <div id="noVehicleMsg" class="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0H3m10 0h2m4 0a1 1 0 001-1v-4.586a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0015.586 6H13"/></svg>
        <p class="text-sm text-gray-400 mb-3">車両がまだ登録されていません</p>
        <button onclick="addVehicle()" class="px-4 py-2 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">+ 最初の車両を追加</button>
      </div>

      <!-- 車両カード一覧 -->
      <div id="vehicleList" class="space-y-4"></div>
    </div>

    <!-- ======================================= -->
    <!-- STEP 4: お客様情報・費用 -->
    <!-- ======================================= -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6 fade-in">
      <div class="flex items-center gap-2 mb-5">
        <span class="w-7 h-7 rounded-full bg-sva-red text-white text-xs flex items-center justify-center font-bold">4</span>
        <h3 class="text-base font-bold text-sva-dark">お客様情報・費用</h3>
        <span class="text-[10px] text-orange-500 ml-1">※受諾後にパートナーへ開示</span>
      </div>
      <div class="grid sm:grid-cols-2 gap-4 mb-4">
        <div><label class="block text-xs font-medium text-gray-600 mb-1">お客様 会社名</label><input class="w-full px-3 py-2.5 border border-orange-200 rounded-lg text-sm bg-orange-50/30 focus:outline-none focus:border-sva-red" placeholder="株式会社〇〇物流"></div>
        <div><label class="block text-xs font-medium text-gray-600 mb-1">支店名</label><input class="w-full px-3 py-2.5 border border-orange-200 rounded-lg text-sm bg-orange-50/30 focus:outline-none focus:border-sva-red" placeholder="堺営業所"></div>
        <div><label class="block text-xs font-medium text-gray-600 mb-1">担当者名</label><input class="w-full px-3 py-2.5 border border-orange-200 rounded-lg text-sm bg-orange-50/30 focus:outline-none focus:border-sva-red" placeholder="田中太郎"></div>
        <div><label class="block text-xs font-medium text-gray-600 mb-1">電話番号</label><input class="w-full px-3 py-2.5 border border-orange-200 rounded-lg text-sm bg-orange-50/30 focus:outline-none focus:border-sva-red" placeholder="072-XXX-XXXX"></div>
        <div><label class="block text-xs font-medium text-gray-600 mb-1">メールアドレス</label><input class="w-full px-3 py-2.5 border border-orange-200 rounded-lg text-sm bg-orange-50/30 focus:outline-none focus:border-sva-red" placeholder="tanaka@example.co.jp"></div>
        <div><label class="block text-xs font-medium text-gray-600 mb-1">作業場所（詳細住所）</label><input class="w-full px-3 py-2.5 border border-orange-200 rounded-lg text-sm bg-orange-50/30 focus:outline-none focus:border-sva-red" placeholder="大阪府堺市中区〇〇町1-2-3"></div>
      </div>
      <div class="border-t border-gray-100 pt-4 mt-4">
        <h4 class="text-sm font-bold text-sva-dark mb-3">費用情報 <span class="text-[10px] text-gray-400 font-normal">※税抜金額を入力</span></h4>
        <div class="grid sm:grid-cols-4 gap-3">
          <div><label class="block text-xs font-medium text-gray-600 mb-1">推定希望工賃</label><input type="number" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="250000"></div>
          <div><label class="block text-xs font-medium text-gray-600 mb-1">出張費用</label><input type="number" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="35000"></div>
          <div><label class="block text-xs font-medium text-gray-600 mb-1">その他費用</label><input type="number" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="5000"></div>
          <div><label class="block text-xs font-medium text-gray-600 mb-1">事前打合せ工賃</label><input type="number" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="15000"></div>
        </div>
      </div>
    </div>

    <!-- ======================================= -->
    <!-- 送信ボタン -->
    <!-- ======================================= -->
    <div class="flex items-center gap-4 mb-12">
      <button onclick="submitJob()" class="px-8 py-3 bg-sva-red text-white text-sm font-bold rounded-xl hover:bg-red-800 transition-colors shadow-lg shadow-red-200/50">
        案件を送信
      </button>
      <button onclick="alert('下書き保存（デモ）')" class="px-6 py-3 border border-gray-300 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
        下書き保存
      </button>
      <span id="submitMsg" class="text-sm"></span>
    </div>

    <!-- ======================================= -->
    <!-- プレビュー: 登録データサマリー -->
    <!-- ======================================= -->
    <div id="previewSection" class="hidden mb-12 fade-in">
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
        <h3 class="text-base font-bold text-green-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          送信プレビュー
        </h3>
        <div id="previewContent"></div>
      </div>
    </div>

  </div>

  <script>
    // =====================================================
    // MOCK パートナーデータ
    // =====================================================
    var MOCK_PARTNERS = [
      { id: 1, company_name: '株式会社デモ電装', representative_name: 'デモ太郎', email: 'demo@example.co.jp', region: '大阪府・兵庫県', specialties: 'ドラレコ取付、AIカメラ取付、デジタコ取付', rank: 'gold', status: 'active' },
      { id: 2, company_name: '関東オートサービス', representative_name: '鈴木一郎', email: 'suzuki@kanto-auto.co.jp', region: '東京都・神奈川県・埼玉県', specialties: 'ドラレコ取付、ETC取付', rank: 'standard', status: 'active' },
      { id: 3, company_name: '九州電装テクノ', representative_name: '田中花子', email: 'tanaka@kyushu-denso.co.jp', region: '福岡県・佐賀県・熊本県', specialties: 'AIカメラ取付、置き去り防止装置', rank: 'silver', status: 'active' },
      { id: 4, company_name: '北海道モビリティ', representative_name: '佐藤健二', email: 'sato@hokkaido-m.co.jp', region: '北海道', specialties: 'ドラレコ取付、デジタコ取付、寒冷地対応', rank: 'gold', status: 'active' },
      { id: 5, company_name: '中部カーエレクトロニクス', representative_name: '山田裕子', email: 'yamada@chubu-ce.co.jp', region: '愛知県・静岡県・岐阜県', specialties: 'AIカメラ取付、ドラレコ取付、ETC取付', rank: 'standard', status: 'active' },
      { id: 6, company_name: '四国テックサービス', representative_name: '高橋誠', email: 'takahashi@shikoku-ts.co.jp', region: '香川県・愛媛県・徳島県・高知県', specialties: 'ドラレコ取付、バックカメラ取付', rank: 'standard', status: 'active' },
      { id: 7, company_name: '東北フリートソリューション', representative_name: '伊藤美咲', email: 'ito@tohoku-fs.co.jp', region: '宮城県・福島県・岩手県', specialties: 'デジタコ取付、ドラレコ取付、寒冷地対応', rank: 'silver', status: 'active' },
      { id: 8, company_name: '近畿プロテック', representative_name: '中村大輔', email: 'nakamura@kinki-pt.co.jp', region: '大阪府・京都府・奈良県', specialties: 'AIカメラ取付、置き去り防止装置、ETC取付', rank: 'gold', status: 'active' }
    ];

    // 取付製品マスタ（モック）
    var PRODUCT_MASTER = [
      { id: 1, name: '人検知AIカメラ FLC-1', category: 'AIカメラ' },
      { id: 2, name: '後方モニター 7インチ MON-7B', category: 'モニター' },
      { id: 3, name: 'クラウド型ドラレコ DRC-200', category: 'ドラレコ' },
      { id: 4, name: '車内カメラ INC-100', category: 'カメラ' },
      { id: 5, name: 'デジタルタコグラフ DTG-500', category: 'デジタコ' },
      { id: 6, name: '置き去り防止装置 SOS-0006', category: '安全装置' },
      { id: 7, name: '防水カバー WPC-01', category: 'アクセサリ' },
      { id: 8, name: 'ETC2.0車載器 ETC-200', category: 'ETC' },
      { id: 9, name: 'バックカメラ RVC-300', category: 'カメラ' },
      { id: 10, name: '配線ハーネスキット WHK-50', category: 'アクセサリ' }
    ];

    var RANK_LABELS = { gold: ['ゴールド','bg-amber-100 text-amber-800'], silver: ['シルバー','bg-gray-100 text-gray-700'], standard: ['スタンダード','bg-blue-50 text-blue-700'] };

    // =====================================================
    // STATE
    // =====================================================
    var selectedPartnerId = null;
    var vehicles = []; // { id, makerName, carModel, carModelCode, memo, products: [{productId, name, quantity}] }
    var vehicleIdCounter = 0;

    // =====================================================
    // パートナー選択
    // =====================================================
    function filterPartners() {
      var pref = document.getElementById('prefFilter').value;
      var keyword = document.getElementById('partnerSearch').value.toLowerCase();
      var sel = document.getElementById('partnerSelect');
      var current = sel.value;

      var filtered = MOCK_PARTNERS.filter(function(p) {
        if (pref && p.region.indexOf(pref) === -1) return false;
        if (keyword && (p.company_name + p.representative_name + p.email + p.specialties).toLowerCase().indexOf(keyword) === -1) return false;
        return true;
      });

      sel.innerHTML = '<option value="">--- パートナーを選択してください (' + filtered.length + '件) ---</option>';
      filtered.forEach(function(p) {
        var rl = RANK_LABELS[p.rank] || RANK_LABELS.standard;
        var opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.company_name + ' / ' + p.representative_name + '  [' + rl[0] + ']  (' + p.region + ')';
        if (String(p.id) === current) opt.selected = true;
        sel.appendChild(opt);
      });
    }

    function onPartnerSelect() {
      var id = Number(document.getElementById('partnerSelect').value);
      if (!id) { clearPartner(); return; }
      var p = MOCK_PARTNERS.find(function(x) { return x.id === id; });
      if (!p) return;
      selectedPartnerId = p.id;

      var rl = RANK_LABELS[p.rank] || RANK_LABELS.standard;
      document.getElementById('selPartnerName').textContent = p.company_name + ' / ' + p.representative_name;
      document.getElementById('selPartnerDetail').textContent = p.email + '  |  ' + rl[0] + 'パートナー';
      document.getElementById('selPartnerRegion').textContent = p.region;
      document.getElementById('selPartnerSpec').textContent = p.specialties;
      document.getElementById('selectedPartnerCard').classList.remove('hidden');
    }

    function clearPartner() {
      selectedPartnerId = null;
      document.getElementById('partnerSelect').value = '';
      document.getElementById('selectedPartnerCard').classList.add('hidden');
    }

    // =====================================================
    // 車両管理
    // =====================================================
    function addVehicle() {
      vehicleIdCounter++;
      vehicles.push({
        id: vehicleIdCounter,
        makerName: '',
        carModel: '',
        carModelCode: '',
        memo: '',
        products: []
      });
      renderVehicles();
    }

    function removeVehicle(vid) {
      if (!confirm('#' + getVehicleSeq(vid) + ' の車両を削除しますか？')) return;
      vehicles = vehicles.filter(function(v) { return v.id !== vid; });
      renderVehicles();
    }

    function duplicateVehicle(vid) {
      var src = vehicles.find(function(v) { return v.id === vid; });
      if (!src) return;
      vehicleIdCounter++;
      vehicles.push({
        id: vehicleIdCounter,
        makerName: src.makerName,
        carModel: src.carModel,
        carModelCode: '',
        memo: src.memo,
        products: src.products.map(function(p) { return { productId: p.productId, name: p.name, quantity: p.quantity }; })
      });
      renderVehicles();
    }

    function getVehicleSeq(vid) {
      for (var i = 0; i < vehicles.length; i++) {
        if (vehicles[i].id === vid) return i + 1;
      }
      return 0;
    }

    function updateVehicleField(vid, field, value) {
      var v = vehicles.find(function(x) { return x.id === vid; });
      if (v) v[field] = value;
    }

    // =====================================================
    // 取付製品管理（車両ごと）
    // =====================================================
    function addProduct(vid) {
      var v = vehicles.find(function(x) { return x.id === vid; });
      if (!v) return;
      var selEl = document.getElementById('prodSelect_' + vid);
      var pid = Number(selEl.value);
      if (!pid) return;
      var master = PRODUCT_MASTER.find(function(p) { return p.id === pid; });
      if (!master) return;

      // 重複チェック
      var dup = v.products.find(function(p) { return p.productId === pid; });
      if (dup) { dup.quantity++; }
      else { v.products.push({ productId: pid, name: master.name, quantity: 1 }); }
      selEl.value = '';
      renderVehicles();
    }

    function removeProduct(vid, pidx) {
      var v = vehicles.find(function(x) { return x.id === vid; });
      if (!v) return;
      v.products.splice(pidx, 1);
      renderVehicles();
    }

    function updateProductQty(vid, pidx, val) {
      var v = vehicles.find(function(x) { return x.id === vid; });
      if (!v || !v.products[pidx]) return;
      v.products[pidx].quantity = Math.max(1, Number(val) || 1);
    }

    // =====================================================
    // 車両一覧レンダリング
    // =====================================================
    function renderVehicles() {
      var noMsg = document.getElementById('noVehicleMsg');
      var list = document.getElementById('vehicleList');
      var label = document.getElementById('vehicleCountLabel');

      label.textContent = vehicles.length + '台';

      if (vehicles.length === 0) {
        noMsg.classList.remove('hidden');
        list.innerHTML = '';
        return;
      }
      noMsg.classList.add('hidden');

      list.innerHTML = vehicles.map(function(v, idx) {
        var seq = idx + 1;

        // 製品行
        var prodHtml = '';
        if (v.products.length > 0) {
          prodHtml = '<div class="mt-3 border-t border-gray-100 pt-3">'
            + '<div class="space-y-1.5">'
            + v.products.map(function(p, pi) {
              return '<div class="product-row flex items-center gap-3 py-1.5 px-3 bg-gray-50 rounded-lg">'
                + '<span class="text-xs text-gray-400 w-5">' + (pi+1) + '.</span>'
                + '<span class="text-sm text-gray-800 flex-1">' + esc(p.name) + '</span>'
                + '<div class="flex items-center gap-1">'
                + '<label class="text-[10px] text-gray-400">数量</label>'
                + '<input type="number" min="1" value="' + p.quantity + '" onchange="updateProductQty(' + v.id + ',' + pi + ',this.value)" class="w-14 px-2 py-1 border border-gray-200 rounded text-xs text-center focus:outline-none focus:border-sva-red">'
                + '</div>'
                + '<button onclick="removeProduct(' + v.id + ',' + pi + ')" class="text-gray-400 hover:text-red-500 transition-colors" title="削除">'
                + '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'
                + '</button>'
                + '</div>';
            }).join('')
            + '</div></div>';
        }

        // 製品セレクタ選択肢（製品マスタ）
        var prodOptions = PRODUCT_MASTER.map(function(pm) {
          return '<option value="' + pm.id + '">[' + pm.category + '] ' + pm.name + '</option>';
        }).join('');

        return '<div class="vehicle-card border border-gray-200 rounded-xl overflow-hidden bg-white fade-in">'
          // ヘッダー
          + '<div class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">'
          + '<div class="flex items-center gap-3">'
          + '<span class="w-8 h-8 rounded-full bg-sva-red text-white text-sm flex items-center justify-center font-bold">' + seq + '</span>'
          + '<span class="text-sm font-bold text-sva-dark">車両 #' + seq + '</span>'
          + (v.products.length > 0 ? '<span class="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-medium rounded-full">製品 ' + v.products.length + '点</span>' : '')
          + '</div>'
          + '<div class="flex items-center gap-1">'
          + '<button onclick="duplicateVehicle(' + v.id + ')" class="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="複製">'
          + '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>'
          + '</button>'
          + '<button onclick="removeVehicle(' + v.id + ')" class="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors" title="削除">'
          + '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>'
          + '</button>'
          + '</div>'
          + '</div>'
          // ボディ
          + '<div class="px-5 py-4">'
          + '<div class="grid sm:grid-cols-3 gap-3">'
          + '<div><label class="block text-xs font-medium text-gray-500 mb-1">メーカー名</label>'
          + '<input value="' + esc(v.makerName) + '" onchange="updateVehicleField(' + v.id + ',\\'makerName\\',this.value)" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="トヨタ"></div>'
          + '<div><label class="block text-xs font-medium text-gray-500 mb-1">車種</label>'
          + '<input value="' + esc(v.carModel) + '" onchange="updateVehicleField(' + v.id + ',\\'carModel\\',this.value)" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="8FBN25"></div>'
          + '<div><label class="block text-xs font-medium text-gray-500 mb-1">車両型式コード</label>'
          + '<input value="' + esc(v.carModelCode) + '" onchange="updateVehicleField(' + v.id + ',\\'carModelCode\\',this.value)" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-sva-red" placeholder="8FBN25-60001"></div>'
          + '</div>'
          + '<div class="mt-3"><label class="block text-xs font-medium text-gray-500 mb-1">車両メモ</label>'
          + '<input value="' + esc(v.memo) + '" onchange="updateVehicleField(' + v.id + ',\\'memo\\',this.value)" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sva-red" placeholder="例: バッテリー式25t。雨天時防水注意。"></div>'

          // 取付製品セクション
          + '<div class="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">'
          + '<div class="flex items-center justify-between mb-3">'
          + '<h5 class="text-xs font-bold text-gray-700 flex items-center gap-1.5">'
          + '<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>'
          + 'この車両の取付製品</h5>'
          + '<span class="text-[10px] text-gray-400">' + v.products.length + '点</span>'
          + '</div>'
          + '<div class="flex gap-2">'
          + '<select id="prodSelect_' + v.id + '" class="flex-1 px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white focus:outline-none focus:border-sva-red">'
          + '<option value="">製品を選択...</option>' + prodOptions
          + '</select>'
          + '<button onclick="addProduct(' + v.id + ')" class="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors shrink-0">追加</button>'
          + '</div>'
          + prodHtml
          + (v.products.length === 0 ? '<p class="text-xs text-gray-400 text-center mt-3 py-2">上のプルダウンから製品を選択して追加してください</p>' : '')
          + '</div>'

          + '</div></div>';
      }).join('');
    }

    // =====================================================
    // 送信
    // =====================================================
    function submitJob() {
      var title = document.getElementById('njTitle').value;
      if (!selectedPartnerId) {
        document.getElementById('submitMsg').textContent = 'パートナーを選択してください';
        document.getElementById('submitMsg').className = 'text-sm text-red-600';
        return;
      }
      if (!title) {
        document.getElementById('submitMsg').textContent = '案件名を入力してください';
        document.getElementById('submitMsg').className = 'text-sm text-red-600';
        return;
      }
      if (vehicles.length === 0) {
        document.getElementById('submitMsg').textContent = '車両を1台以上登録してください';
        document.getElementById('submitMsg').className = 'text-sm text-red-600';
        return;
      }

      // プレビュー表示
      var partner = MOCK_PARTNERS.find(function(p) { return p.id === selectedPartnerId; });
      var preview = document.getElementById('previewSection');
      var content = document.getElementById('previewContent');

      var totalProducts = 0;
      vehicles.forEach(function(v) { totalProducts += v.products.length; });

      content.innerHTML = '<div class="grid sm:grid-cols-3 gap-4 mb-4">'
        + '<div class="bg-white rounded-lg p-3 border border-green-100"><p class="text-[10px] text-gray-400 mb-1">送信先</p><p class="text-sm font-bold text-gray-800">' + esc(partner.company_name) + '</p></div>'
        + '<div class="bg-white rounded-lg p-3 border border-green-100"><p class="text-[10px] text-gray-400 mb-1">車両台数</p><p class="text-sm font-bold text-gray-800">' + vehicles.length + '台</p></div>'
        + '<div class="bg-white rounded-lg p-3 border border-green-100"><p class="text-[10px] text-gray-400 mb-1">取付製品合計</p><p class="text-sm font-bold text-gray-800">' + totalProducts + '点</p></div>'
        + '</div>'
        + '<div class="space-y-2">'
        + vehicles.map(function(v, i) {
          return '<div class="bg-white rounded-lg p-3 border border-green-100 flex items-center gap-3">'
            + '<span class="w-6 h-6 rounded-full bg-sva-red text-white text-[10px] flex items-center justify-center font-bold shrink-0">' + (i+1) + '</span>'
            + '<div class="flex-1 min-w-0">'
            + '<p class="text-sm font-medium text-gray-800">' + esc(v.makerName || '未入力') + ' ' + esc(v.carModel || '') + ' <span class="text-xs text-gray-400">' + esc(v.carModelCode) + '</span></p>'
            + '<p class="text-xs text-gray-500">製品: ' + (v.products.length > 0 ? v.products.map(function(p) { return p.name + '×' + p.quantity; }).join(', ') : 'なし') + '</p>'
            + '</div></div>';
        }).join('')
        + '</div>';

      preview.classList.remove('hidden');
      preview.scrollIntoView({ behavior: 'smooth', block: 'start' });

      document.getElementById('submitMsg').textContent = '✅ プレビューを表示しました（デモ）';
      document.getElementById('submitMsg').className = 'text-sm text-green-600';
    }

    // =====================================================
    // ユーティリティ
    // =====================================================
    function esc(str) {
      if (!str) return '';
      var d = document.createElement('div');
      d.textContent = str;
      return d.innerHTML;
    }

    // =====================================================
    // 初期化
    // =====================================================
    filterPartners();
  </script>

</body>
</html>`;
}
