export function adminSamplePage(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <title>SVA CMS - 車両明細管理 サンプルUI</title>
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
    .tab-active { border-bottom: 2px solid #C41E3A; color: #C41E3A; }
    .vehicle-card:hover { border-color: #C41E3A; }
    .progress-step.done { background: #22c55e; color: white; }
    .progress-step.active { background: #C41E3A; color: white; }
    .progress-step { background: #e5e7eb; color: #9ca3af; }
    .photo-slot { transition: all 0.15s ease; }
    .photo-slot:hover { border-color: #C41E3A; background: rgba(196,30,58,0.03); }
    .badge-pulse { animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
  </style>
</head>
<body class="bg-gray-50 text-gray-800 antialiased">

  <!-- Header -->
  <header class="bg-sva-dark text-white sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
      <div class="flex items-center gap-3">
        <h1 class="text-sm font-bold">SVA CMS</h1>
        <span class="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded">SAMPLE</span>
      </div>
      <div class="flex items-center gap-4">
        <a href="/admin" class="text-xs text-gray-400 hover:text-white transition-colors">← 本番管理画面に戻る</a>
      </div>
    </div>
  </header>

  <!-- Banner -->
  <div class="bg-amber-50 border-b border-amber-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3">
      <p class="text-sm text-amber-800"><strong>サンプルUI</strong> — 複数車両・複数商品構成の管理画面デモです。データはモック（仮データ）で動作しています。既存機能には影響しません。</p>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">

    <!-- ============================================== -->
    <!-- SECTION 1: 案件一覧（既存UIと同じ + 車両台数バッジ） -->
    <!-- ============================================== -->
    <div id="sampleJobList">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-bold text-sva-dark">案件一覧 <span class="text-sm font-normal text-gray-400">（車両明細拡張版）</span></h2>
        <button onclick="showNewJob()" class="px-4 py-1.5 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">新規案件作成</button>
      </div>

      <div class="space-y-2" id="jobListContainer"></div>
    </div>

    <!-- ============================================== -->
    <!-- SECTION 2: 案件詳細 + 車両明細タブ -->
    <!-- ============================================== -->
    <div id="sampleJobDetail" class="hidden">
      <div class="flex items-center gap-3 mb-6">
        <button onclick="backToList()" class="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">← 一覧に戻る</button>
        <h2 class="text-lg font-bold text-sva-dark" id="detailTitle">案件詳細</h2>
      </div>

      <!-- Detail Tabs -->
      <div class="bg-white border border-gray-200 rounded-t-xl border-b-0">
        <div class="flex items-center gap-0 px-2">
          <button onclick="switchDetailTab('overview')" id="dtab_overview" class="px-5 py-3 text-sm font-medium border-b-2 tab-active">概要</button>
          <button onclick="switchDetailTab('vehicles')" id="dtab_vehicles" class="px-5 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
            車両明細 <span id="vehicleCountBadge" class="ml-1 px-1.5 py-0.5 bg-sva-red text-white text-[10px] rounded-full font-bold">5</span>
          </button>
          <button onclick="switchDetailTab('tracking')" id="dtab_tracking" class="px-5 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">進捗トラッキング</button>
          <button onclick="switchDetailTab('photos')" id="dtab_photos" class="px-5 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
            作業写真 <span id="photoCountBadge" class="ml-1 px-1.5 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded-full font-bold">8</span>
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="bg-white border border-gray-200 rounded-b-xl p-6" id="detailTabContent">
        <!-- Dynamically rendered -->
      </div>
    </div>

    <!-- ============================================== -->
    <!-- SECTION 3: パートナーMyPage サンプル -->
    <!-- ============================================== -->
    <div id="samplePartnerView" class="hidden mt-12">
      <div class="bg-gradient-to-r from-sva-dark to-gray-800 text-white rounded-xl p-6 mb-6">
        <div class="flex items-center gap-3 mb-2">
          <span class="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded">パートナー側VIEW</span>
          <h2 class="text-lg font-bold">パートナーMyPage サンプル</h2>
        </div>
        <p class="text-sm text-gray-300">パートナーが自分のMyPageから見る車両明細の見え方です</p>
      </div>
      <div id="partnerViewContent"></div>
    </div>

  </div>

  <script>
    // =====================================================
    // MOCK DATA
    // =====================================================
    var MOCK_JOBS = [
      {
        id: 1,
        title: 'フォークリフトAIカメラ取付 5台',
        company_name: '株式会社デモ電装',
        representative_name: 'デモ太郎',
        location: '大阪府堺市 ○○物流センター',
        preferred_date: '2026年4月上旬～中旬',
        budget: '¥750,000（税別）',
        status: 'in_progress',
        tracking_number: '1234-5678-9012',
        shipping_status: 'received',
        schedule_status: 'date_confirmed',
        work_status: 'scheduling',
        confirmed_work_date: '2026-04-15',
        created_at: '2026-03-11',
        description: '物流倉庫内のフォークリフト5台にAIカメラを設置。人検知機能付きのFLC-1を取り付け、安全管理の強化を目的としています。',
        vehicles: [
          {
            id: 1, seq: 1,
            maker_name: 'トヨタ', car_model: '8FBN25', car_model_code: '8FBN25-60001',
            vehicle_memo: 'バッテリー式25t。雨天時防水注意。',
            status: 'completed',
            products: [
              { id: 1, name: '人検知AIカメラ FLC-1', quantity: 1, serial: 'FLC-2026-0412' },
              { id: 2, name: '後方モニター 7インチ MON-7B', quantity: 1, serial: 'MON-2026-0088' }
            ],
            photos: {
              caution_plate: { count: 1, thumb: true },
              pre_install: { count: 2, thumb: true },
              power_source: { count: 1, thumb: true },
              ground_point: { count: 1, thumb: true },
              completed: { count: 2, thumb: true }
            },
            work_report: '取付完了。\\nダッシュ上にカメラ設置。電源はヒューズBOX ACC 15Aから取得。\\nアース: ボディ左前ボルト。動作確認OK。'
          },
          {
            id: 2, seq: 2,
            maker_name: 'トヨタ', car_model: '8FBN25', car_model_code: '8FBN25-60002',
            vehicle_memo: '',
            status: 'completed',
            products: [
              { id: 3, name: '人検知AIカメラ FLC-1', quantity: 1, serial: 'FLC-2026-0413' },
              { id: 4, name: '後方モニター 7インチ MON-7B', quantity: 1, serial: 'MON-2026-0089' }
            ],
            photos: {
              caution_plate: { count: 1, thumb: true },
              completed: { count: 1, thumb: true }
            },
            work_report: '取付完了。車両①と同配線構成。'
          },
          {
            id: 3, seq: 3,
            maker_name: 'トヨタ', car_model: '8FBN30', car_model_code: '8FBN30-40015',
            vehicle_memo: '30t車両。ヘッドガード形状が異なるため取付ステー要加工。',
            status: 'in_progress',
            products: [
              { id: 5, name: '人検知AIカメラ FLC-1', quantity: 1, serial: 'FLC-2026-0414' }
            ],
            photos: {
              caution_plate: { count: 1, thumb: true },
              pre_install: { count: 1, thumb: true }
            },
            work_report: ''
          },
          {
            id: 4, seq: 4,
            maker_name: 'コマツ', car_model: 'FD25T-17', car_model_code: 'FD25T-17-12345',
            vehicle_memo: 'エンジン式。排気ガス高温エリア注意。',
            status: 'pending',
            products: [
              { id: 6, name: '人検知AIカメラ FLC-1', quantity: 1, serial: '' },
              { id: 7, name: '後方モニター 7インチ MON-7B', quantity: 1, serial: '' },
              { id: 8, name: '防水カバー WPC-01', quantity: 1, serial: '' }
            ],
            photos: {},
            work_report: ''
          },
          {
            id: 5, seq: 5,
            maker_name: 'コマツ', car_model: 'FD25T-17', car_model_code: 'FD25T-17-12346',
            vehicle_memo: '',
            status: 'pending',
            products: [
              { id: 9, name: '人検知AIカメラ FLC-1', quantity: 1, serial: '' }
            ],
            photos: {},
            work_report: ''
          }
        ]
      },
      {
        id: 2,
        title: 'トラックドラレコ取付 3台',
        company_name: '株式会社デモ電装',
        representative_name: 'デモ太郎',
        location: '兵庫県尼崎市 △△運送本社',
        preferred_date: '2026年3月下旬',
        budget: '¥280,000（税別）',
        status: 'completed',
        tracking_number: '9876-5432-1098',
        shipping_status: 'received',
        schedule_status: 'date_confirmed',
        work_status: 'completed',
        confirmed_work_date: '2026-03-25',
        created_at: '2026-03-01',
        description: '配送用トラック3台にクラウド型ドラレコを取り付け。',
        vehicles: [
          {
            id: 6, seq: 1,
            maker_name: 'いすゞ', car_model: 'エルフ', car_model_code: 'NKR85-7001234',
            vehicle_memo: '', status: 'completed',
            products: [
              { id: 10, name: 'クラウド型ドラレコ DRC-200', quantity: 1, serial: 'DRC-2026-0201' },
              { id: 11, name: '車内カメラ INC-100', quantity: 1, serial: 'INC-2026-0101' }
            ],
            photos: { caution_plate: { count: 1, thumb: true }, completed: { count: 2, thumb: true } },
            work_report: '前方・車内2カメラ構成。ACC電源取得完了。'
          },
          {
            id: 7, seq: 2,
            maker_name: 'いすゞ', car_model: 'エルフ', car_model_code: 'NKR85-7001235',
            vehicle_memo: '', status: 'completed',
            products: [
              { id: 12, name: 'クラウド型ドラレコ DRC-200', quantity: 1, serial: 'DRC-2026-0202' },
              { id: 13, name: '車内カメラ INC-100', quantity: 1, serial: 'INC-2026-0102' }
            ],
            photos: { caution_plate: { count: 1, thumb: true }, completed: { count: 1, thumb: true } },
            work_report: '車両①と同構成。'
          },
          {
            id: 8, seq: 3,
            maker_name: '日野', car_model: 'デュトロ', car_model_code: 'XZU710M-TKTMY',
            vehicle_memo: 'メーカー純正カメラと干渉注意', status: 'completed',
            products: [
              { id: 14, name: 'クラウド型ドラレコ DRC-200', quantity: 1, serial: 'DRC-2026-0203' }
            ],
            photos: { caution_plate: { count: 1, thumb: true }, completed: { count: 1, thumb: true } },
            work_report: '前方1カメラ。純正カメラ干渉なし確認済み。'
          }
        ]
      }
    ];

    var VEH_STATUS = {
      'pending': ['未着手','bg-gray-100 text-gray-500 border-gray-200'],
      'in_progress': ['作業中','bg-blue-50 text-blue-700 border-blue-200'],
      'completed': ['完了','bg-green-50 text-green-700 border-green-200'],
      'issue': ['問題あり','bg-red-50 text-red-600 border-red-200']
    };
    var JOB_STATUS = {
      'pending': ['未対応','bg-yellow-50 text-yellow-700 border-yellow-200'],
      'accepted': ['受諾','bg-blue-50 text-blue-700 border-blue-200'],
      'in_progress': ['対応中','bg-indigo-50 text-indigo-700 border-indigo-200'],
      'completed': ['完了','bg-green-50 text-green-700 border-green-200']
    };
    var PHOTO_CATS = [
      ['caution_plate','コーションプレート'],['pre_install','取付前製品'],['power_source','電源取得箇所'],
      ['ground_point','アース取得箇所'],['completed','取付完了写真']
    ];

    var currentJob = null;
    var currentVehicle = null;

    // =====================================================
    // RENDER JOB LIST
    // =====================================================
    function renderJobList() {
      var el = document.getElementById('jobListContainer');
      el.innerHTML = MOCK_JOBS.map(function(j) {
        var s = JOB_STATUS[j.status] || JOB_STATUS.pending;
        var vCount = j.vehicles.length;
        var vDone = j.vehicles.filter(function(v) { return v.status === 'completed'; }).length;
        var pCount = 0;
        j.vehicles.forEach(function(v) { pCount += v.products.length; });
        var photoTotal = 0;
        j.vehicles.forEach(function(v) { Object.values(v.photos).forEach(function(p) { photoTotal += p.count; }); });

        return '<div class="bg-white rounded-lg border border-gray-200 px-5 py-4 hover:border-gray-300 cursor-pointer transition-colors" onclick="viewJobDetail(' + j.id + ')">'
          + '<div class="flex items-center gap-4">'
          + '<div class="min-w-0 flex-1">'
          + '<div class="flex items-center gap-2 mb-1.5 flex-wrap">'
          + '<span class="px-2 py-0.5 text-xs rounded font-medium border ' + s[1] + '">' + s[0] + '</span>'
          + '<span class="text-xs text-gray-400">' + esc(j.company_name) + '</span>'
          + '</div>'
          + '<p class="text-sm font-medium text-gray-800 mb-2">' + esc(j.title) + '</p>'
          // ===== NEW: 車両・商品・写真の集計バッジ =====
          + '<div class="flex items-center gap-2 flex-wrap">'
          + '<span class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-lg text-xs font-medium text-blue-700">'
          + '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>'
          + '車両 <strong>' + vDone + '/' + vCount + '</strong>台完了</span>'
          + '<span class="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 rounded-lg text-xs font-medium text-purple-700">'
          + '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>'
          + '商品 <strong>' + pCount + '</strong>点</span>'
          + '<span class="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded-lg text-xs font-medium text-emerald-700">'
          + '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>'
          + '写真 <strong>' + photoTotal + '</strong>枚</span>'
          + '</div>'
          + '<p class="text-xs text-gray-400 mt-1.5">' + esc(j.location) + ' ・ ' + j.created_at + '</p>'
          + '</div>'
          + '<svg class="w-5 h-5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>'
          + '</div></div>';
      }).join('');
    }

    // =====================================================
    // JOB DETAIL
    // =====================================================
    function viewJobDetail(id) {
      currentJob = MOCK_JOBS.find(function(j) { return j.id === id; });
      if (!currentJob) return;
      document.getElementById('sampleJobList').classList.add('hidden');
      document.getElementById('sampleJobDetail').classList.remove('hidden');
      document.getElementById('samplePartnerView').classList.remove('hidden');
      document.getElementById('detailTitle').textContent = currentJob.title;

      var totalPhotos = 0;
      currentJob.vehicles.forEach(function(v) { Object.values(v.photos).forEach(function(p) { totalPhotos += p.count; }); });
      document.getElementById('vehicleCountBadge').textContent = currentJob.vehicles.length;
      document.getElementById('photoCountBadge').textContent = totalPhotos;

      switchDetailTab('overview');
      renderPartnerView();
    }

    function backToList() {
      document.getElementById('sampleJobList').classList.remove('hidden');
      document.getElementById('sampleJobDetail').classList.add('hidden');
      document.getElementById('samplePartnerView').classList.add('hidden');
      currentJob = null;
      currentVehicle = null;
    }

    // =====================================================
    // DETAIL TABS
    // =====================================================
    var DETAIL_TABS = ['overview','vehicles','tracking','photos'];
    function switchDetailTab(tab) {
      DETAIL_TABS.forEach(function(t) {
        var btn = document.getElementById('dtab_' + t);
        if (t === tab) { btn.classList.add('tab-active'); btn.classList.remove('border-transparent','text-gray-500'); }
        else { btn.classList.remove('tab-active'); btn.classList.add('border-transparent','text-gray-500'); }
      });
      var ct = document.getElementById('detailTabContent');
      if (tab === 'overview') renderOverviewTab(ct);
      else if (tab === 'vehicles') renderVehiclesTab(ct);
      else if (tab === 'tracking') renderTrackingTab(ct);
      else if (tab === 'photos') renderPhotosTab(ct);
    }

    // ===== Overview Tab =====
    function renderOverviewTab(ct) {
      var j = currentJob;
      var s = JOB_STATUS[j.status] || JOB_STATUS.pending;
      ct.innerHTML = '<div class="space-y-6">'
        // Header info
        + '<div>'
        + '<div class="flex items-center gap-2 mb-2"><span class="px-2 py-0.5 text-xs rounded font-medium border ' + s[1] + '">' + s[0] + '</span><span class="text-xs text-gray-400">ID: ' + j.id + '</span></div>'
        + '<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mt-4">'
        + '<div><p class="text-xs text-gray-400">パートナー</p><p class="font-medium">' + esc(j.company_name) + '</p></div>'
        + '<div><p class="text-xs text-gray-400">作業場所</p><p class="font-medium">' + esc(j.location) + '</p></div>'
        + '<div><p class="text-xs text-gray-400">希望日程</p><p class="font-medium">' + esc(j.preferred_date) + '</p></div>'
        + '<div><p class="text-xs text-gray-400">予算</p><p class="font-medium">' + esc(j.budget) + '</p></div>'
        + '<div><p class="text-xs text-gray-400">送り状NO</p><p class="font-medium">' + esc(j.tracking_number || '-') + '</p></div>'
        + '<div><p class="text-xs text-gray-400">作成日</p><p class="font-medium">' + j.created_at + '</p></div>'
        + '</div>'
        + (j.description ? '<div class="mt-4"><p class="text-xs text-gray-400 mb-1">詳細説明</p><div class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-line">' + esc(j.description) + '</div></div>' : '')
        + '</div>'
        // Vehicle summary bar
        + '<div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">'
        + '<h4 class="text-sm font-bold text-sva-dark mb-3 flex items-center gap-2">'
        + '<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0H3m10 0h2m4 0a1 1 0 001-1v-4.586a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0015.586 6H13"/></svg>'
        + '車両進捗サマリー</h4>'
        + '<div class="grid grid-cols-' + Math.min(j.vehicles.length, 5) + ' gap-2">'
        + j.vehicles.map(function(v) {
          var vs = VEH_STATUS[v.status] || VEH_STATUS.pending;
          return '<div class="bg-white rounded-lg p-3 border border-white shadow-sm">'
            + '<p class="text-[10px] text-gray-400 mb-1">#' + v.seq + '</p>'
            + '<p class="text-xs font-bold text-gray-800 truncate">' + esc(v.maker_name) + ' ' + esc(v.car_model) + '</p>'
            + '<span class="inline-block mt-1.5 px-1.5 py-0.5 text-[10px] rounded font-medium border ' + vs[1] + '">' + vs[0] + '</span>'
            + '</div>';
        }).join('')
        + '</div>'
        + '<div class="mt-3 text-right"><button onclick="switchDetailTab(\\'vehicles\\')" class="text-xs text-blue-700 font-medium hover:underline">車両明細を開く →</button></div>'
        + '</div>'
        + '</div>';
    }

    // ===== Vehicles Tab (MAIN NEW FEATURE) =====
    function renderVehiclesTab(ct) {
      var j = currentJob;
      if (currentVehicle) { renderVehicleDetail(ct); return; }

      var vDone = j.vehicles.filter(function(v) { return v.status === 'completed'; }).length;
      var progress = Math.round(vDone / j.vehicles.length * 100);

      ct.innerHTML = '<div>'
        // Progress bar
        + '<div class="flex items-center gap-4 mb-6">'
        + '<div class="flex-1"><div class="flex items-center justify-between mb-1"><span class="text-sm font-bold text-sva-dark">車両明細</span><span class="text-xs text-gray-500">' + vDone + ' / ' + j.vehicles.length + '台完了 (' + progress + '%)</span></div>'
        + '<div class="w-full bg-gray-200 rounded-full h-2.5"><div class="bg-green-500 h-2.5 rounded-full transition-all" style="width:' + progress + '%"></div></div></div>'
        + '<button onclick="showAddVehicle()" class="px-4 py-2 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors shrink-0">+ 車両追加</button>'
        + '</div>'
        // Vehicle cards
        + '<div class="space-y-3">'
        + j.vehicles.map(function(v, idx) {
          var vs = VEH_STATUS[v.status] || VEH_STATUS.pending;
          var photoCount = 0;
          Object.values(v.photos).forEach(function(p) { photoCount += p.count; });
          return '<div class="vehicle-card bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer transition-colors" onclick="openVehicle(' + v.id + ')">'
            + '<div class="flex items-stretch">'
            // Left: seq number
            + '<div class="w-14 flex items-center justify-center text-lg font-bold ' + (v.status === 'completed' ? 'bg-green-50 text-green-600' : v.status === 'in_progress' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400') + ' shrink-0">#' + v.seq + '</div>'
            // Center: info
            + '<div class="flex-1 p-4">'
            + '<div class="flex items-center gap-2 mb-1">'
            + '<span class="px-2 py-0.5 text-[10px] rounded font-medium border ' + vs[1] + '">' + vs[0] + '</span>'
            + '<span class="text-xs text-gray-400">' + esc(v.car_model_code) + '</span>'
            + '</div>'
            + '<p class="text-sm font-bold text-gray-800">' + esc(v.maker_name) + ' ' + esc(v.car_model) + '</p>'
            + '<div class="flex items-center gap-3 mt-2 text-xs text-gray-500">'
            + '<span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>商品 ' + v.products.length + '点</span>'
            + '<span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>写真 ' + photoCount + '枚</span>'
            + (v.work_report ? '<span class="flex items-center gap-1 text-green-600"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>報告済</span>' : '<span class="flex items-center gap-1 text-gray-400"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>報告待ち</span>')
            + '</div>'
            + (v.vehicle_memo ? '<p class="text-[11px] text-amber-700 bg-amber-50 rounded px-2 py-1 mt-2">⚠ ' + esc(v.vehicle_memo) + '</p>' : '')
            + '</div>'
            // Right: products summary
            + '<div class="w-48 bg-gray-50 p-3 border-l border-gray-100 hidden sm:block">'
            + '<p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">取付商品</p>'
            + v.products.map(function(p) {
              return '<p class="text-[11px] text-gray-600 truncate leading-relaxed">' + esc(p.name) + (p.serial ? ' <span class="text-gray-400">(' + esc(p.serial) + ')</span>' : '') + '</p>';
            }).join('')
            + '</div>'
            + '<div class="flex items-center px-3 shrink-0"><svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></div>'
            + '</div></div>';
        }).join('')
        + '</div></div>';
    }

    // ===== Vehicle Detail (drilldown) =====
    function openVehicle(vid) {
      currentVehicle = currentJob.vehicles.find(function(v) { return v.id === vid; });
      renderVehiclesTab(document.getElementById('detailTabContent'));
    }

    function backToVehicleList() {
      currentVehicle = null;
      renderVehiclesTab(document.getElementById('detailTabContent'));
    }

    function renderVehicleDetail(ct) {
      var v = currentVehicle;
      var vs = VEH_STATUS[v.status] || VEH_STATUS.pending;

      // Products table
      var prodRows = v.products.map(function(p, i) {
        return '<tr class="border-t border-gray-100">'
          + '<td class="py-2.5 px-3 text-sm">' + (i+1) + '</td>'
          + '<td class="py-2.5 px-3 text-sm font-medium">' + esc(p.name) + '</td>'
          + '<td class="py-2.5 px-3 text-sm text-center">' + p.quantity + '</td>'
          + '<td class="py-2.5 px-3 text-sm font-mono text-xs">' + (p.serial ? esc(p.serial) : '<span class="text-gray-300">未登録</span>') + '</td>'
          + '<td class="py-2.5 px-3 text-right"><button class="text-xs text-sva-red hover:underline">編集</button></td>'
          + '</tr>';
      }).join('');

      // Photo slots
      var photoHtml = PHOTO_CATS.map(function(c) {
        var catPhotos = v.photos[c[0]];
        var count = catPhotos ? catPhotos.count : 0;
        return '<div class="photo-slot border border-gray-200 rounded-lg p-3 text-center cursor-pointer">'
          + (count > 0
            ? '<div class="w-full h-20 bg-gray-100 rounded flex items-center justify-center mb-2"><svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7"/></svg></div>'
              + '<p class="text-xs font-medium text-green-700">' + c[1] + '</p>'
              + '<p class="text-[10px] text-green-500">' + count + '枚アップロード済</p>'
            : '<div class="w-full h-20 bg-gray-50 rounded flex items-center justify-center mb-2 border-2 border-dashed border-gray-200"><svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg></div>'
              + '<p class="text-xs font-medium text-gray-500">' + c[1] + '</p>'
              + '<p class="text-[10px] text-gray-400">未撮影</p>')
          + '</div>';
      }).join('');

      ct.innerHTML = '<div>'
        + '<div class="flex items-center gap-3 mb-5">'
        + '<button onclick="backToVehicleList()" class="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">← 車両一覧</button>'
        + '<div class="flex items-center gap-2"><span class="px-2 py-0.5 text-[10px] rounded font-medium border ' + vs[1] + '">' + vs[0] + '</span><h3 class="text-base font-bold text-sva-dark">#' + v.seq + ' ' + esc(v.maker_name) + ' ' + esc(v.car_model) + '</h3></div>'
        + '</div>'
        // Vehicle info
        + '<div class="grid lg:grid-cols-3 gap-6">'
        + '<div class="lg:col-span-2 space-y-5">'
        // Basic info card
        + '<div class="rounded-xl border border-gray-200 p-5">'
        + '<h4 class="text-sm font-bold text-sva-dark mb-3">車両情報</h4>'
        + '<div class="grid grid-cols-3 gap-4 text-sm">'
        + '<div><p class="text-xs text-gray-400 mb-0.5">メーカー</p><p class="font-medium">' + esc(v.maker_name) + '</p></div>'
        + '<div><p class="text-xs text-gray-400 mb-0.5">車種</p><p class="font-medium">' + esc(v.car_model) + '</p></div>'
        + '<div><p class="text-xs text-gray-400 mb-0.5">車両型式</p><p class="font-mono text-xs">' + esc(v.car_model_code) + '</p></div>'
        + '</div>'
        + (v.vehicle_memo ? '<div class="mt-3 p-2.5 bg-amber-50 rounded-lg border border-amber-100"><p class="text-xs text-amber-800">⚠ ' + esc(v.vehicle_memo) + '</p></div>' : '')
        + '</div>'
        // Products table
        + '<div class="rounded-xl border border-gray-200 p-5">'
        + '<div class="flex items-center justify-between mb-3"><h4 class="text-sm font-bold text-sva-dark">取付商品一覧</h4><button class="text-xs text-sva-red font-medium hover:underline">+ 商品追加</button></div>'
        + '<table class="w-full text-left"><thead class="text-[10px] text-gray-400 uppercase tracking-wider"><tr><th class="py-2 px-3 w-10">#</th><th class="py-2 px-3">商品名</th><th class="py-2 px-3 text-center w-16">数量</th><th class="py-2 px-3 w-40">シリアル番号</th><th class="py-2 px-3 w-12"></th></tr></thead><tbody>' + prodRows + '</tbody></table>'
        + '</div>'
        // Work report
        + '<div class="rounded-xl border border-gray-200 p-5">'
        + '<h4 class="text-sm font-bold text-sva-dark mb-3">作業報告</h4>'
        + (v.work_report
          ? '<div class="text-sm text-gray-600 bg-green-50 rounded-lg p-3 whitespace-pre-line border border-green-100">' + esc(v.work_report) + '</div>'
          : '<div class="text-sm text-gray-400 bg-gray-50 rounded-lg p-3 text-center border border-dashed border-gray-200">パートナーからの作業報告はまだありません</div>')
        + '</div>'
        + '</div>'
        // Right sidebar: photos
        + '<div>'
        + '<div class="rounded-xl border border-gray-200 p-5 sticky top-20">'
        + '<h4 class="text-sm font-bold text-sva-dark mb-3">撮影写真</h4>'
        + '<div class="grid grid-cols-2 gap-2">' + photoHtml + '</div>'
        + '</div>'
        + '</div>'
        + '</div></div>';
    }

    // ===== Tracking Tab (same as existing) =====
    function renderTrackingTab(ct) {
      var j = currentJob;
      ct.innerHTML = '<div class="max-w-3xl">'
        + '<p class="text-sm text-gray-500 mb-4">トラッキング機能は既存のUIと同じです（案件全体レベル）。車両個別の進捗は「車両明細」タブで管理します。</p>'
        + '<div class="grid grid-cols-3 gap-4">'
        + '<div class="p-4 rounded-xl border border-gray-200 bg-gray-50 text-center"><p class="text-xs text-gray-400 mb-1">製品発送</p><p class="text-sm font-bold">' + (j.shipping_status === 'received' ? '✅ 受取済' : j.shipping_status === 'shipped' ? '📦 発送済' : '⏳ 未発送') + '</p></div>'
        + '<div class="p-4 rounded-xl border border-gray-200 bg-gray-50 text-center"><p class="text-xs text-gray-400 mb-1">日程調整</p><p class="text-sm font-bold">' + (j.schedule_status === 'date_confirmed' ? '✅ ' + j.confirmed_work_date : '🔄 調整中') + '</p></div>'
        + '<div class="p-4 rounded-xl border border-gray-200 bg-gray-50 text-center"><p class="text-xs text-gray-400 mb-1">作業</p><p class="text-sm font-bold">' + (j.work_status === 'completed' ? '✅ 完了' : '🔄 進行中') + '</p></div>'
        + '</div>'
        + '</div>';
    }

    // ===== Photos Tab (all vehicles summary) =====
    function renderPhotosTab(ct) {
      var j = currentJob;
      var html = '<div>';
      j.vehicles.forEach(function(v) {
        var photoCount = 0;
        Object.values(v.photos).forEach(function(p) { photoCount += p.count; });
        if (photoCount === 0) return;
        html += '<div class="mb-6">'
          + '<h4 class="text-sm font-bold text-sva-dark mb-3 flex items-center gap-2">'
          + '<span class="w-6 h-6 rounded-full bg-sva-red text-white text-xs flex items-center justify-center font-bold">' + v.seq + '</span>'
          + esc(v.maker_name) + ' ' + esc(v.car_model) + ' <span class="font-normal text-gray-400">(' + esc(v.car_model_code) + ')</span></h4>'
          + '<div class="flex gap-2 flex-wrap">';
        PHOTO_CATS.forEach(function(c) {
          var cp = v.photos[c[0]];
          if (!cp || cp.count === 0) return;
          for (var i = 0; i < cp.count; i++) {
            html += '<div class="w-24 h-24 rounded-lg border border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-sva-red transition-colors">'
              + '<svg class="w-6 h-6 text-gray-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>'
              + '<p class="text-[9px] text-gray-400 text-center leading-tight">' + c[1] + '</p></div>';
          }
        });
        html += '</div></div>';
      });
      html += '</div>';
      ct.innerHTML = html;
    }

    // =====================================================
    // PARTNER VIEW (MyPage sample)
    // =====================================================
    function renderPartnerView() {
      var j = currentJob;
      var pct = document.getElementById('partnerViewContent');

      pct.innerHTML = '<div class="space-y-4">'
        // Vehicle list (partner view)
        + j.vehicles.map(function(v) {
          var vs = VEH_STATUS[v.status] || VEH_STATUS.pending;
          var photoCount = 0;
          Object.values(v.photos).forEach(function(p) { photoCount += p.count; });
          var photoDone = PHOTO_CATS.filter(function(c) { return v.photos[c[0]] && v.photos[c[0]].count > 0; }).length;

          return '<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">'
            // Header
            + '<div class="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">'
            + '<div class="flex items-center gap-2">'
            + '<span class="w-7 h-7 rounded-full ' + (v.status === 'completed' ? 'bg-green-500' : v.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300') + ' text-white text-xs flex items-center justify-center font-bold">' + v.seq + '</span>'
            + '<span class="text-sm font-bold text-gray-800">' + esc(v.maker_name) + ' ' + esc(v.car_model) + '</span>'
            + '<span class="text-xs text-gray-400">' + esc(v.car_model_code) + '</span></div>'
            + '<span class="px-2 py-0.5 text-[10px] rounded font-medium border ' + vs[1] + '">' + vs[0] + '</span>'
            + '</div>'
            // Content
            + '<div class="p-5">'
            // Products
            + '<div class="mb-4">'
            + '<p class="text-xs font-bold text-gray-600 mb-2">取付商品</p>'
            + '<div class="space-y-1">' + v.products.map(function(p) {
              return '<div class="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded-lg text-sm">'
                + '<span>' + esc(p.name) + ' × ' + p.quantity + '</span>'
                + '<span class="text-xs text-gray-400 font-mono">' + (p.serial || '—') + '</span></div>';
            }).join('') + '</div></div>'
            // Photo progress
            + '<div class="mb-4">'
            + '<div class="flex items-center justify-between mb-2"><p class="text-xs font-bold text-gray-600">撮影進捗</p><span class="text-xs text-gray-400">' + photoDone + '/' + PHOTO_CATS.length + ' カテゴリ完了</span></div>'
            + '<div class="grid grid-cols-5 gap-1.5">' + PHOTO_CATS.map(function(c) {
              var done = v.photos[c[0]] && v.photos[c[0]].count > 0;
              return '<div class="text-center p-2 rounded-lg ' + (done ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-dashed border-gray-200') + '">'
                + (done ? '<svg class="w-5 h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
                       : '<svg class="w-5 h-5 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>')
                + '<p class="text-[9px] mt-1 leading-tight ' + (done ? 'text-green-700 font-medium' : 'text-gray-400') + '">' + c[1] + '</p></div>';
            }).join('') + '</div></div>'
            // Action buttons
            + '<div class="flex gap-2">'
            + (v.status !== 'completed'
              ? '<button class="flex-1 py-2.5 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">写真撮影・報告</button>'
                + '<button class="px-4 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">作業報告を記入</button>'
              : '<div class="flex-1 py-2.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg text-center border border-green-200">✅ 作業完了・報告済み</div>')
            + '</div>'
            + '</div></div>';
        }).join('')
        + '</div>';
    }

    // =====================================================
    // PLACEHOLDER FUNCTIONS
    // =====================================================
    function showNewJob() { alert('新規案件作成（本番UIと同じ）'); }
    function showAddVehicle() { alert('車両追加フォーム:\\n\\n・メーカー名\\n・車種\\n・車両型式\\n・メモ\\n・取付商品（複数選択）\\n\\n→ 保存後に車両明細一覧に追加されます'); }

    // =====================================================
    // UTILITIES
    // =====================================================
    function esc(str) { if (!str) return ''; var d = document.createElement('div'); d.textContent = str; return d.innerHTML; }

    // Init
    renderJobList();
  </script>

</body>
</html>`
}
