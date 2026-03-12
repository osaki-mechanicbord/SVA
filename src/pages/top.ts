interface LatestArticle {
  slug: string; title: string; excerpt: string;
  category: string; thumbnail_url: string; author: string; published_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  'safety': '安全対策', 'technology': 'テクノロジー', 'regulation': '法規制',
  'installation': '取付ガイド', 'case-study': '導入事例', 'general': 'その他'
}

const CATEGORY_COLORS: Record<string, string> = {
  'safety': 'bg-red-50 text-red-700', 'technology': 'bg-blue-50 text-blue-700',
  'regulation': 'bg-amber-50 text-amber-700', 'installation': 'bg-green-50 text-green-700',
  'case-study': 'bg-purple-50 text-purple-700', 'general': 'bg-gray-100 text-gray-600'
}

function escapeForHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function fmtDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`
}

export function topPage(latestArticles: LatestArticle[] = []): string {
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": "https://sva-assist.com/#organization",
        "name": "株式会社TCIサービス",
        "alternateName": ["TCI Service Co., Ltd.", "SVA", "Special Vehicle Assist"],
        "url": "https://sva-assist.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://sva-assist.com/static/images/sva-logo.png",
          "width": 600,
          "height": 200
        },
        "image": "https://sva-assist.com/static/images/sva-logo.png",
        "description": "特殊車両専門の装置取付プラットフォーム「SVA（Special Vehicle Assist）」を運営。フォークリフト・重機・建機・トラック・バスなど乗用車以外のすべての車両にドライブレコーダー・AIカメラ等の特殊装置を全国出張取付。",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "新高1丁目5-4 3階",
          "addressLocality": "大阪市淀川区",
          "addressRegion": "大阪府",
          "postalCode": "532-0033",
          "addressCountry": "JP"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 34.7399,
          "longitude": 135.4837
        },
        "telephone": "+81-6-6152-7511",
        "email": "info@tci-service.co.jp",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        },
        "priceRange": "$$",
        "areaServed": {
          "@type": "Country",
          "name": "Japan",
          "alternateName": "日本"
        },
        "serviceType": ["特殊車両装置取付", "ドライブレコーダー取付", "AIカメラ取付", "デジタルタコグラフ取付", "出張施工"],
        "knowsAbout": ["特殊車両", "フォークリフト", "重機", "建機", "トラック", "バス", "ドライブレコーダー", "AIカメラ", "人検知カメラ", "デジタルタコグラフ", "置き去り防止装置", "ETC車載器"],
        "slogan": "特殊車両の装置取付を、全国どこでも。",
        "foundingDate": "2024",
        "founder": {
          "@type": "Person",
          "name": "謝花 祐治"
        },
        "sameAs": [
          "https://www.torasapo-kun.com/"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://sva-assist.com/#website",
        "name": "SVA - Special Vehicle Assist",
        "alternateName": "SVA 特殊車両装置取付プラットフォーム",
        "url": "https://sva-assist.com",
        "publisher": { "@id": "https://sva-assist.com/#organization" },
        "description": "日本初・特殊車両専門の装置取付B2Bプラットフォーム。全国47都道府県の公認パートナーが出張対応。",
        "inLanguage": "ja",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://sva-assist.com/column?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://sva-assist.com/",
        "url": "https://sva-assist.com/",
        "name": "SVA - Special Vehicle Assist | 特殊車両専門の装置取付プラットフォーム",
        "description": "フォークリフト・重機・建機・トラック・バスなど特殊車両にドライブレコーダー・AIカメラ等を全国出張取付するB2Bプラットフォーム。公認パートナーも募集中。",
        "isPartOf": { "@id": "https://sva-assist.com/#website" },
        "about": { "@id": "https://sva-assist.com/#organization" },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": [".hero-gradient h1", ".hero-gradient p", "#service h2", "#service h3", "#faq"]
        }
      },
      {
        "@type": "Service",
        "@id": "https://sva-assist.com/#service",
        "name": "SVA 特殊車両装置取付サービス",
        "provider": { "@id": "https://sva-assist.com/#organization" },
        "serviceType": "特殊車両への装置出張取付",
        "areaServed": { "@type": "Country", "name": "Japan" },
        "description": "フォークリフト・重機・建機・トラック・バス・農機・船舶など、乗用車以外のすべての車両にドライブレコーダー、AIカメラ、デジタルタコグラフ等の安全装置を全国出張で取り付けるB2Bプラットフォームです。",
        "audience": {
          "@type": "BusinessAudience",
          "audienceType": "法人のお客様",
          "numberOfEmployees": {
            "@type": "QuantitativeValue",
            "minValue": 1
          }
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "取付対応装置一覧",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "ドライブレコーダー取付", "description": "各種車両対応の業務用ドライブレコーダーの出張取付" }},
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "フォークリフト用人検知AIカメラ取付", "description": "AI画像認識による作業員検知・事故防止カメラの取付" }},
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "重機専用人検知AIカメラ取付", "description": "重機周辺の作業員を自動検知する360度AIカメラの取付" }},
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "デジタルタコグラフ取付", "description": "運行記録の法定義務対応デジタコの取付" }},
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "建機停止装置AIカメラ取付", "description": "AI検知で建機を自動停止させる安全装置の取付" }},
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SOS-0006置き去り防止装置取付", "description": "送迎バスの安全対策義務化対応・国土交通省認定装置の取付" }},
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "クラウド型ドライブレコーダー取付", "description": "リアルタイム映像確認・遠隔管理対応クラウドドラレコの取付" }},
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "ETC車載器取付", "description": "大型車・特殊車両用ETC車載器の取付" }},
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "船舶用ドライブレコーダー取付", "description": "防水・耐振動仕様の船舶専用ドラレコの取付" }},
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "バックカメラ取付", "description": "ダブル連結トラック等の後方確認用カメラの取付" }},
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "LEDマーカーランプ取付", "description": "トラック用LEDマーカーランプの取付・視認性向上" }}
          ]
        },
        "termsOfService": "https://sva-assist.com/terms"
      },
      {
        "@type": "HowTo",
        "@id": "https://sva-assist.com/#howto",
        "name": "特殊車両への装置取付ご依頼の流れ",
        "description": "SVAで特殊車両への装置取付を依頼する手順（お問い合わせから施工完了まで）",
        "totalTime": "P7D",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "お問い合わせ・ご相談",
            "text": "車両の種類、台数、取り付けたい装置、作業場所をお知らせください。お電話（06-6152-7511）またはWebフォームから受け付けています。",
            "url": "https://sva-assist.com/#contact"
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "お見積もり・ご提案",
            "text": "車両情報をもとに、最適な装置と施工プランをご提案。取付工賃・出張費用・部材費用を明確にお伝えします。追加請求はありません。"
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "日程調整・パートナー手配",
            "text": "施工日程を調整し、お客様のエリアの公認パートナー（審査済み電装技術者）を手配いたします。"
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "出張施工・完了報告",
            "text": "公認パートナーがお客様の現場に出張し施工。作業完了後、動作確認と完了報告をお送りします。"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://sva-assist.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "SVAとはどのようなサービスですか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SVA（Special Vehicle Assist）は、フォークリフト・重機・建機・トラック・バスなど乗用車以外の特殊車両に、ドライブレコーダーやAIカメラ等の安全装置を全国出張で取り付ける日本初のB2B特化型プラットフォームです。全国の公認パートナー（電装店・フリーランス技術者）がお客様の現場に出張して施工します。"
            }
          },
          {
            "@type": "Question",
            "name": "対応している車両の種類は？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "フォークリフト、重機（ショベルカー・クレーン等）、建機、トラック（大型・中型・小型）、バス（路線・観光・送迎）、農機、船舶、その他特殊車両に対応しています。乗用車以外のすべての車両が対象です。"
            }
          },
          {
            "@type": "Question",
            "name": "どのような装置を取り付けできますか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "ドライブレコーダー、ETC、フォークリフト用人検知AIカメラ、デジタルタコグラフ、重機専用人検知AIカメラ、建機停止装置AIカメラ、SOS-0006置き去り防止装置、ダブル連結トラック用バックカメラ、船舶用ドライブレコーダー、クラウド型ドライブレコーダー、LEDマーカーランプなど幅広く対応しています。"
            }
          },
          {
            "@type": "Question",
            "name": "全国対応していますか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "はい、全国47都道府県に対応しています。各地域に公認パートナー（電装店・フリーランス技術者）が在籍しており、お客様の現場まで出張して施工いたします。"
            }
          },
          {
            "@type": "Question",
            "name": "1台からでも依頼できますか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "はい、1台からご依頼いただけます。数十台〜数百台規模の大量取付にも対応しております。台数に応じたお見積もりをご提案いたします。"
            }
          },
          {
            "@type": "Question",
            "name": "料金体系はどうなっていますか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "取付工賃・出張費用・部材費用を車両の種類と装置に応じてお見積もりいたします。事前にすべての費用を明示し、追加請求はございません。"
            }
          },
          {
            "@type": "Question",
            "name": "公認パートナーになるにはどうすればいいですか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "フリーランスの電装技術者、電装店、取付専門サービスマンの方を対象に公認パートナーを募集しています。SVAに加入することで、特殊車両向けの高単価取付案件を継続的に受注できます。パートナー登録フォームからお申し込みください。"
            }
          },
          {
            "@type": "Question",
            "name": "ミツモアやセイビーとの違いは何ですか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "ミツモアやセイビーは乗用車の整備マッチングが中心のC2Cサービスです。SVAはフォークリフト・重機・建機などの特殊車両に完全特化したB2B専門プラットフォームです。特殊車両は電源構造・設置環境・法規制が乗用車と全く異なるため、専門的な知識と技術が不可欠です。全国47都道府県の公認パートナー制度による品質管理も特長です。"
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://sva-assist.com/" }
        ]
      }
    ]
  })

  return `<!DOCTYPE html>
<html lang="ja" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" href="/static/images/sva-logo.png">
  <title>SVA - Special Vehicle Assist | 特殊車両専門の装置取付プラットフォーム</title>
  <meta name="description" content="SVA（Special Vehicle Assist）は、フォークリフト・重機・建機・トラック・バスなど特殊車両にドライブレコーダー・AIカメラ等を全国出張取付するB2Bプラットフォームです。公認パートナーも募集中。">
  <meta name="keywords" content="特殊車両,ドライブレコーダー,AIカメラ,フォークリフト,重機,建機,トラック,バス,出張取付,デジタルタコグラフ,置き去り防止装置,B2B,全国対応,公認パートナー">
  <link rel="canonical" href="https://sva-assist.com/">
  <link rel="alternate" hreflang="ja" href="https://sva-assist.com/">
  <link rel="alternate" hreflang="x-default" href="https://sva-assist.com/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="SVA - Special Vehicle Assist | 特殊車両専門の装置取付プラットフォーム">
  <meta property="og:description" content="フォークリフト・重機・建機・トラック・バスなど特殊車両にドライブレコーダー・AIカメラ等を全国出張取付。公認パートナーも募集中。">
  <meta property="og:url" content="https://sva-assist.com/">
  <meta property="og:site_name" content="SVA - Special Vehicle Assist">
  <meta property="og:image" content="https://sva-assist.com/static/images/sva-logo.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="ja_JP">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="SVA - Special Vehicle Assist | 特殊車両専門の装置取付プラットフォーム">
  <meta name="twitter:description" content="特殊車両専門の装置取付プラットフォーム。全国出張対応。公認パートナー募集中。">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="format-detection" content="telephone=no">
  <meta name="theme-color" content="#C41E3A">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap" as="style">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script type="application/ld+json">${structuredData}</script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            sva: {
              red: '#C41E3A',
              dark: '#1a1a2e',
              gray: '#333333',
              light: '#f8f9fa',
              accent: '#1A5276',
            }
          },
          fontFamily: {
            sans: ['"Noto Sans JP"', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    * { font-family: 'Noto Sans JP', sans-serif; }
    html { scroll-behavior: smooth; }
    .hero-gradient {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    }
    .card-hover {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .card-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }
    .fade-in {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .partner-banner {
      background: linear-gradient(135deg, #C41E3A 0%, #8B0000 100%);
    }
    .stat-number {
      font-variant-numeric: tabular-nums;
    }
    /* Hero logo - blend white bg into dark bg */
    .hero-logo-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hero-logo-container img {
      mix-blend-mode: lighten;
      filter: drop-shadow(0 0 40px rgba(196, 30, 58, 0.15));
    }
    .hero-logo-glow {
      position: absolute;
      inset: -20%;
      background: radial-gradient(ellipse at center, rgba(196, 30, 58, 0.08) 0%, transparent 70%);
      pointer-events: none;
    }
    /* Hero decorative elements */
    .hero-grid-pattern {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
    }
    .hero-accent-line {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, #C41E3A, transparent);
    }
  </style>
</head>
<body class="bg-white text-sva-gray antialiased">

  <!-- Header -->
  <header class="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-16 sm:h-20">
        <a href="/" class="flex items-center gap-3">
          <img src="/static/images/sva-logo.png" alt="SVA - Special Vehicle Assist" class="h-9 sm:h-11 w-auto object-contain">
        </a>
        <nav class="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#service" class="text-gray-600 hover:text-sva-red transition-colors">サービス</a>
          <a href="#vehicles" class="text-gray-600 hover:text-sva-red transition-colors">対応車両</a>
          <a href="#devices" class="text-gray-600 hover:text-sva-red transition-colors">取付装置</a>
          <a href="/column" class="text-gray-600 hover:text-sva-red transition-colors">コラム</a>
          <a href="#partner" class="text-gray-600 hover:text-sva-red transition-colors">パートナー募集</a>
          <a href="#faq" class="text-gray-600 hover:text-sva-red transition-colors">FAQ</a>
        </nav>
        <div class="flex items-center gap-3">
          <!-- Partner login/mypage button -->
          <div id="partnerBtnWrap">
            <a href="/partner/login" id="partnerLoginBtn" class="hidden sm:inline-flex items-center justify-center px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              ログイン
            </a>
            <a href="/partner/mypage" id="partnerMypageBtn" class="hidden items-center justify-center px-4 py-2 border border-sva-red/20 text-sva-red text-sm font-medium rounded-lg hover:bg-red-50 transition-colors gap-1.5" style="display:none">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              マイページ
            </a>
          </div>
          <a href="#contact" class="hidden sm:inline-flex items-center justify-center px-5 py-2.5 bg-sva-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">
            お問い合わせ
          </a>
          <button id="menuBtn" class="md:hidden p-2 text-gray-600" aria-label="メニューを開く">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>
    </div>
    <!-- Mobile menu -->
    <div id="mobileMenu" class="hidden md:hidden border-t border-gray-100 bg-white">
      <nav class="px-4 py-4 space-y-3">
        <a href="#service" class="block text-sm text-gray-600 py-2">サービス</a>
        <a href="#vehicles" class="block text-sm text-gray-600 py-2">対応車両</a>
        <a href="#devices" class="block text-sm text-gray-600 py-2">取付装置</a>
        <a href="/column" class="block text-sm text-gray-600 py-2">コラム</a>
        <a href="#partner" class="block text-sm text-gray-600 py-2">パートナー募集</a>
        <a href="#faq" class="block text-sm text-gray-600 py-2">FAQ</a>
        <a id="mobilePartnerBtn" href="/partner/login" class="block text-sm text-gray-600 py-2 border-t border-gray-100 mt-2 pt-3">パートナーログイン</a>
        <a href="#contact" class="block text-sm text-white bg-sva-red rounded-lg px-4 py-2.5 text-center font-medium">お問い合わせ</a>
      </nav>
    </div>
  </header>

  <main>
    <!-- Hero Section -->
    <section class="hero-gradient pt-28 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div class="flex-1 text-center lg:text-left">
            <p class="text-sva-red font-medium text-sm tracking-widest mb-4">SPECIAL VEHICLE ASSIST</p>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              特殊車両の装置取付を、<br>全国どこでも。
            </h1>
            <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              フォークリフト・重機・建機・トラック・バス ──<br class="hidden sm:block">
              乗用車以外のすべての車両に、ドライブレコーダー・AIカメラ等の安全装置を出張取付する日本初のB2B専門プラットフォームです。
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a href="#contact" class="inline-flex items-center justify-center px-8 py-3.5 bg-sva-red text-white font-medium rounded-lg hover:bg-red-800 transition-colors text-sm">
                取付を依頼する
              </a>
              <a href="#partner" class="inline-flex items-center justify-center px-8 py-3.5 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors text-sm">
                公認パートナーに応募する
              </a>
            </div>
          </div>
          <div class="flex-shrink-0 w-64 sm:w-80 lg:w-96">
            <img src="/static/images/sva-logo.png" alt="SVA - Special Vehicle Assist" class="w-full h-auto hero-logo-blend select-none" draggable="false">
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="bg-white border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p class="text-2xl sm:text-3xl font-bold text-sva-dark stat-number">47</p>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">都道府県対応</p>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-bold text-sva-dark stat-number">8+</p>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">車両カテゴリ</p>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-bold text-sva-dark stat-number">30+</p>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">取付対応装置</p>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-bold text-sva-dark stat-number">B2B</p>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">法人専門</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Service Overview -->
    <section id="service" class="py-16 sm:py-24 bg-sva-light">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <p class="text-sva-red text-sm font-medium tracking-widest mb-2">SERVICE</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-sva-dark">SVAが選ばれる理由</h2>
          <p class="text-gray-500 mt-3 text-sm max-w-xl mx-auto">特殊車両の装置取付に特化した唯一のプラットフォームとして、法人のお客様に最適なソリューションを提供します。</p>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="bg-white rounded-xl p-8 card-hover border border-gray-100">
            <div class="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-5">
              <svg class="w-6 h-6 text-sva-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <h3 class="text-lg font-bold text-sva-dark mb-3">全国出張対応</h3>
            <p class="text-sm text-gray-500 leading-relaxed">47都道府県に公認パートナーが在籍。お客様の現場・車庫・営業所まで出張して施工します。車両を移動させる必要はありません。</p>
          </div>
          <div class="bg-white rounded-xl p-8 card-hover border border-gray-100">
            <div class="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-5">
              <svg class="w-6 h-6 text-sva-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <h3 class="text-lg font-bold text-sva-dark mb-3">特殊車両専門の技術力</h3>
            <p class="text-sm text-gray-500 leading-relaxed">一般的な乗用車整備とは全く異なる特殊車両の電装知識と取付技術。審査を通過した公認パートナーのみが施工を担当します。</p>
          </div>
          <div class="bg-white rounded-xl p-8 card-hover border border-gray-100">
            <div class="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-5">
              <svg class="w-6 h-6 text-sva-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <h3 class="text-lg font-bold text-sva-dark mb-3">法人対応に特化</h3>
            <p class="text-sm text-gray-500 leading-relaxed">物流会社・建設会社・運送会社・バス会社など法人のお客様専門。大量台数の一括取付や定期的な保守にも対応します。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Target Vehicles -->
    <section id="vehicles" class="py-16 sm:py-24 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <p class="text-sva-red text-sm font-medium tracking-widest mb-2">VEHICLES</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-sva-dark">対応車両カテゴリ</h2>
          <p class="text-gray-500 mt-3 text-sm">乗用車以外のすべての車両に対応しています</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          ${vehicleCard('フォークリフト', '倉庫・工場内の安全対策に', 'priority')}
          ${vehicleCard('重機', 'ショベルカー・クレーン等', 'priority')}
          ${vehicleCard('建機', '建設現場の安全管理に', 'priority')}
          ${vehicleCard('トラック', '大型・中型・小型すべて対応', '')}
          ${vehicleCard('バス', '路線・観光・送迎バス', '')}
          ${vehicleCard('農機', 'トラクター・コンバイン等', '')}
          ${vehicleCard('船舶', '船舶用ドラレコ対応', '')}
          ${vehicleCard('その他特殊車両', 'ご相談ください', '')}
        </div>
      </div>
    </section>

    <!-- Devices -->
    <section id="devices" class="py-16 sm:py-24 bg-sva-light">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <p class="text-sva-red text-sm font-medium tracking-widest mb-2">DEVICES</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-sva-dark">取付対応装置</h2>
          <p class="text-gray-500 mt-3 text-sm">安全管理・運行管理に必要な装置を幅広くカバー</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${deviceCard('ドライブレコーダー', '各種車両対応の業務用ドラレコ')}
          ${deviceCard('フォークリフト用人検知AIカメラ', 'AI画像認識による作業員検知・事故防止')}
          ${deviceCard('重機専用人検知AIカメラ', '重機周辺の作業員を自動検知')}
          ${deviceCard('建機停止装置AIカメラ', 'AI検知で建機を自動停止')}
          ${deviceCard('デジタルタコグラフ', '運行記録の義務化対応')}
          ${deviceCard('ETC車載器', '大型車・特殊車両用ETC')}
          ${deviceCard('SOS-0006 置き去り防止装置', '送迎バスの安全対策義務化対応')}
          ${deviceCard('クラウド型ドライブレコーダー', 'リアルタイム映像確認・遠隔管理')}
          ${deviceCard('バックカメラ', 'ダブル連結トラック等の後方確認')}
          ${deviceCard('船舶用ドライブレコーダー', '防水・耐振動仕様の船舶専用機')}
          ${deviceCard('LEDマーカーランプ', 'トラック用品・視認性向上')}
          ${deviceCard('その他装置', '特殊な装置もご相談ください')}
        </div>
      </div>
    </section>

    <!-- Flow -->
    <section id="flow" class="py-16 sm:py-24 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <p class="text-sva-red text-sm font-medium tracking-widest mb-2">FLOW</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-sva-dark">ご依頼の流れ</h2>
        </div>
        <div class="max-w-3xl mx-auto">
          <div class="space-y-0">
            ${flowStep('01', 'お問い合わせ・ご相談', '車両の種類、台数、取り付けたい装置、作業場所をお知らせください。お電話またはフォームから受け付けています。', false)}
            ${flowStep('02', 'お見積もり・ご提案', '車両情報をもとに、最適な装置と施工プランをご提案。取付工賃・出張費用・部材費用を明確にお伝えします。', false)}
            ${flowStep('03', '日程調整・パートナー手配', '施工日程を調整し、お客様のエリアの公認パートナーを手配いたします。', false)}
            ${flowStep('04', '出張施工・完了報告', '公認パートナーが現場に出張し施工。作業完了後、動作確認と完了報告をお送りします。', true)}
          </div>
        </div>
      </div>
    </section>

    <!-- Column / Latest Articles -->
    ${latestArticles.length > 0 ? `
    <section id="column" class="py-16 sm:py-24 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <p class="text-sva-red text-sm font-medium tracking-widest mb-2">COLUMN</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-sva-dark">最新コラム</h2>
          <p class="text-gray-500 mt-3 text-sm">特殊車両の安全装置に関する最新情報をお届けします</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${latestArticles.map(a => `
            <a href="/column/${escapeForHtml(a.slug)}" class="bg-white rounded-xl border border-gray-100 overflow-hidden card-hover block">
              <div class="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                ${a.thumbnail_url
                  ? `<img src="${escapeForHtml(a.thumbnail_url)}" alt="${escapeForHtml(a.title)}" class="w-full h-full object-cover">`
                  : `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                       <svg class="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                     </div>`
                }
                <span class="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded ${CATEGORY_COLORS[a.category] || 'bg-gray-100 text-gray-600'}">${CATEGORY_LABELS[a.category] || a.category}</span>
              </div>
              <div class="p-5">
                <h3 class="text-sm font-bold text-sva-dark leading-snug mb-2" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${escapeForHtml(a.title)}</h3>
                <p class="text-xs text-gray-400 leading-relaxed mb-3" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${escapeForHtml(a.excerpt)}</p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-400">${fmtDate(a.published_at)}</span>
                  <span class="text-xs text-gray-400">${escapeForHtml(a.author)}</span>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
        <div class="text-center mt-8">
          <a href="/column" class="inline-flex items-center justify-center px-8 py-3 border border-gray-200 text-sva-dark text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            コラム一覧を見る
          </a>
        </div>
      </div>
    </section>
    ` : ''}

    <!-- Partner Recruitment -->
    <section id="partner" class="py-16 sm:py-24 partner-banner">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="max-w-3xl mx-auto text-center">
          <p class="text-white/70 text-sm font-medium tracking-widest mb-2">PARTNER</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4">公認パートナー募集</h2>
          <p class="text-white/80 text-base leading-relaxed mb-8">
            フリーランスの電装技術者、電装店、取付専門サービスマンの方 ──<br class="hidden sm:block">
            SVAに加入して、特殊車両の高単価取付案件を受注しませんか。
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <p class="text-white font-bold text-lg mb-2">高単価案件</p>
            <p class="text-white/70 text-sm leading-relaxed">乗用車ドラレコ取付の数倍の報酬。特殊車両ならではの専門単価で、安定した収入を実現できます。</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <p class="text-white font-bold text-lg mb-2">継続受注</p>
            <p class="text-white/70 text-sm leading-relaxed">法人案件はリピート率が高く、1社から年間を通じて複数台の依頼が発生します。安定した案件供給を実現。</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <p class="text-white font-bold text-lg mb-2">営業不要</p>
            <p class="text-white/70 text-sm leading-relaxed">案件獲得はSVA本部が担当。パートナーの皆様は施工に専念できます。集客の手間はゼロです。</p>
          </div>
        </div>
        <div class="text-center">
          <a href="#contact" class="inline-flex items-center justify-center px-8 py-3.5 bg-white text-sva-red font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm">
            パートナー登録について問い合わせる
          </a>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="py-16 sm:py-24 bg-sva-light">
      <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <p class="text-sva-red text-sm font-medium tracking-widest mb-2">FAQ</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-sva-dark">よくあるご質問</h2>
        </div>
        <div class="space-y-3">
          ${faqItem('SVAとはどのようなサービスですか？', 'SVA（Special Vehicle Assist）は、フォークリフト・重機・建機・トラック・バスなど乗用車以外の特殊車両に、ドライブレコーダーやAIカメラ等の安全装置を全国出張で取り付ける日本初のB2B特化型プラットフォームです。全国の公認パートナー（電装店・フリーランス技術者）がお客様の現場に出張して施工します。')}
          ${faqItem('対応している車両の種類は？', 'フォークリフト、重機（ショベルカー・クレーン等）、建機、トラック（大型・中型・小型）、バス（路線・観光・送迎）、農機、船舶、その他特殊車両に対応しています。乗用車以外のすべての車両が対象です。')}
          ${faqItem('どのような装置を取り付けできますか？', 'ドライブレコーダー、ETC、フォークリフト用人検知AIカメラ、デジタルタコグラフ、重機専用人検知AIカメラ、建機停止装置AIカメラ、SOS-0006置き去り防止装置、ダブル連結トラック用バックカメラ、船舶用ドライブレコーダー、クラウド型ドライブレコーダー、LEDマーカーランプなど幅広く対応しています。')}
          ${faqItem('全国対応していますか？', 'はい、全国47都道府県に対応しています。各地域に公認パートナー（電装店・フリーランス技術者）が在籍しており、お客様の現場まで出張して施工いたします。')}
          ${faqItem('料金体系はどうなっていますか？', '取付工賃・出張費用・部材費用を車両の種類と装置に応じてお見積もりいたします。事前にすべての費用を明示し、追加請求はございません。詳細はお問い合わせください。')}
          ${faqItem('公認パートナーになるにはどうすればいいですか？', 'フリーランスの電装技術者、電装店、取付専門サービスマンの方を対象に公認パートナーを募集しています。SVAに加入することで、特殊車両向けの高単価取付案件を継続的に受注できます。下記のお問い合わせフォームからお申し込みください。')}
          ${faqItem('1台からでも依頼できますか？', 'はい、1台からご依頼いただけます。もちろん、数十台〜数百台規模の大量取付にも対応しております。台数に応じたお見積もりをご提案いたします。')}
          ${faqItem('取付後の保証やアフターサポートはありますか？', '施工完了後も、装置の動作不良や取付に関するトラブルについてサポート対応いたします。詳細な保証内容はお問い合わせ時にご案内いたします。')}
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="py-16 sm:py-24 bg-white">
      <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <p class="text-sva-red text-sm font-medium tracking-widest mb-2">CONTACT</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-sva-dark">お問い合わせ</h2>
          <p class="text-gray-500 mt-3 text-sm">取付のご依頼・公認パートナーへのご応募はこちらから</p>
        </div>
        <div class="bg-sva-light rounded-xl p-6 sm:p-10 border border-gray-100">
          <form id="contactForm" class="space-y-5">
            <div class="grid sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">お名前 <span class="text-sva-red text-xs">必須</span></label>
                <input type="text" required class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red transition-colors bg-white" placeholder="山田 太郎">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">会社名 <span class="text-sva-red text-xs">必須</span></label>
                <input type="text" required class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red transition-colors bg-white" placeholder="株式会社○○">
              </div>
            </div>
            <div class="grid sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">メールアドレス <span class="text-sva-red text-xs">必須</span></label>
                <input type="email" required class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red transition-colors bg-white" placeholder="info@example.co.jp">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">電話番号</label>
                <input type="tel" class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red transition-colors bg-white" placeholder="06-0000-0000">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">お問い合わせ種別 <span class="text-sva-red text-xs">必須</span></label>
              <select required class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red transition-colors bg-white">
                <option value="">選択してください</option>
                <option>装置取付のご依頼・お見積もり</option>
                <option>公認パートナーへの応募</option>
                <option>サービスに関するご質問</option>
                <option>その他</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">お問い合わせ内容 <span class="text-sva-red text-xs">必須</span></label>
              <textarea required rows="5" class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sva-red/20 focus:border-sva-red transition-colors bg-white resize-none" placeholder="車両の種類、台数、取り付けたい装置、ご希望のエリア等をご記入ください。"></textarea>
            </div>
            <div class="text-center pt-2">
              <button type="submit" class="inline-flex items-center justify-center px-10 py-3.5 bg-sva-red text-white font-medium rounded-lg hover:bg-red-800 transition-colors text-sm">
                送信する
              </button>
            </div>
          </form>
        </div>
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-500 mb-2">お電話でのお問い合わせ</p>
          <a href="tel:06-6152-7511" class="text-xl font-bold text-sva-dark hover:text-sva-red transition-colors">06-6152-7511</a>
          <p class="text-xs text-gray-400 mt-1">受付時間 9:00〜18:00（土日祝を除く）</p>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="bg-sva-dark text-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div class="grid md:grid-cols-3 gap-10">
        <div>
          <div class="bg-white rounded-lg px-3 py-2 inline-block mb-4">
            <img src="/static/images/sva-logo.png" alt="SVA - Special Vehicle Assist" class="h-8 w-auto object-contain">
          </div>
          <p class="text-gray-400 text-xs leading-relaxed">特殊車両専門の装置取付プラットフォーム。<br>全国の公認パートナーネットワークで、<br>どこでも出張施工に対応します。</p>
        </div>
        <div>
          <p class="text-sm font-medium mb-4">サービス</p>
          <ul class="space-y-2 text-xs text-gray-400">
            <li><a href="#service" class="hover:text-white transition-colors">SVAが選ばれる理由</a></li>
            <li><a href="#vehicles" class="hover:text-white transition-colors">対応車両カテゴリ</a></li>
            <li><a href="#devices" class="hover:text-white transition-colors">取付対応装置</a></li>
            <li><a href="/column" class="hover:text-white transition-colors">コラム</a></li>
            <li><a href="#partner" class="hover:text-white transition-colors">公認パートナー募集</a></li>
            <li><a href="#faq" class="hover:text-white transition-colors">よくあるご質問</a></li>
            <li><a href="https://www.torasapo-kun.com/" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">トラサポくん</a></li>
          </ul>
        </div>
        <div>
          <p class="text-sm font-medium mb-4">運営会社</p>
          <div class="mb-4">
            <div class="bg-white rounded px-2 py-1.5 inline-block mb-3">
              <img src="/static/images/tci-logo.png" alt="株式会社TCIサービス" class="h-6 w-auto object-contain">
            </div>
          </div>
          <dl class="text-xs text-gray-400 space-y-1.5">
            <div class="flex"><dt class="w-16 shrink-0">社名</dt><dd>株式会社TCIサービス</dd></div>
            <div class="flex"><dt class="w-16 shrink-0">所在地</dt><dd>大阪府大阪市淀川区新高1丁目5-4 3階</dd></div>
            <div class="flex"><dt class="w-16 shrink-0">代表</dt><dd>代表取締役 謝花 祐治</dd></div>
            <div class="flex"><dt class="w-16 shrink-0">電話</dt><dd><a href="tel:06-6152-7511" class="hover:text-white transition-colors">06-6152-7511</a></dd></div>
          </dl>
        </div>
      </div>
      <div class="border-t border-white/10 mt-10 pt-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <p class="text-xs text-gray-500">&copy; 2025 株式会社TCIサービス All rights reserved.</p>
          <div class="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-gray-500">
            <a href="/privacy" class="hover:text-white transition-colors">プライバシーポリシー</a>
            <a href="/terms" class="hover:text-white transition-colors">利用規約</a>
            <a href="/tokushoho" class="hover:text-white transition-colors">特定商取引法</a>
            <a href="/sitemap" class="inline-flex items-center gap-1 hover:text-white transition-colors">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
              サイトマップ
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>

  <script>
    // Mobile menu toggle
    document.getElementById('menuBtn').addEventListener('click', function() {
      const menu = document.getElementById('mobileMenu');
      menu.classList.toggle('hidden');
    });
    // Close mobile menu on link click
    document.querySelectorAll('#mobileMenu a').forEach(function(link) {
      link.addEventListener('click', function() {
        document.getElementById('mobileMenu').classList.add('hidden');
      });
    });
    // FAQ accordion
    document.querySelectorAll('[data-faq-toggle]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const icon = this.querySelector('[data-faq-icon]');
        const isOpen = !content.classList.contains('hidden');
        // Close all
        document.querySelectorAll('[data-faq-content]').forEach(function(c) { c.classList.add('hidden'); });
        document.querySelectorAll('[data-faq-icon]').forEach(function(i) { i.textContent = '+'; });
        if (!isOpen) {
          content.classList.remove('hidden');
          icon.textContent = '-';
        }
      });
    });
    // Scroll animation
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(function(el) { observer.observe(el); });
    // Header scroll
    window.addEventListener('scroll', function() {
      const header = document.querySelector('header');
      if (window.scrollY > 10) {
        header.classList.add('shadow-sm');
      } else {
        header.classList.remove('shadow-sm');
      }
    });
    // Partner auth state check
    (function() {
      var token = localStorage.getItem('sva_partner_token');
      var loginBtn = document.getElementById('partnerLoginBtn');
      var mypageBtn = document.getElementById('partnerMypageBtn');
      var mobileBtn = document.getElementById('mobilePartnerBtn');
      if (token) {
        fetch('/api/partner/me', { headers: { 'Authorization': 'Bearer ' + token } })
          .then(function(r) {
            if (r.ok) {
              if (loginBtn) loginBtn.style.display = 'none';
              if (mypageBtn) { mypageBtn.style.display = 'inline-flex'; }
              if (mobileBtn) { mobileBtn.href = '/partner/mypage'; mobileBtn.textContent = 'マイページ'; }
            } else {
              localStorage.removeItem('sva_partner_token');
              localStorage.removeItem('sva_partner');
              if (loginBtn) loginBtn.style.display = '';
            }
          }).catch(function() {});
      } else {
        if (loginBtn) loginBtn.style.display = '';
      }
    })();
  </script>
</body>
</html>`
}

function vehicleCard(name: string, description: string, priority: string): string {
  const borderClass = priority === 'priority' ? 'border-sva-red/20 bg-red-50/30' : 'border-gray-100 bg-white'
  const badge = priority === 'priority' ? '<span class="absolute top-2 right-2 bg-sva-red text-white text-[10px] px-1.5 py-0.5 rounded font-medium">優先対応</span>' : ''
  return `
    <div class="relative rounded-xl p-5 border ${borderClass} card-hover">
      ${badge}
      <p class="font-bold text-sva-dark text-sm mb-1">${name}</p>
      <p class="text-xs text-gray-500">${description}</p>
    </div>`
}

function deviceCard(name: string, description: string): string {
  return `
    <div class="bg-white rounded-xl p-5 border border-gray-100 card-hover">
      <p class="font-bold text-sva-dark text-sm mb-1">${name}</p>
      <p class="text-xs text-gray-500">${description}</p>
    </div>`
}

function flowStep(num: string, title: string, description: string, isLast: boolean): string {
  const lineClass = isLast ? '' : '<div class="w-px h-6 bg-gray-200 ml-5"></div>'
  return `
    <div>
      <div class="flex gap-5">
        <div class="flex flex-col items-center">
          <div class="w-10 h-10 rounded-full bg-sva-red text-white flex items-center justify-center text-sm font-bold shrink-0">${num}</div>
        </div>
        <div class="pb-2 pt-1.5">
          <p class="font-bold text-sva-dark text-base mb-1">${title}</p>
          <p class="text-sm text-gray-500 leading-relaxed">${description}</p>
        </div>
      </div>
      ${lineClass}
    </div>`
}

function faqItem(question: string, answer: string): string {
  return `
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button data-faq-toggle class="w-full flex items-center justify-between px-6 py-4 text-left">
        <span class="text-sm font-medium text-sva-dark pr-4">${question}</span>
        <span data-faq-icon class="text-sva-red text-lg font-light shrink-0 w-6 text-center">+</span>
      </button>
      <div data-faq-content class="hidden px-6 pb-5">
        <p class="text-sm text-gray-500 leading-relaxed">${answer}</p>
      </div>
    </div>`
}
