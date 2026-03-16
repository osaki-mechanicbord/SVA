import { siteHead, siteHeader, siteFooter, escapeHtml } from './layout'

// ==========================================
// 取付依頼専用ページ（メーカー・商社向け B2B）
// ==========================================

export function requestPage(): string {
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://sva-assist.com/request#webpage",
        "name": "取付依頼 | SVA - Special Vehicle Assist",
        "description": "メーカー・商社様向けの装置取付依頼ページ。フォークリフト・重機・建機・トラック・バス・船舶への安全装置・ドライブレコーダー取付を全国47都道府県で対応。",
        "url": "https://sva-assist.com/request",
        "isPartOf": { "@id": "https://sva-assist.com/#website" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://sva-assist.com/" },
          { "@type": "ListItem", "position": 2, "name": "取付依頼", "item": "https://sva-assist.com/request" }
        ]
      },
      {
        "@type": "Service",
        "name": "SVA 装置取付サービス",
        "provider": { "@id": "https://sva-assist.com/#organization" },
        "serviceType": "特殊車両への装置出張取付",
        "areaServed": { "@type": "Country", "name": "Japan" }
      }
    ]
  })

  return siteHead(
    '取付依頼 | SVA - Special Vehicle Assist',
    'メーカー・商社様向けの装置取付依頼ページ。フォークリフト・重機・建機・トラック・バス・船舶への安全装置・ドライブレコーダー取付を全国47都道府県で対応。',
    '/request',
    `<script type="application/ld+json">${structuredData}</script>
    <style>
      .request-hero {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        position: relative;
        overflow: hidden;
      }
      .request-hero::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: 
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
        background-size: 60px 60px;
        pointer-events: none;
      }
      .flow-connector {
        position: absolute;
        top: 50%;
        right: -24px;
        width: 48px;
        height: 2px;
        background: linear-gradient(90deg, #C41E3A, transparent);
      }
      @media (max-width: 767px) {
        .flow-connector { display: none; }
      }
      .form-section-header {
        position: relative;
        padding-left: 16px;
      }
      .form-section-header::before {
        content: '';
        position: absolute;
        left: 0;
        top: 2px;
        bottom: 2px;
        width: 4px;
        border-radius: 2px;
        background: #C41E3A;
      }
      .product-entry, .vehicle-entry, .site-entry {
        animation: slideIn 0.3s ease;
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .form-input {
        width: 100%;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 0.625rem 0.875rem;
        font-size: 0.875rem;
        transition: border-color 0.2s, box-shadow 0.2s;
        outline: none;
        background: white;
      }
      .form-input:focus {
        border-color: #C41E3A;
        box-shadow: 0 0 0 3px rgba(196,30,58,0.1);
      }
      .form-input::placeholder {
        color: #9ca3af;
      }
      .form-select {
        width: 100%;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 0.625rem 0.875rem;
        font-size: 0.875rem;
        transition: border-color 0.2s, box-shadow 0.2s;
        outline: none;
        background: white;
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.5rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
      }
      .form-select:focus {
        border-color: #C41E3A;
        box-shadow: 0 0 0 3px rgba(196,30,58,0.1);
      }
      .form-label {
        display: block;
        font-size: 0.8125rem;
        font-weight: 600;
        color: #1a1a2e;
        margin-bottom: 0.375rem;
      }
      .form-label .required {
        color: #C41E3A;
        font-size: 0.6875rem;
        margin-left: 0.25rem;
      }
      .form-label .optional {
        color: #9ca3af;
        font-size: 0.6875rem;
        font-weight: 400;
        margin-left: 0.25rem;
      }
    </style>`
  ) + siteHeader() + `
  <main>
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <nav class="flex items-center gap-2 text-xs text-gray-500">
          <a href="/" class="hover:text-sva-red transition-colors">ホーム</a>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span class="text-gray-800 font-medium">取付依頼</span>
        </nav>
      </div>
    </div>

    <!-- ===== HERO SECTION ===== -->
    <section class="request-hero py-16 sm:py-24">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div class="max-w-3xl">
          <p class="text-sva-red font-medium text-xs sm:text-sm tracking-[0.2em] mb-4 uppercase">Installation Request for Business</p>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            製品の取付作業を<br class="sm:hidden">SVAに依頼する
          </h1>
          <p class="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
            メーカー・商社・現場オーナー様 ── 自社製品の特殊車両への取付にお困りではありませんか？<br>
            SVAなら、商品の発送から取付業者の選定・見積もり承認・施工・写真付き報告まで<span class="text-white font-medium">ワンストップで完結</span>します。<br>
            お客様は<span class="text-white font-medium">ステータスを確認し、施工完了後に工賃をお支払い</span>いただくだけです。
          </p>
          <div class="flex flex-col sm:flex-row gap-3">
            <a href="#request-form" class="inline-flex items-center justify-center px-8 py-3.5 bg-sva-red text-white font-medium rounded-lg hover:bg-red-800 transition-colors text-sm gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              取付を依頼する
            </a>
            <a href="tel:06-6152-7511" class="inline-flex items-center justify-center px-8 py-3.5 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors text-sm gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              06-6152-7511
            </a>
          </div>
          <p class="text-xs text-gray-500 mt-3">受付時間 9:00〜18:00（土日祝を除く）</p>
        </div>
      </div>
    </section>

    <!-- ===== USER JOURNEY: 課題提起 ===== -->
    <section class="py-16 sm:py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <p class="text-sva-red text-xs sm:text-sm font-medium tracking-[0.15em] mb-2">CHALLENGES</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-sva-dark">こんなお悩みはありませんか？</h2>
          <p class="text-sm text-gray-500 mt-3 max-w-xl mx-auto">メーカー・商社・現場オーナー様が抱えるアフターサービスの課題</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${renderChallenge('01', '取付業者が見つからない', '自社製品を特殊車両に取り付けたいが、乗用車ではないため対応できる電装業者を全国で探すのが難しい。')}
          ${renderChallenge('02', 'アフターサービスの負担', '販売後の取付手配まで自社で対応すると、営業・物流・施工管理のリソースが逼迫する。')}
          ${renderChallenge('03', '全国対応が困難', 'エンドユーザーが全国に点在しており、地域ごとに取付業者を手配・品質管理するのは現実的ではない。')}
          ${renderChallenge('04', '施工品質のばらつき', '都度異なる業者に依頼するため、取付品質や報告内容にばらつきが生じ、クレームにつながるリスクがある。')}
          ${renderChallenge('05', '工賃の相場が不明', '特殊車両向け取付の料金相場がわからず、エンドユーザーへの見積もり提示が遅れる。')}
          ${renderChallenge('06', '施工記録が残らない', '取付後の電源取り出し位置やアース位置などの技術的な施工記録が残らず、メンテナンスに支障が出る。')}
        </div>
      </div>
    </section>

    <!-- ===== SOLUTION FLOW: SVAが解決 ===== -->
    <section class="py-16 sm:py-20 bg-sva-light">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-14">
          <p class="text-sva-red text-xs sm:text-sm font-medium tracking-[0.15em] mb-2">HOW IT WORKS</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-sva-dark">SVAなら、ワンストップで解決</h2>
          <p class="text-sm text-gray-500 mt-3 max-w-xl mx-auto">発注から施工完了まで、お客様の手間を最小限に</p>
        </div>
        <div class="grid md:grid-cols-4 gap-6 md:gap-4">
          ${renderFlowStep(1, '取付依頼', 'フォームから商品情報・車両情報・出張先をご入力。複数台・複数拠点もまとめて登録可能。', 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', true)}
          ${renderFlowStep(2, '見積もり・承認', 'SVAが最適な公認パートナーを選定し、お見積もりをご提示。承認後に施工日程を調整します。', 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', true)}
          ${renderFlowStep(3, '出張施工', 'SVA公認パートナーが現場へ出張。ランク制認定パートナーが施工を担当します。', 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', true)}
          ${renderFlowStep(4, '報告・お支払い', '写真付き施工報告書（電源・アース位置記録付き）をお送り。確認後に工賃をお支払いいただきます。', 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', false)}
        </div>

        <!-- User journey highlight -->
        <div class="mt-12 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
          <div class="flex items-start gap-4">
            <div class="shrink-0 w-10 h-10 bg-sva-red/10 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-sva-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <h3 class="font-bold text-sva-dark text-sm mb-2">お客様がやることは「ステータス確認」と「工賃のお支払い」だけ</h3>
              <p class="text-xs sm:text-sm text-gray-500 leading-relaxed">
                メーカー・商社様は製品をSVAに発送（または直送指示）するだけ。取付業者の選定、見積もり、日程調整、施工管理、報告書作成まですべてSVAが一括管理します。施工完了後に施工報告書をご確認いただき、工賃をお支払いいただくだけで完了です。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== SVA ADVANTAGES ===== -->
    <section class="py-16 sm:py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <p class="text-sva-red text-xs sm:text-sm font-medium tracking-[0.15em] mb-2">WHY SVA</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-sva-dark">SVAが選ばれる理由</h2>
          <p class="text-sm text-gray-500 mt-3 max-w-xl mx-auto">商品発送から取付業者選定、施工完了まで一気通貫</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${renderAdvantage(
            'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            '発注〜施工〜フォローまで一気通貫',
            '商品の受取・発送管理から、取付業者の選定、見積もり承認後のパートナー手配、施工管理、完了報告まで、すべてのプロセスをSVAがワンストップで管理します。'
          )}
          ${renderAdvantage(
            'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
            'ランク制公認パートナー',
            'Standard → Silver → Gold → Platinum の4段階ランク制で品質を管理。施工実績・品質評価に基づきランクが昇格し、高ランクパートナーを優先手配します。'
          )}
          ${renderAdvantage(
            'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
            '写真付き施工報告書',
            '施工完了後、取付箇所・電源取り出し位置・アース位置を含む写真付き報告書をお送りします。メンテナンスや修理時にも活用いただける技術的記録です。'
          )}
          ${renderAdvantage(
            'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            '全国47都道府県対応',
            '北海道から沖縄まで、全国47都道府県に公認パートナーネットワークを展開。エンドユーザーの現場がどこでも、最寄りのパートナーが出張施工に対応します。'
          )}
          ${renderAdvantage(
            'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            '明朗会計・追加請求なし',
            '施工前にすべての費用を明示。取付工賃・出張費用・部材費用を含む見積もりをご承認いただいた上で施工開始。追加請求は一切ありません。'
          )}
          ${renderAdvantage(
            'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
            'ステータスリアルタイム管理',
            '依頼受付 → 見積もり → パートナー手配 → 施工日確定 → 施工中 → 完了 の全工程をリアルタイムでステータス管理。いつでも進捗を確認できます。'
          )}
        </div>
      </div>
    </section>

    <!-- ===== REASSURANCE / SAFETY NET ===== -->
    <section class="py-16 sm:py-20 bg-sva-light">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <p class="text-sva-red text-xs sm:text-sm font-medium tracking-[0.15em] mb-2">TRUST & SAFETY</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-sva-dark">安心してご依頼いただくために</h2>
        </div>
        <div class="grid sm:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <div class="flex items-start gap-4">
              <div class="shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <div>
                <h3 class="font-bold text-sva-dark text-sm mb-1.5">施工保証</h3>
                <p class="text-xs text-gray-500 leading-relaxed">施工後に不具合が発生した場合、速やかに再施工または修正対応を行います。公認パートナー制度による品質管理体制を構築しています。</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <div class="flex items-start gap-4">
              <div class="shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <div>
                <h3 class="font-bold text-sva-dark text-sm mb-1.5">情報の取り扱い</h3>
                <p class="text-xs text-gray-500 leading-relaxed">ご依頼情報は厳重に管理します。製品名や仕様など開示が難しい内容は「非開示希望」をお選びいただき、打ち合わせにて対応いたします。</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <div class="flex items-start gap-4">
              <div class="shrink-0 w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              </div>
              <div>
                <h3 class="font-bold text-sva-dark text-sm mb-1.5">専任担当制</h3>
                <p class="text-xs text-gray-500 leading-relaxed">お客様ごとに専任の担当者をアサイン。ご依頼内容のヒアリングから施工完了まで、一貫して同じ担当者が対応するため、連絡ロスを防ぎます。</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <div class="flex items-start gap-4">
              <div class="shrink-0 w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              <div>
                <h3 class="font-bold text-sva-dark text-sm mb-1.5">法人実績・継続取引</h3>
                <p class="text-xs text-gray-500 leading-relaxed">一度ご依頼いただいた法人様は、次回以降の発注がスムーズに。過去の施工記録を活用した迅速な見積もりと、優先的なパートナー手配が可能です。</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <div class="flex items-start gap-4">
              <div class="shrink-0 w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-sva-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <div>
                <h3 class="font-bold text-sva-dark text-sm mb-1.5">施工不可の事前通知</h3>
                <p class="text-xs text-gray-500 leading-relaxed">製品の構成や車両との適合性により、施工をお受けできない場合があります。その場合はSVAより事前にご連絡し、代替案をご提案いたします。</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <div class="flex items-start gap-4">
              <div class="shrink-0 w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <h3 class="font-bold text-sva-dark text-sm mb-1.5">柔軟なスケジュール調整</h3>
                <p class="text-xs text-gray-500 leading-relaxed">エンドユーザーの稼働スケジュールに合わせた施工日程の調整が可能。土日・早朝・夜間の施工にも対応しています（パートナーによる）。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== REQUEST FORM ===== -->
    <section id="request-form" class="py-16 sm:py-20 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-10">
          <p class="text-sva-red text-xs sm:text-sm font-medium tracking-[0.15em] mb-2">REQUEST FORM</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-sva-dark">取付依頼フォーム</h2>
          <p class="text-sm text-gray-500 mt-3 max-w-lg mx-auto">下記フォームにご記入の上、送信してください。<br>内容を確認後、担当者よりご連絡いたします。</p>
        </div>

        <!-- Success message (hidden by default) -->
        <div id="requestSuccess" class="hidden mb-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h3 class="font-bold text-green-800 mb-1">ご依頼を受け付けました</h3>
          <p class="text-sm text-green-600">担当者より2営業日以内にご連絡いたします。</p>
        </div>

        <!-- Error message (hidden by default) -->
        <div id="requestError" class="hidden mb-8 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p id="requestErrorMsg" class="text-sm text-red-700"></p>
        </div>

        <form id="requestFormEl" class="space-y-10" onsubmit="return false;">

          <!-- ========== SECTION 1: Company Info ========== -->
          <div class="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <h3 class="form-section-header text-base sm:text-lg font-bold text-sva-dark mb-6">依頼元情報</h3>
            <div class="grid sm:grid-cols-2 gap-5">
              <div class="sm:col-span-2">
                <label class="form-label">会社名 <span class="required">※必須</span></label>
                <input type="text" name="company_name" class="form-input" placeholder="例: 株式会社〇〇" required>
              </div>
              <div>
                <label class="form-label">部署名 <span class="optional">任意</span></label>
                <input type="text" name="department" class="form-input" placeholder="例: 営業部">
              </div>
              <div>
                <label class="form-label">ご担当者名 <span class="required">※必須</span></label>
                <input type="text" name="contact_person" class="form-input" placeholder="例: 山田 太郎" required>
              </div>
              <div class="sm:col-span-2">
                <label class="form-label">会社住所 <span class="required">※必須</span></label>
                <input type="text" name="company_address" class="form-input" placeholder="例: 東京都千代田区〇〇1-2-3" required>
              </div>
              <div>
                <label class="form-label">電話番号 <span class="required">※必須</span></label>
                <input type="tel" name="phone" class="form-input" placeholder="例: 03-1234-5678" required>
              </div>
              <div>
                <label class="form-label">メールアドレス <span class="required">※必須</span></label>
                <input type="email" name="email" class="form-input" placeholder="例: yamada@example.com" required>
              </div>
            </div>
          </div>

          <!-- ========== SECTION 2: Disclosure Preference ========== -->
          <div class="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <h3 class="form-section-header text-base sm:text-lg font-bold text-sva-dark mb-4">情報開示の可否</h3>
            <p class="text-xs text-gray-500 mb-4">製品の詳細を開示が難しい場合は「非開示希望」を選択ください。打ち合わせにて詳細を確認いたします。</p>
            <div class="flex flex-col sm:flex-row gap-4">
              <label class="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-sva-red/30 transition-colors flex-1">
                <input type="radio" name="disclosure" value="open" class="w-4 h-4 text-sva-red accent-[#C41E3A]" checked>
                <div>
                  <p class="text-sm font-medium text-sva-dark">開示可能</p>
                  <p class="text-xs text-gray-400">商品名・仕様を下記フォームに記入</p>
                </div>
              </label>
              <label class="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-sva-red/30 transition-colors flex-1">
                <input type="radio" name="disclosure" value="closed" class="w-4 h-4 text-sva-red accent-[#C41E3A]">
                <div>
                  <p class="text-sm font-medium text-sva-dark">非開示希望</p>
                  <p class="text-xs text-gray-400">打ち合わせを希望する</p>
                </div>
              </label>
            </div>
            <!-- Meeting date (shown when closed) -->
            <div id="meetingDateWrap" class="hidden mt-4">
              <label class="form-label">打ち合わせ希望日 <span class="optional">任意</span></label>
              <input type="date" name="meeting_date" class="form-input max-w-xs">
              <p class="text-xs text-gray-400 mt-1">候補日をご指定ください。後日調整も可能です。</p>
            </div>
          </div>

          <!-- ========== SECTION 3: Products (multiple) ========== -->
          <div id="openSection" class="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <div class="flex items-center justify-between mb-6">
              <h3 class="form-section-header text-base sm:text-lg font-bold text-sva-dark">取付商品情報</h3>
              <button type="button" onclick="addProduct()" class="inline-flex items-center gap-1.5 text-xs font-medium text-sva-red hover:text-red-800 transition-colors bg-red-50 px-3 py-1.5 rounded-lg">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                商品を追加
              </button>
            </div>
            <div id="productList">
              <div class="product-entry bg-white rounded-xl border border-gray-200 p-5 mb-4" data-idx="0">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-xs font-bold text-sva-red bg-red-50 px-2 py-0.5 rounded">商品 #1</span>
                </div>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div class="sm:col-span-2">
                    <label class="form-label">商品名 <span class="required">※必須</span></label>
                    <input type="text" name="product_name_0" class="form-input" placeholder="例: AI人検知カメラ MX-300">
                  </div>
                  <div>
                    <label class="form-label">カテゴリ</label>
                    <select name="product_category_0" class="form-select">
                      <option value="">選択してください</option>
                      <option value="ドライブレコーダー">ドライブレコーダー</option>
                      <option value="AIカメラ">AIカメラ</option>
                      <option value="デジタルタコグラフ">デジタルタコグラフ</option>
                      <option value="ETC車載器">ETC車載器</option>
                      <option value="バックカメラ">バックカメラ</option>
                      <option value="置き去り防止装置">置き去り防止装置</option>
                      <option value="建機停止装置">建機停止装置</option>
                      <option value="LEDマーカーランプ">LEDマーカーランプ</option>
                      <option value="その他">その他</option>
                    </select>
                  </div>
                  <div>
                    <label class="form-label">数量</label>
                    <input type="number" name="product_qty_0" class="form-input" min="1" placeholder="例: 10">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ========== SECTION 4: Vehicles (multiple) ========== -->
          <div id="vehicleSection" class="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <div class="flex items-center justify-between mb-6">
              <h3 class="form-section-header text-base sm:text-lg font-bold text-sva-dark">取付対象車両情報</h3>
              <button type="button" onclick="addVehicle()" class="inline-flex items-center gap-1.5 text-xs font-medium text-sva-red hover:text-red-800 transition-colors bg-red-50 px-3 py-1.5 rounded-lg">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                車両を追加
              </button>
            </div>
            <div id="vehicleList">
              <div class="vehicle-entry bg-white rounded-xl border border-gray-200 p-5 mb-4" data-idx="0">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">車両 #1</span>
                </div>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">車両メーカー</label>
                    <input type="text" name="vehicle_maker_0" class="form-input" placeholder="例: コマツ / トヨタL&F">
                  </div>
                  <div>
                    <label class="form-label">車種・型式</label>
                    <input type="text" name="vehicle_model_0" class="form-input" placeholder="例: PC200-10 / 8FBN25">
                  </div>
                  <div>
                    <label class="form-label">車両区分</label>
                    <select name="vehicle_type_0" class="form-select">
                      <option value="">選択してください</option>
                      <option value="フォークリフト">フォークリフト</option>
                      <option value="重機">重機</option>
                      <option value="建機">建機</option>
                      <option value="トラック">トラック</option>
                      <option value="バス">バス</option>
                      <option value="船舶">船舶</option>
                      <option value="農機">農機</option>
                      <option value="その他">その他</option>
                    </select>
                  </div>
                  <div>
                    <label class="form-label">年式 <span class="optional">任意</span></label>
                    <input type="text" name="vehicle_year_0" class="form-input" placeholder="例: 2022年式">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ========== SECTION 5: Installation Sites (multiple) ========== -->
          <div id="siteSection" class="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <div class="flex items-center justify-between mb-6">
              <h3 class="form-section-header text-base sm:text-lg font-bold text-sva-dark">出張施工先情報</h3>
              <button type="button" onclick="addSite()" class="inline-flex items-center gap-1.5 text-xs font-medium text-sva-red hover:text-red-800 transition-colors bg-red-50 px-3 py-1.5 rounded-lg">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                施工先を追加
              </button>
            </div>
            <div id="siteList">
              <div class="site-entry bg-white rounded-xl border border-gray-200 p-5 mb-4" data-idx="0">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">施工先 #1</span>
                </div>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div class="sm:col-span-2">
                    <label class="form-label">施工先住所 <span class="required">※必須</span></label>
                    <input type="text" name="site_address_0" class="form-input" placeholder="例: 愛知県豊田市〇〇町1-2-3 トヨタ工場内">
                  </div>
                  <div>
                    <label class="form-label">施工先会社名・担当者名 <span class="optional">任意</span></label>
                    <input type="text" name="site_contact_0" class="form-input" placeholder="例: 株式会社□□ 田中様">
                  </div>
                  <div>
                    <label class="form-label">施工先電話番号 <span class="optional">任意</span></label>
                    <input type="tel" name="site_phone_0" class="form-input" placeholder="例: 0565-12-3456">
                  </div>
                  <div>
                    <label class="form-label">施工先メール <span class="optional">任意</span></label>
                    <input type="email" name="site_email_0" class="form-input" placeholder="例: tanaka@example.com">
                  </div>
                  <div>
                    <label class="form-label">施工先部署 <span class="optional">任意</span></label>
                    <input type="text" name="site_department_0" class="form-input" placeholder="例: 物流部">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ========== SECTION 6: Budget & Notes ========== -->
          <div id="budgetSection" class="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <h3 class="form-section-header text-base sm:text-lg font-bold text-sva-dark mb-6">その他</h3>
            <div class="space-y-5">
              <div>
                <label class="form-label">希望工賃目安 <span class="optional">任意</span></label>
                <input type="text" name="budget_estimate" class="form-input max-w-md" placeholder="例: 1台あたり15,000円程度を希望">
                <p class="text-xs text-gray-400 mt-1.5">
                  <svg class="w-3 h-3 inline mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  ご希望に沿えない場合がありますが、見積もり時の参考とさせていただきます。
                </p>
              </div>
              <div>
                <label class="form-label">備考・ご要望 <span class="optional">任意</span></label>
                <textarea name="notes" rows="4" class="form-input" placeholder="その他ご要望がございましたらご記入ください。"></textarea>
              </div>
            </div>
          </div>

          <!-- ========== NOTE ========== -->
          <div id="noteSection" class="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <div>
                <p class="text-sm font-medium text-amber-800 mb-1">ご注意事項</p>
                <ul class="text-xs text-amber-700 space-y-1 leading-relaxed">
                  <li>- 製品の構成や車両との適合性により、施工をお受けできない場合があります。その場合はSVAよりご連絡いたします。</li>
                  <li>- 希望工賃はあくまで参考値です。車両・装置・出張先に応じた正式なお見積もりをお送りします。</li>
                  <li>- 施工日程は、パートナーの空き状況とエンドユーザー様のご都合により調整いたします。</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- ========== PRIVACY & SUBMIT ========== -->
          <div class="text-center space-y-5">
            <label class="flex items-center justify-center gap-3 cursor-pointer">
              <input type="checkbox" id="privacyCheck" class="w-4 h-4 rounded accent-[#C41E3A]">
              <span class="text-sm text-gray-600"><a href="/privacy" target="_blank" class="text-sva-red underline hover:text-red-800">プライバシーポリシー</a>に同意する</span>
            </label>
            <button type="submit" id="submitBtn" disabled class="inline-flex items-center justify-center px-12 py-4 bg-sva-red text-white font-bold rounded-xl hover:bg-red-800 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed gap-2 shadow-lg shadow-red-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              取付依頼を送信する
            </button>
            <p class="text-xs text-gray-400">内容確認後、2営業日以内にご連絡いたします。</p>
          </div>
        </form>
      </div>
    </section>

    <!-- ===== CONTACT CTA ===== -->
    <section class="py-12 sm:py-16 bg-sva-light border-t border-gray-100">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p class="text-sm text-gray-500 mb-3">フォーム以外でのお問い合わせ</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/#contact" class="inline-flex items-center justify-center px-8 py-3.5 bg-white border border-gray-200 text-sva-dark font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            お問い合わせフォーム
          </a>
          <a href="tel:06-6152-7511" class="inline-flex items-center justify-center px-8 py-3.5 bg-white border border-gray-200 text-sva-dark font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            電話: 06-6152-7511
          </a>
        </div>
        <p class="text-xs text-gray-400 mt-3">受付時間 9:00〜18:00（土日祝を除く）</p>
      </div>
    </section>
  </main>

  <script>
  (function() {
    // === Disclosure toggle ===
    var discRadios = document.querySelectorAll('input[name="disclosure"]');
    var meetingWrap = document.getElementById('meetingDateWrap');
    var detailSections = ['openSection', 'vehicleSection', 'siteSection', 'budgetSection', 'noteSection'];
    function toggleDetailSections(closed) {
      detailSections.forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;
        if (closed) {
          el.style.opacity = '0.35';
          el.style.pointerEvents = 'none';
          el.querySelectorAll('input, select, textarea').forEach(function(inp) { inp.setAttribute('tabindex', '-1'); });
        } else {
          el.style.opacity = '1';
          el.style.pointerEvents = 'auto';
          el.querySelectorAll('input, select, textarea').forEach(function(inp) { inp.removeAttribute('tabindex'); });
        }
      });
    }
    discRadios.forEach(function(r) {
      r.addEventListener('change', function() {
        var isClosed = this.value === 'closed';
        if (isClosed) {
          meetingWrap.classList.remove('hidden');
        } else {
          meetingWrap.classList.add('hidden');
        }
        toggleDetailSections(isClosed);
      });
    });

    // === Privacy checkbox ===
    var privacyCheck = document.getElementById('privacyCheck');
    var submitBtn = document.getElementById('submitBtn');
    privacyCheck.addEventListener('change', function() {
      submitBtn.disabled = !this.checked;
    });

    // === Product entries ===
    var productCount = 1;
    window.addProduct = function() {
      var idx = productCount++;
      var html = '<div class="product-entry bg-white rounded-xl border border-gray-200 p-5 mb-4" data-idx="' + idx + '">'
        + '<div class="flex items-center justify-between mb-4">'
        + '<span class="text-xs font-bold text-sva-red bg-red-50 px-2 py-0.5 rounded">商品 #' + (idx + 1) + '</span>'
        + '<button type="button" onclick="removeEntry(this, &quot;product&quot;)" class="text-xs text-gray-400 hover:text-red-600 transition-colors">削除</button>'
        + '</div>'
        + '<div class="grid sm:grid-cols-2 gap-4">'
        + '<div class="sm:col-span-2"><label class="form-label">商品名</label><input type="text" name="product_name_' + idx + '" class="form-input" placeholder="商品名を入力"></div>'
        + '<div><label class="form-label">カテゴリ</label><select name="product_category_' + idx + '" class="form-select"><option value="">選択してください</option><option value="ドライブレコーダー">ドライブレコーダー</option><option value="AIカメラ">AIカメラ</option><option value="デジタルタコグラフ">デジタルタコグラフ</option><option value="ETC車載器">ETC車載器</option><option value="バックカメラ">バックカメラ</option><option value="置き去り防止装置">置き去り防止装置</option><option value="建機停止装置">建機停止装置</option><option value="LEDマーカーランプ">LEDマーカーランプ</option><option value="その他">その他</option></select></div>'
        + '<div><label class="form-label">数量</label><input type="number" name="product_qty_' + idx + '" class="form-input" min="1" placeholder="例: 10"></div>'
        + '</div></div>';
      document.getElementById('productList').insertAdjacentHTML('beforeend', html);
    };

    // === Vehicle entries ===
    var vehicleCount = 1;
    window.addVehicle = function() {
      var idx = vehicleCount++;
      var html = '<div class="vehicle-entry bg-white rounded-xl border border-gray-200 p-5 mb-4" data-idx="' + idx + '">'
        + '<div class="flex items-center justify-between mb-4">'
        + '<span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">車両 #' + (idx + 1) + '</span>'
        + '<button type="button" onclick="removeEntry(this, &quot;vehicle&quot;)" class="text-xs text-gray-400 hover:text-red-600 transition-colors">削除</button>'
        + '</div>'
        + '<div class="grid sm:grid-cols-2 gap-4">'
        + '<div><label class="form-label">車両メーカー</label><input type="text" name="vehicle_maker_' + idx + '" class="form-input" placeholder="例: コマツ / トヨタL&F"></div>'
        + '<div><label class="form-label">車種・型式</label><input type="text" name="vehicle_model_' + idx + '" class="form-input" placeholder="例: PC200-10"></div>'
        + '<div><label class="form-label">車両区分</label><select name="vehicle_type_' + idx + '" class="form-select"><option value="">選択してください</option><option value="フォークリフト">フォークリフト</option><option value="重機">重機</option><option value="建機">建機</option><option value="トラック">トラック</option><option value="バス">バス</option><option value="船舶">船舶</option><option value="農機">農機</option><option value="その他">その他</option></select></div>'
        + '<div><label class="form-label">年式</label><input type="text" name="vehicle_year_' + idx + '" class="form-input" placeholder="例: 2022年式"></div>'
        + '</div></div>';
      document.getElementById('vehicleList').insertAdjacentHTML('beforeend', html);
    };

    // === Site entries ===
    var siteCount = 1;
    window.addSite = function() {
      var idx = siteCount++;
      var html = '<div class="site-entry bg-white rounded-xl border border-gray-200 p-5 mb-4" data-idx="' + idx + '">'
        + '<div class="flex items-center justify-between mb-4">'
        + '<span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">施工先 #' + (idx + 1) + '</span>'
        + '<button type="button" onclick="removeEntry(this, &quot;site&quot;)" class="text-xs text-gray-400 hover:text-red-600 transition-colors">削除</button>'
        + '</div>'
        + '<div class="grid sm:grid-cols-2 gap-4">'
        + '<div class="sm:col-span-2"><label class="form-label">施工先住所</label><input type="text" name="site_address_' + idx + '" class="form-input" placeholder="施工先の住所を入力"></div>'
        + '<div><label class="form-label">施工先会社名・担当者名</label><input type="text" name="site_contact_' + idx + '" class="form-input" placeholder="例: 株式会社□□ 田中様"></div>'
        + '<div><label class="form-label">施工先電話番号</label><input type="tel" name="site_phone_' + idx + '" class="form-input" placeholder="例: 0565-12-3456"></div>'
        + '<div><label class="form-label">施工先メール</label><input type="email" name="site_email_' + idx + '" class="form-input" placeholder="例: tanaka@example.com"></div>'
        + '<div><label class="form-label">施工先部署</label><input type="text" name="site_department_' + idx + '" class="form-input" placeholder="例: 物流部"></div>'
        + '</div></div>';
      document.getElementById('siteList').insertAdjacentHTML('beforeend', html);
    };

    // === Remove entry ===
    window.removeEntry = function(btn, type) {
      var entry = btn.closest('.' + type + '-entry');
      if (entry) entry.remove();
    };

    // === Collect multi-entries ===
    function collectEntries(prefix, fields) {
      var container = document.getElementById(prefix + 'List');
      var entries = container.querySelectorAll('.' + prefix + '-entry');
      var result = [];
      entries.forEach(function(entry) {
        var idx = entry.getAttribute('data-idx');
        var item = {};
        var hasData = false;
        fields.forEach(function(f) {
          var el = entry.querySelector('[name="' + prefix + '_' + f + '_' + idx + '"]');
          item[f] = el ? el.value.trim() : '';
          if (item[f]) hasData = true;
        });
        if (hasData) result.push(item);
      });
      return result;
    }

    // === Form submit ===
    var form = document.getElementById('requestFormEl');
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var errorEl = document.getElementById('requestError');
      var errorMsg = document.getElementById('requestErrorMsg');
      var successEl = document.getElementById('requestSuccess');
      errorEl.classList.add('hidden');
      successEl.classList.add('hidden');

      // Collect data
      var fd = new FormData(form);
      var isClosed = fd.get('disclosure') === 'closed';
      var data = {
        company_name: fd.get('company_name') || '',
        department: fd.get('department') || '',
        contact_person: fd.get('contact_person') || '',
        company_address: fd.get('company_address') || '',
        phone: fd.get('phone') || '',
        email: fd.get('email') || '',
        disclosure: fd.get('disclosure') || 'open',
        meeting_date: fd.get('meeting_date') || '',
        products: isClosed ? [] : collectEntries('product', ['name', 'category', 'qty']),
        vehicles: isClosed ? [] : collectEntries('vehicle', ['maker', 'model', 'type', 'year']),
        sites: isClosed ? [] : collectEntries('site', ['address', 'contact', 'phone', 'email', 'department']),
        budget_estimate: isClosed ? '' : (fd.get('budget_estimate') || ''),
        notes: isClosed ? '' : (fd.get('notes') || '')
      };

      // Basic validation
      if (!data.company_name || !data.contact_person || !data.company_address || !data.phone || !data.email) {
        errorMsg.textContent = '必須項目をすべてご入力ください。';
        errorEl.classList.remove('hidden');
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Submit
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中...';

      fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function(r) { return r.json(); })
      .then(function(res) {
        if (res.success) {
          form.reset();
          form.classList.add('hidden');
          successEl.classList.remove('hidden');
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          errorMsg.textContent = res.error || '送信に失敗しました。時間をおいてお試しください。';
          errorEl.classList.remove('hidden');
          errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg> 取付依頼を送信する';
        }
      })
      .catch(function() {
        errorMsg.textContent = '通信エラーが発生しました。時間をおいてお試しください。';
        errorEl.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg> 取付依頼を送信する';
      });
    });
  })();
  </script>
  ` + siteFooter()
}


// === Helper: Challenge card ===
function renderChallenge(num: string, title: string, desc: string): string {
  return `
    <div class="bg-white rounded-xl border border-gray-100 p-6 card-hover">
      <div class="flex items-start gap-3">
        <span class="shrink-0 w-8 h-8 bg-sva-dark text-white text-xs font-bold rounded-lg flex items-center justify-center">${num}</span>
        <div>
          <h3 class="font-bold text-sva-dark text-sm mb-2">${title}</h3>
          <p class="text-xs text-gray-500 leading-relaxed">${desc}</p>
        </div>
      </div>
    </div>`
}

// === Helper: Flow step card ===
function renderFlowStep(step: number, title: string, desc: string, iconPath: string, hasConnector: boolean): string {
  return `
    <div class="relative">
      <div class="bg-white rounded-xl border border-gray-100 p-6 text-center h-full">
        <div class="w-12 h-12 bg-sva-red/10 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-sva-red" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="${iconPath}"/></svg>
        </div>
        <div class="text-xs text-sva-red font-bold mb-1">STEP ${step}</div>
        <h3 class="font-bold text-sva-dark text-sm mb-2">${title}</h3>
        <p class="text-xs text-gray-500 leading-relaxed">${desc}</p>
      </div>
      ${hasConnector ? '<div class="flow-connector"></div>' : ''}
    </div>`
}

// === Helper: Advantage card ===
function renderAdvantage(iconPath: string, title: string, desc: string): string {
  return `
    <div class="bg-sva-light rounded-xl p-6 card-hover">
      <div class="w-10 h-10 bg-sva-red/10 rounded-lg flex items-center justify-center mb-4">
        <svg class="w-5 h-5 text-sva-red" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="${iconPath}"/></svg>
      </div>
      <h3 class="font-bold text-sva-dark text-sm mb-2">${title}</h3>
      <p class="text-xs text-gray-500 leading-relaxed">${desc}</p>
    </div>`
}
