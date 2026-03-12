import { siteHead, siteHeader, siteFooter } from './layout'

// ==========================================
// プライバシーポリシー
// ==========================================
export function privacyPage(): string {
  const breadcrumb = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://sva-assist.com/" },
      { "@type": "ListItem", "position": 2, "name": "プライバシーポリシー", "item": "https://sva-assist.com/privacy" }
    ]
  })

  return siteHead(
    'プライバシーポリシー | SVA - Special Vehicle Assist',
    'SVA（Special Vehicle Assist）のプライバシーポリシーです。個人情報の取り扱い、利用目的、第三者提供、安全管理措置について定めています。',
    '/privacy',
    `<script type="application/ld+json">${breadcrumb}</script>`
  ) + siteHeader() + `
  <main class="min-h-screen bg-gray-50">
    <!-- パンくず -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-3">
        <nav class="flex items-center gap-2 text-xs text-gray-500">
          <a href="/" class="hover:text-sva-red transition-colors">ホーム</a>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span class="text-gray-800 font-medium">プライバシーポリシー</span>
        </nav>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <!-- ヘッダー -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 mb-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-sva-red/10 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-sva-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-sva-dark">プライバシーポリシー</h1>
        </div>
        <p class="text-gray-500 text-sm">最終更新日：2025年3月1日</p>
      </div>

      <!-- 本文 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 space-y-10">
        <p class="text-gray-600 leading-relaxed">株式会社TCIサービス（以下「当社」といいます。）は、SVA - Special Vehicle Assist（以下「本サービス」といいます。）において、お客様の個人情報の保護を重要な責務と考え、以下のとおりプライバシーポリシーを定めます。</p>

        ${legalSection('1', '個人情報の定義', `
          <p>本ポリシーにおいて「個人情報」とは、個人情報の保護に関する法律（以下「個人情報保護法」）に定める個人情報を指し、生存する個人に関する情報であって、氏名、住所、電話番号、メールアドレスその他の記述等により特定の個人を識別できるもの、および個人識別符号が含まれるものをいいます。</p>
        `)}

        ${legalSection('2', '個人情報の収集方法', `
          <p>当社は、以下の場合に個人情報を収集することがあります。</p>
          <ul>
            <li>お問い合わせフォームからのご連絡時</li>
            <li>見積もり・施工のご依頼時</li>
            <li>公認パートナーへのご登録時</li>
            <li>コラム記事へのご意見・ご感想の投稿時</li>
            <li>その他当社サービスのご利用時</li>
          </ul>
        `)}

        ${legalSection('3', '個人情報の利用目的', `
          <p>当社は、収集した個人情報を以下の目的で利用いたします。</p>
          <div class="grid sm:grid-cols-2 gap-3">
            ${purposeCard('サービスの提供・運営', '装置取付の見積もり・施工手配、パートナーマッチング等')}
            ${purposeCard('お問い合わせ対応', 'ご質問・ご相談への回答、アフターサポート')}
            ${purposeCard('公認パートナー管理', '登録情報の管理、案件の通知・連絡')}
            ${purposeCard('サービスの改善', '利用状況の分析、新機能開発、品質向上')}
            ${purposeCard('お知らせの配信', '重要な変更通知、メンテナンス情報')}
            ${purposeCard('法令遵守', '法令に基づく対応、紛争解決')}
          </div>
        `)}

        ${legalSection('4', '個人情報の第三者提供', `
          <p>当社は、以下の場合を除き、あらかじめお客様の同意を得ることなく、第三者に個人情報を提供いたしません。</p>
          <ul>
            <li>法令に基づく場合</li>
            <li>人の生命、身体または財産の保護のために必要がある場合</li>
            <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
            <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
            <li>施工パートナーへの案件情報共有（お客様の同意に基づく）</li>
          </ul>
        `)}

        ${legalSection('5', '個人情報の安全管理', `
          <p>当社は、個人情報の漏えい、滅失またはき損を防止するため、以下の安全管理措置を講じます。</p>
          <div class="grid sm:grid-cols-2 gap-3">
            ${measureCard('🔐', '技術的対策', 'SSL/TLS通信暗号化、アクセス制御、ファイアウォール')}
            ${measureCard('🏢', '組織的対策', '個人情報管理責任者の設置、取扱規程の策定')}
            ${measureCard('👤', '人的対策', '従業者への教育・啓発、秘密保持義務')}
            ${measureCard('🏠', '物理的対策', '入退室管理、機器の盗難防止措置')}
          </div>
        `)}

        ${legalSection('6', '個人情報の開示・訂正・削除', `
          <p>お客様は、当社に対してご自身の個人情報の開示、訂正、追加、削除、利用停止を請求することができます。ご本人様確認のうえ、合理的な期間内に対応いたします。</p>
          <p>請求先については、下記お問い合わせ窓口までご連絡ください。</p>
        `)}

        ${legalSection('7', 'Cookieの使用について', `
          <p>本サービスでは、サービスの利便性向上およびアクセス状況の分析のため、Cookieを使用する場合があります。Cookieの使用を希望されない場合は、ブラウザの設定により無効にすることが可能ですが、一部サービスがご利用いただけなくなる場合があります。</p>
          <div class="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
            <p class="font-medium mb-1">使用するCookie</p>
            <ul class="text-blue-700 space-y-1">
              <li>・Cloudflare Analytics（アクセス解析）</li>
              <li>・セッション管理用Cookie</li>
            </ul>
          </div>
        `)}

        ${legalSection('8', 'プライバシーポリシーの変更', `
          <p>当社は、必要に応じて本ポリシーを変更することがあります。変更後のプライバシーポリシーは、本ページに掲載した時点から効力を生じるものとします。重要な変更がある場合は、本サービス上で適切な方法によりお知らせいたします。</p>
        `)}

        ${contactSection()}
      </div>
    </div>
  </main>
  ` + siteFooter()
}

// ==========================================
// 利用規約
// ==========================================
export function termsPage(): string {
  const breadcrumb = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://sva-assist.com/" },
      { "@type": "ListItem", "position": 2, "name": "利用規約", "item": "https://sva-assist.com/terms" }
    ]
  })

  return siteHead(
    '利用規約 | SVA - Special Vehicle Assist',
    'SVA（Special Vehicle Assist）のサービス利用規約です。ご利用前に必ずお読みください。',
    '/terms',
    `<script type="application/ld+json">${breadcrumb}</script>`
  ) + siteHeader() + `
  <main class="min-h-screen bg-gray-50">
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-3">
        <nav class="flex items-center gap-2 text-xs text-gray-500">
          <a href="/" class="hover:text-sva-red transition-colors">ホーム</a>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span class="text-gray-800 font-medium">利用規約</span>
        </nav>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 mb-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-sva-red/10 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-sva-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-sva-dark">利用規約</h1>
        </div>
        <p class="text-gray-500 text-sm">最終更新日：2025年3月1日</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 space-y-10">
        <p class="text-gray-600 leading-relaxed">この利用規約（以下「本規約」といいます。）は、株式会社TCIサービス（以下「当社」といいます。）が提供するSVA - Special Vehicle Assist（以下「本サービス」といいます。）の利用条件を定めるものです。ご利用にあたっては、本規約に同意いただく必要があります。</p>

        ${legalSection('1', '適用', `
          <p>本規約は、本サービスの利用に関わる一切の関係に適用されます。当社が別途定める個別の規定やガイダンスは、本規約の一部を構成するものとします。</p>
        `)}

        ${legalSection('2', 'サービスの内容', `
          <p>本サービスは、以下の機能を提供するB2Bプラットフォームです。</p>
          <div class="grid sm:grid-cols-2 gap-3">
            ${purposeCard('装置取付マッチング', 'お客様の車両に最適な装置・パートナーをご案内')}
            ${purposeCard('見積もり・施工手配', '全国の公認パートナーによる出張施工')}
            ${purposeCard('コラム情報の提供', '特殊車両の安全対策に関する専門情報')}
            ${purposeCard('パートナー支援', '公認パートナープログラムの運営・管理')}
          </div>
        `)}

        ${legalSection('3', 'ユーザーの責任', `
          <ul>
            <li>本サービスの利用にあたり、正確な情報を提供すること</li>
            <li>登録情報に変更があった場合、速やかに更新すること</li>
            <li>アカウント情報の管理を適切に行うこと</li>
            <li>法令および本規約を遵守すること</li>
          </ul>
        `)}

        ${legalSection('4', '禁止事項', `
          <p>本サービスの利用にあたり、以下の行為を禁止します。</p>
          <div class="bg-red-50 rounded-xl p-5 space-y-2">
            ${prohibitedItem('法令または公序良俗に違反する行為')}
            ${prohibitedItem('犯罪行為に関連する行為')}
            ${prohibitedItem('当社のサーバーまたはネットワークの機能を破壊・妨害する行為')}
            ${prohibitedItem('サービスの運営を妨害するおそれのある行為')}
            ${prohibitedItem('他のユーザーに関する個人情報等の収集・蓄積行為')}
            ${prohibitedItem('不正アクセスまたはこれを試みる行為')}
            ${prohibitedItem('他のユーザーになりすます行為')}
            ${prohibitedItem('当社のサービスに関連して反社会的勢力に利益を供与する行為')}
            ${prohibitedItem('その他当社が不適切と判断する行為')}
          </div>
        `)}

        ${legalSection('5', '知的財産権', `
          <p>本サービスに関する知的財産権は、すべて当社または当社にライセンスを許諾している者に帰属します。本規約に基づく本サービスの利用許諾は、知的財産権の使用許諾を意味するものではありません。</p>
        `)}

        ${legalSection('6', 'サービスの変更・中断・終了', `
          <p>当社は、以下の場合にサービスの全部または一部を変更、中断、または終了することがあります。</p>
          <ul>
            <li>システムの保守・点検・更新を行う場合</li>
            <li>地震、落雷、火災、停電等の不可抗力により提供が困難な場合</li>
            <li>その他当社がやむを得ないと判断した場合</li>
          </ul>
          <p>これによりユーザーに生じた不利益・損害について、当社は一切の責任を負わないものとします。</p>
        `)}

        ${legalSection('7', '免責事項', `
          <div class="bg-amber-50 rounded-xl p-5 space-y-3">
            <p class="text-amber-900 text-sm leading-relaxed">当社は、本サービスに事実上または法律上の瑕疵がないこと（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性等）を明示的にも黙示的にも保証いたしません。</p>
            <p class="text-amber-900 text-sm leading-relaxed">施工の品質については、担当する公認パートナーが責任を負うものとし、当社はプラットフォーム提供者としての合理的な管理監督義務を負います。</p>
          </div>
        `)}

        ${legalSection('8', '損害賠償', `
          <p>当社の責めに帰すべき事由により、ユーザーに損害が生じた場合、当社は当該サービスについてユーザーが支払った対価の額を上限として賠償責任を負うものとします。ただし、当社の故意または重大な過失による場合はこの限りではありません。</p>
        `)}

        ${legalSection('9', '規約の変更', `
          <p>当社は、必要に応じて本規約を変更できるものとします。変更後の規約は、本ページに掲載した時点から効力を生じるものとします。重要な変更がある場合は、合理的な方法で事前に通知いたします。</p>
        `)}

        ${legalSection('10', '準拠法・管轄裁判所', `
          <p>本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、大阪地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
        `)}

        ${contactSection()}
      </div>
    </div>
  </main>
  ` + siteFooter()
}

// ==========================================
// 特定商取引法に基づく表記
// ==========================================
export function tokushohoPage(): string {
  const breadcrumb = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://sva-assist.com/" },
      { "@type": "ListItem", "position": 2, "name": "特定商取引法に基づく表記", "item": "https://sva-assist.com/tokushoho" }
    ]
  })

  return siteHead(
    '特定商取引法に基づく表記 | SVA - Special Vehicle Assist',
    'SVA（Special Vehicle Assist）の特定商取引法に基づく表記です。事業者情報、サービス内容、支払い方法等をご確認いただけます。',
    '/tokushoho',
    `<script type="application/ld+json">${breadcrumb}</script>`
  ) + siteHeader() + `
  <main class="min-h-screen bg-gray-50">
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-3">
        <nav class="flex items-center gap-2 text-xs text-gray-500">
          <a href="/" class="hover:text-sva-red transition-colors">ホーム</a>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span class="text-gray-800 font-medium">特定商取引法に基づく表記</span>
        </nav>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 mb-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-sva-red/10 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-sva-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-sva-dark">特定商取引法に基づく表記</h1>
        </div>
        <p class="text-gray-500 text-sm">最終更新日：2025年3月1日</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12">
        <div class="overflow-hidden rounded-xl border border-gray-200">
          <table class="w-full text-sm">
            ${tokushohoRow('事業者名', '株式会社TCIサービス', false)}
            ${tokushohoRow('代表者名', '代表取締役 謝花 祐治', true)}
            ${tokushohoRow('所在地', '〒532-0033<br>大阪府大阪市淀川区新高1丁目5-4 3階', false)}
            ${tokushohoRow('電話番号', '<a href="tel:06-6152-7511" class="text-sva-red hover:underline">06-6152-7511</a><br><span class="text-xs text-gray-500">受付時間：平日 9:00〜18:00</span>', true)}
            ${tokushohoRow('メールアドレス', 'info@tci-service.co.jp', false)}
            ${tokushohoRow('URL', '<a href="https://sva-assist.com" class="text-sva-red hover:underline">https://sva-assist.com</a>', true)}
            ${tokushohoRow('サービス名称', 'SVA - Special Vehicle Assist<br>（特殊車両専門 装置取付プラットフォーム）', false)}
            ${tokushohoRow('サービス内容', '特殊車両（フォークリフト、重機、建機、トラック、バス、農業機械、船舶等）へのドライブレコーダー、AIカメラ、デジタルタコグラフ等の安全装置の取付マッチングおよび施工手配サービス', true)}
            ${tokushohoRow('料金', '個別見積もり制<br><span class="text-xs text-gray-500">車種・装置・台数・施工場所等により異なります。<br>お見積もりは無料です。</span>', false)}
            ${tokushohoRow('料金以外の必要経費', '出張施工の場合、距離・エリアに応じた出張費が別途発生する場合があります。<br>事前にお見積書にてご案内いたします。', true)}
            ${tokushohoRow('お支払い方法', '<div class="flex flex-wrap gap-2 mt-1">' +
              paymentBadge('銀行振込') + paymentBadge('請求書払い') + paymentBadge('クレジットカード') +
              '</div><span class="text-xs text-gray-500 mt-2 block">※法人のお客様は請求書払い（月末締め翌月末払い）も対応</span>', false)}
            ${tokushohoRow('お支払い時期', '施工完了後、請求書発行日から30日以内', true)}
            ${tokushohoRow('サービス提供時期', 'ご注文確認後、日程調整のうえ施工日を決定いたします。<br>通常、ご発注から1〜4週間以内に施工いたします。', false)}
            ${tokushohoRow('キャンセル・返品', '<ul class="space-y-1 text-xs text-gray-600">' +
              '<li>・施工3営業日前まで：無料キャンセル可</li>' +
              '<li>・施工2営業日前〜前日：施工費の30%のキャンセル料</li>' +
              '<li>・施工当日：施工費の100%のキャンセル料</li>' +
              '<li>・施工完了後の返品：装置の不具合を除き、原則不可</li>' +
              '</ul>', true)}
            ${tokushohoRow('保証・アフターサービス', '施工完了後1年間の施工保証<br>装置本体の保証はメーカー保証に準じます', false)}
          </table>
        </div>

        <div class="mt-8 p-5 bg-gray-50 rounded-xl">
          <p class="text-xs text-gray-500 leading-relaxed">
            ※ 上記は一般的なサービス条件を記載しています。個別の案件については、お見積書および契約書の内容が優先されます。<br>
            ※ 表示価格はすべて税抜きです。別途消費税がかかります。<br>
            ※ ご不明な点がございましたら、お気軽にお問い合わせください。
          </p>
        </div>

        <div class="mt-8">
          ${contactSection()}
        </div>
      </div>
    </div>
  </main>
  ` + siteFooter()
}

// ==========================================
// サイトマップ（HTML版）
// ==========================================
export function sitemapHtmlPage(articles: { slug: string; title: string; category: string }[] = []): string {
  const breadcrumb = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://sva-assist.com/" },
      { "@type": "ListItem", "position": 2, "name": "サイトマップ", "item": "https://sva-assist.com/sitemap" }
    ]
  })

  const categoryMap: Record<string, string> = {
    'safety': '安全対策', 'technology': 'テクノロジー', 'regulation': '法規制',
    'installation': '取付ガイド', 'case-study': '導入事例', 'general': 'その他'
  }

  const articleList = articles.length > 0
    ? articles.map(a => `
        <li class="flex items-center gap-2">
          <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">${categoryMap[a.category] || a.category}</span>
          <a href="/column/${a.slug}" class="text-sva-accent hover:text-sva-red hover:underline transition-colors">${escapeHtml(a.title)}</a>
        </li>
      `).join('')
    : '<li class="text-gray-400">記事はまだありません</li>'

  return siteHead(
    'サイトマップ | SVA - Special Vehicle Assist',
    'SVA（Special Vehicle Assist）の全ページ一覧です。お探しの情報にすぐにアクセスできます。',
    '/sitemap',
    `<script type="application/ld+json">${breadcrumb}</script>`
  ) + siteHeader() + `
  <main class="min-h-screen bg-gray-50">
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-3">
        <nav class="flex items-center gap-2 text-xs text-gray-500">
          <a href="/" class="hover:text-sva-red transition-colors">ホーム</a>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span class="text-gray-800 font-medium">サイトマップ</span>
        </nav>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 mb-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-sva-red/10 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-sva-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-sva-dark">サイトマップ</h1>
        </div>
        <p class="text-gray-500 text-sm">SVA - Special Vehicle Assist の全ページ一覧です</p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- メインページ -->
        ${sitemapCard('🏠', 'メインページ', [
          { url: '/', label: 'トップページ' },
          { url: '/column', label: 'コラム一覧' },
          { url: '/#service', label: 'サービス紹介' },
          { url: '/#vehicles', label: '対応車両カテゴリ' },
          { url: '/#devices', label: '取付対応装置' },
          { url: '/#partner', label: '公認パートナー募集' },
          { url: '/#faq', label: 'よくあるご質問' },
          { url: '/#contact', label: 'お問い合わせ' },
        ])}

        <!-- パートナー -->
        ${sitemapCard('🤝', 'パートナー', [
          { url: '/partner/login', label: 'パートナーログイン' },
          { url: '/partner/mypage', label: 'パートナーマイページ' },
        ])}

        <!-- 法的ページ -->
        ${sitemapCard('📋', '法的情報・ポリシー', [
          { url: '/privacy', label: 'プライバシーポリシー' },
          { url: '/terms', label: '利用規約' },
          { url: '/tokushoho', label: '特定商取引法に基づく表記' },
          { url: '/sitemap', label: 'サイトマップ（このページ）' },
        ])}

        <!-- SEO / LLMO -->
        ${sitemapCard('🤖', 'AI・検索エンジン向け', [
          { url: '/robots.txt', label: 'robots.txt' },
          { url: '/sitemap.xml', label: 'sitemap.xml（XML版）' },
          { url: '/llms.txt', label: 'llms.txt（AI要約）' },
          { url: '/llms-full.txt', label: 'llms-full.txt（AI詳細）' },
          { url: '/ai.txt', label: 'ai.txt（AIポリシー）' },
        ])}
      </div>

      <!-- コラム記事一覧 -->
      <div class="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-lg">📰</div>
          <h2 class="text-lg font-bold text-sva-dark">コラム記事</h2>
          <span class="text-xs text-gray-400 ml-auto">${articles.length} 件</span>
        </div>
        <ul class="space-y-3 text-sm">
          ${articleList}
        </ul>
      </div>
    </div>
  </main>
  ` + siteFooter()
}


// ==========================================
// Helper Functions
// ==========================================

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function legalSection(num: string, title: string, content: string): string {
  return `
    <section>
      <div class="flex items-start gap-3 mb-4">
        <span class="flex-shrink-0 w-8 h-8 bg-sva-red text-white rounded-lg flex items-center justify-center text-sm font-bold">${num}</span>
        <h2 class="text-lg font-bold text-sva-dark pt-0.5">${title}</h2>
      </div>
      <div class="pl-11 text-sm text-gray-600 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:leading-relaxed">
        ${content}
      </div>
    </section>
  `
}

function purposeCard(title: string, desc: string): string {
  return `
    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
      <p class="font-medium text-sm text-sva-dark mb-1">${title}</p>
      <p class="text-xs text-gray-500">${desc}</p>
    </div>
  `
}

function measureCard(emoji: string, title: string, desc: string): string {
  return `
    <div class="bg-green-50 rounded-lg p-3 border border-green-100">
      <p class="font-medium text-sm text-green-900 mb-1">${emoji} ${title}</p>
      <p class="text-xs text-green-700">${desc}</p>
    </div>
  `
}

function prohibitedItem(text: string): string {
  return `
    <div class="flex items-start gap-2">
      <svg class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      <span class="text-sm text-red-800">${text}</span>
    </div>
  `
}

function tokushohoRow(label: string, value: string, alt: boolean): string {
  const bg = alt ? 'bg-gray-50' : 'bg-white'
  return `
    <tr class="${bg}">
      <th class="px-5 py-4 text-left text-sm font-medium text-sva-dark whitespace-nowrap align-top border-b border-gray-100 w-40">${label}</th>
      <td class="px-5 py-4 text-sm text-gray-600 border-b border-gray-100 leading-relaxed">${value}</td>
    </tr>
  `
}

function paymentBadge(text: string): string {
  return `<span class="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">${text}</span>`
}

function contactSection(): string {
  return `
    <div class="border-t border-gray-100 pt-8 mt-8">
      <div class="bg-gradient-to-r from-sva-dark to-gray-800 rounded-xl p-6 text-white">
        <h3 class="font-bold mb-3">お問い合わせ窓口</h3>
        <div class="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-gray-300 text-xs mb-1">事業者名</p>
            <p>株式会社TCIサービス</p>
          </div>
          <div>
            <p class="text-gray-300 text-xs mb-1">所在地</p>
            <p>大阪府大阪市淀川区新高1丁目5-4 3階</p>
          </div>
          <div>
            <p class="text-gray-300 text-xs mb-1">電話番号</p>
            <p><a href="tel:06-6152-7511" class="hover:text-sva-red transition-colors">06-6152-7511</a></p>
          </div>
          <div>
            <p class="text-gray-300 text-xs mb-1">受付時間</p>
            <p>平日 9:00〜18:00</p>
          </div>
        </div>
      </div>
    </div>
  `
}

function sitemapCard(emoji: string, title: string, items: { url: string; label: string }[]): string {
  return `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-lg">${emoji}</div>
        <h2 class="text-lg font-bold text-sva-dark">${title}</h2>
      </div>
      <ul class="space-y-2.5">
        ${items.map(item => `
          <li class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-sva-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            <a href="${item.url}" class="text-sm text-sva-accent hover:text-sva-red hover:underline transition-colors">${item.label}</a>
          </li>
        `).join('')}
      </ul>
    </div>
  `
}
