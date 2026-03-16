import { siteHead, siteHeader, siteFooter, escapeHtml } from './layout'

// ==========================================
// Service page data types
// ==========================================
interface ServicePageData {
  slug: string
  title: string
  titleEn: string
  heroTitle: string
  heroSubtitle: string
  metaDescription: string
  metaKeywords: string
  image: string  // hero image path e.g. /static/images/service-forklift.png
  challenges: { title: string; text: string }[]
  devices: { name: string; desc: string }[]
  features: { title: string; text: string }[]
  faq: { q: string; a: string }[]
  cta: string
  relatedSlugs: string[]
}

// ==========================================
// All service page definitions
// ==========================================
const SERVICE_PAGES: Record<string, ServicePageData> = {
  'forklift': {
    slug: 'forklift',
    title: 'フォークリフト用AIカメラ・ドラレコ取付',
    titleEn: 'Forklift AI Camera & Dashcam Installation',
    heroTitle: 'フォークリフト用<br>AIカメラ・ドラレコ取付',
    heroSubtitle: 'AI人検知カメラで倉庫・工場の安全を守る。全国出張取付対応。',
    image: '/static/images/service-forklift.png',
    metaDescription: 'フォークリフト用人検知AIカメラ・ドライブレコーダーの出張取付サービス。AI画像認識による作業員検知で事故防止。全国47都道府県対応。1台から数百台まで。SVA公認パートナーが施工。',
    metaKeywords: 'フォークリフト,AIカメラ,人検知,ドライブレコーダー,取付,出張,安全対策,倉庫,工場,事故防止',
    challenges: [
      { title: '死角が多い', text: 'フォークリフトはマスト・フォーク・積荷により前方・後方の死角が大きく、歩行者との接触事故リスクが高い。' },
      { title: '倉庫内の狭い通路', text: '倉庫や工場内の狭い通路では、歩行者とフォークリフトが接近する場面が頻繁に発生。目視確認だけでは限界がある。' },
      { title: '24V電源系の特殊性', text: 'フォークリフトは乗用車と異なり24V電源系統。一般的なカー用品店では取付対応できない。' },
      { title: '労災防止の義務化圧力', text: '厚生労働省のフォークリフト安全対策ガイドラインにより、事故防止のための安全装置導入が強く推奨されている。' },
    ],
    devices: [
      { name: 'フォークリフト用人検知AIカメラ', desc: 'AI画像認識で歩行者のみを高精度に検知。最大4台のカメラで360度をカバー。タグ不要でどんな姿勢の人も検知可能。' },
      { name: '業務用ドライブレコーダー', desc: '防塵・防振仕様の業務用ドラレコ。24V対応。衝撃時の自動録画と運行管理に対応。' },
      { name: 'クラウド型ドライブレコーダー', desc: 'リアルタイム映像確認・遠隔管理対応。管理者が事務所からフォークリフトの稼働状況を確認可能。' },
      { name: 'バックカメラ', desc: '後方確認用カメラ。荷物積載時に死角となる後方の安全確認を支援。' },
    ],
    features: [
      { title: '24V電源対応の専門技術', text: 'フォークリフト特有の24V電源系統に対応できる専門の電装技術者が施工。乗用車向けのカー用品店では不可能な作業を確実に実行。' },
      { title: '工場・倉庫への出張施工', text: 'フォークリフトを外に持ち出す必要なし。お客様の倉庫・工場に公認パートナーが出張して施工。業務への影響を最小限に抑えます。' },
      { title: '大量導入に対応', text: '数十台〜数百台規模の一括導入にも対応。台数に応じた割引見積もりと、効率的な施工スケジュールをご提案。' },
    ],
    faq: [
      { q: 'フォークリフトにAIカメラを取り付ける費用はいくらですか？', a: '車種・台数・カメラの種類によって異なります。SVAでは事前に全ての費用を明示したお見積もりを無料でお出しします。追加請求は一切ありません。まずはお気軽にお問い合わせください。' },
      { q: '電動フォークリフトとエンジンフォークリフトの両方に対応できますか？', a: 'はい、どちらにも対応しています。電動式(リーチ式含む)・エンジン式(カウンターバランス式含む)ともに豊富な取付実績があります。' },
      { q: '既存のフォークリフトに後付けできますか？', a: 'はい、後付け可能です。新車・中古車問わず、ほぼすべてのメーカー・機種のフォークリフトに対応しています。' },
      { q: '取付にかかる時間はどれくらいですか？', a: 'AIカメラ1セット（4カメラ構成）の場合、1台あたり約2〜4時間が目安です。台数が多い場合は複数パートナーの同時施工で効率化します。' },
    ],
    cta: 'フォークリフトへの装置取付について相談する',
    relatedSlugs: ['heavy-equipment', 'construction', 'truck'],
  },

  'heavy-equipment': {
    slug: 'heavy-equipment',
    title: '重機用人検知AIカメラ・ドラレコ取付',
    titleEn: 'Heavy Equipment AI Camera & Dashcam Installation',
    heroTitle: '重機用<br>人検知AIカメラ・ドラレコ取付',
    heroSubtitle: 'ショベルカー・クレーンなど重機の安全対策を全国出張で。',
    image: '/static/images/service-heavy-equipment.png',
    metaDescription: '重機（ショベルカー・クレーン等）用人検知AIカメラ・ドライブレコーダーの出張取付サービス。360度AIカメラで作業員を自動検知。全国47都道府県対応。建設現場の安全管理に。',
    metaKeywords: '重機,ショベルカー,クレーン,AIカメラ,人検知,ドライブレコーダー,取付,出張,建設現場,安全対策',
    challenges: [
      { title: '旋回時の広い死角', text: '重機は旋回半径が大きく、オペレーターからの死角が広い。旋回時に作業員との接触事故が多発している。' },
      { title: '過酷な使用環境', text: '建設現場は粉塵・振動・高温・雨天など過酷な環境。一般的なカメラ・ドラレコでは耐久性が不足。' },
      { title: '法規制の強化', text: '建設業における重大災害防止のため、国土交通省は重機への安全装置搭載を推進。CCUS（建設キャリアアップシステム）との連携も進んでいる。' },
      { title: '特殊な電源と取付位置', text: '重機は乗用車と電源系統が根本的に異なり、キャビンの形状も多様。機種ごとの専門知識が必要。' },
    ],
    devices: [
      { name: '重機専用人検知AIカメラ', desc: '重機周辺の作業員を自動検知し、オペレーターに警報。360度をカバーする多カメラシステム。IP67防塵防水対応。' },
      { name: '建機停止装置AIカメラ', desc: 'AI検知で建機の動作を自動停止させる高度な安全装置。人の接近を検知すると自動的にブレーキ。' },
      { name: '業務用ドライブレコーダー', desc: '耐振動・防塵仕様。衝撃録画対応。建設現場での事故記録と安全管理に。' },
      { name: 'クラウド型ドライブレコーダー', desc: '現場の映像をリアルタイムで事務所から確認。複数現場の一元管理が可能。' },
    ],
    features: [
      { title: '重機の電装に精通した技術者', text: '24V/48V電源、CAN通信対応、防水コネクタ処理など、重機特有の電装知識を持つ公認パートナーが施工。' },
      { title: '建設現場への出張対応', text: '重機を現場から移動させる必要なし。公認パートナーが建設現場に直接出向いて施工します。' },
      { title: 'レンタル重機にも対応', text: 'レンタル重機への装置取付も対応。レンタル会社様の保有台数一括導入もご相談ください。' },
    ],
    faq: [
      { q: '重機にAIカメラを取り付ける費用はいくらですか？', a: '機種・カメラの台数・仕様によって異なります。SVAでは無料で事前見積もりをお出しします。追加請求は一切ありません。' },
      { q: 'どのメーカーの重機に対応していますか？', a: 'コマツ、日立建機、キャタピラー、コベルコ、住友建機、加藤製作所など主要メーカー全般に対応しています。' },
      { q: '雨天や冬季でも取付作業は可能ですか？', a: '屋根付きの作業場があれば対応可能です。屋外の場合は天候を考慮して日程調整します。' },
      { q: 'リース・レンタル中の重機にも取付できますか？', a: 'はい、リース・レンタル中の重機にも後付けで取付可能です。リース会社への確認が必要な場合はサポートいたします。' },
    ],
    cta: '重機への装置取付について相談する',
    relatedSlugs: ['construction', 'forklift', 'truck'],
  },

  'construction': {
    slug: 'construction',
    title: '建機用安全装置・AIカメラ取付',
    titleEn: 'Construction Equipment Safety Device Installation',
    heroTitle: '建機用<br>安全装置・AIカメラ取付',
    heroSubtitle: '建設現場の安全管理を強化。AI検知による自動停止装置を全国出張取付。',
    image: '/static/images/service-construction.png',
    metaDescription: '建機用安全装置・AIカメラの出張取付サービス。AI検知で建機を自動停止させる安全装置、人検知カメラ、ドライブレコーダーの取付。全国47都道府県対応。建設現場の労災防止に。',
    metaKeywords: '建機,建設機械,安全装置,AIカメラ,自動停止,人検知,取付,出張,建設現場,労災防止',
    challenges: [
      { title: '建設現場の労災リスク', text: '建設業は全産業で最も労働災害が多い業種。建機と作業員の接触事故は重篤化しやすい。' },
      { title: '複数の機種への対応', text: 'ブルドーザー、ホイールローダー、ダンプトラック、アスファルトフィニッシャーなど多種多様な建機が混在する現場での統一的な安全管理。' },
      { title: 'NETIS登録装置の導入', text: '国土交通省のNETIS（新技術情報提供システム）に登録された安全装置の導入が公共工事で加点対象となっている。' },
      { title: '総合評価方式への対応', text: '公共工事の入札で安全対策への取り組みが評価対象。ICT施工やAI安全装置の導入実績が競争力に直結。' },
    ],
    devices: [
      { name: '建機停止装置AIカメラ', desc: 'AI画像認識で人を検知し、建機の動作を自動停止。オペレーターが気づかない死角からの接近にも即座に対応。' },
      { name: '重機専用人検知AIカメラ', desc: '警報型の人検知システム。建機周辺360度を監視し、作業員の接近をリアルタイムに警告。' },
      { name: '業務用ドライブレコーダー', desc: '建設現場向け高耐久ドラレコ。IP67防塵防水。事故時の映像記録と安全教育に活用。' },
      { name: 'バックカメラ', desc: 'ダンプアップ時や後進時の後方確認を支援。大型建機の死角をカバー。' },
    ],
    features: [
      { title: '建設業向け安全装置に特化', text: 'NETIS登録装置を含む建設業向けの安全装置に精通。公共工事の総合評価対策としてもご活用いただけます。' },
      { title: '現場への出張施工', text: '建設現場に公認パートナーが出向いて施工。工期に影響を与えない日程調整も可能です。' },
      { title: '複数機種の一括導入', text: '現場で稼働する複数種類の建機への一括導入に対応。統一的な安全管理体制の構築をサポート。' },
    ],
    faq: [
      { q: '建機への安全装置取付は公共工事の加点対象になりますか？', a: 'はい、NETIS登録された安全装置の導入は多くの公共工事で総合評価方式の加点対象となっています。詳細はお問い合わせ時にご案内します。' },
      { q: 'ブルドーザーやホイールローダーにも対応していますか？', a: 'はい、ショベルカー以外にもブルドーザー、ホイールローダー、クレーン、ダンプトラックなど幅広い建機に対応しています。' },
      { q: '施工中に現場の作業を止める必要がありますか？', a: '取付対象の建機のみ作業を一時停止いただきます。他の建機や現場全体の作業を止める必要はありません。' },
    ],
    cta: '建機への安全装置取付について相談する',
    relatedSlugs: ['heavy-equipment', 'forklift', 'truck'],
  },

  'truck': {
    slug: 'truck',
    title: 'トラック用ドラレコ・デジタコ・ETC取付',
    titleEn: 'Truck Dashcam, Digital Tachograph & ETC Installation',
    heroTitle: 'トラック用<br>ドラレコ・デジタコ・ETC取付',
    heroSubtitle: '大型・中型・小型トラックの安全装置・法定装置を全国出張取付。',
    image: '/static/images/service-truck.png',
    metaDescription: 'トラック用ドライブレコーダー・デジタルタコグラフ・ETC車載器の出張取付サービス。大型・中型・小型トラック対応。法定義務装置からAIカメラまで。全国47都道府県出張対応。',
    metaKeywords: 'トラック,ドライブレコーダー,デジタルタコグラフ,ETC,取付,出張,大型トラック,運行管理,24V,物流',
    challenges: [
      { title: 'デジタコの法定義務', text: '事業用自動車の運行記録計の装着が義務化。デジタルタコグラフの導入と適切な取付が法令遵守に不可欠。' },
      { title: '24V電源系統', text: 'トラック（特に大型）は24V電源。一般的なカー用品店やディーラーでは取付に対応できない場合が多い。' },
      { title: '大量台数の一括導入', text: '物流会社・運送会社は保有台数が多く、数十台〜数百台への一括導入ニーズがあるが、対応できる業者が限られる。' },
      { title: '多種類の装置の複合取付', text: 'ドラレコ + デジタコ + ETC + バックカメラなど複数装置の同時取付。配線の取り回しに専門知識が必要。' },
    ],
    devices: [
      { name: 'ドライブレコーダー', desc: '24V対応の業務用ドラレコ。前後2カメラ・360度タイプ等。衝撃時自動録画・GPS記録対応。' },
      { name: 'デジタルタコグラフ', desc: '運行記録の法定義務対応。速度・時間・距離を自動記録。クラウド連携型も対応。' },
      { name: 'ETC車載器', desc: '大型車・特殊車両用ETC 2.0対応車載器。高速道路料金の自動精算と車両管理。' },
      { name: 'バックカメラ', desc: '大型トラック・ダブル連結トラック等の後方確認。接近警報付きタイプも対応。' },
      { name: 'クラウド型ドライブレコーダー', desc: 'リアルタイム映像確認・遠隔管理。運行管理者が事務所から全車両を一元監視。' },
      { name: 'LEDマーカーランプ', desc: 'トラックの視認性向上。夜間走行時の安全対策。' },
    ],
    features: [
      { title: '大型車専門の電装技術', text: '24V電源、大型車特有の配線ルート、キャビン構造を熟知した専門技術者が施工。' },
      { title: '営業所・車庫への出張施工', text: 'トラックを持ち込む必要なし。営業所や車庫に公認パートナーが出張。夜間・休日施工も相談可能。' },
      { title: '複数装置の同時取付', text: 'ドラレコ + デジタコ + ETCなど複数装置の一括取付で、配線をスマートにまとめて施工。個別に取り付けるよりもコスト効率的。' },
    ],
    faq: [
      { q: 'トラックへのデジタコ取付費用はいくらですか？', a: '車種・台数・デジタコの機種によって異なります。SVAでは事前にすべての費用を明示した見積もりを無料でお出しします。' },
      { q: '夜間や休日にトラックへの取付作業はできますか？', a: 'はい、トラックが稼働していない夜間や休日の施工にも対応可能です。パートナーの空き状況により調整します。' },
      { q: '全国の営業所に同時に取付対応できますか？', a: 'はい、SVAは全国47都道府県に公認パートナーが在籍しているため、複数の営業所への同時施工に対応可能です。' },
      { q: 'ダブル連結トラック用のバックカメラは対応していますか？', a: 'はい、ダブル連結トラック等の長尺車両向けバックカメラシステムの取付に対応しています。' },
    ],
    cta: 'トラックへの装置取付について相談する',
    relatedSlugs: ['forklift', 'bus', 'heavy-equipment'],
  },

  'bus': {
    slug: 'bus',
    title: 'バス用置き去り防止装置・ドラレコ取付',
    titleEn: 'Bus Safety Device & Child Detection System Installation',
    heroTitle: 'バス用<br>置き去り防止装置・ドラレコ取付',
    heroSubtitle: '送迎バスの安全対策義務化に対応。国交省認定装置を全国出張取付。',
    image: '/static/images/service-bus.png',
    metaDescription: '送迎バス用置き去り防止装置（SOS-0006等）・ドライブレコーダーの出張取付サービス。国土交通省ガイドライン適合装置対応。幼稚園・保育園・障害者施設の送迎バスに。全国47都道府県出張対応。',
    metaKeywords: 'バス,置き去り防止装置,SOS-0006,送迎バス,ドライブレコーダー,取付,出張,義務化,幼稚園,保育園,国土交通省',
    challenges: [
      { title: '置き去り防止装置の義務化', text: '2023年4月より、送迎バスへの安全装置の装備が義務化。国土交通省のガイドラインに適合する装置の設置が法令で求められている。' },
      { title: '設置業者の不足', text: '全国で一斉に義務化されたため、対応できる取付業者が不足。特に地方ではすぐに施工してくれる業者が見つからない。' },
      { title: '補助金制度への対応', text: '置き去り防止安全装置の設置には1台あたり最大17.5万円の補助金が利用可能。補助金申請に必要な書類作成のサポートも必要。' },
      { title: '運行への影響最小化', text: '送迎バスは毎日稼働するため、取付作業による運行停止を最小限に抑える必要がある。' },
    ],
    devices: [
      { name: 'SOS-0006 置き去り防止装置', desc: '国土交通省認定の置き去り防止安全装置。エンジンOFF後、車内に置き去りにされた乗員がいないか確認を誘導するシステム。' },
      { name: 'ドライブレコーダー', desc: '送迎バス向け業務用ドラレコ。乗降時の映像記録と運行管理に対応。前方・車内の2カメラ対応。' },
      { name: 'デジタルタコグラフ', desc: '事業用バスの運行記録義務対応。速度・時間・距離の自動記録。' },
    ],
    features: [
      { title: '国交省ガイドライン適合装置に精通', text: '国土交通省が定める技術要件を満たした認定装置を取り扱い。ガイドライン適合証明書の発行にも対応。' },
      { title: '園・施設への出張施工', text: '幼稚園、保育園、障害者施設、介護施設の駐車場に出向いて施工。バスを持ち込む手間が不要。' },
      { title: '補助金申請サポート', text: '置き去り防止装置の設置に伴う補助金（1台あたり最大17.5万円）の申請に必要な情報をサポート。' },
    ],
    faq: [
      { q: '送迎バスの置き去り防止装置の取付は義務ですか？', a: 'はい、2023年4月1日より送迎用バスへの安全装置の装備が義務化されています。幼稚園・保育園・認定こども園・特別支援学校などの送迎バスが対象です。' },
      { q: '置き去り防止装置の設置に補助金は出ますか？', a: 'はい、義務化対象施設では1台あたり最大17.5万円の補助金が利用可能です。義務化対象外の施設でも最大8.8万円の補助金があります。' },
      { q: '置き去り防止装置の取付にかかる時間はどれくらいですか？', a: 'SOS-0006の場合、1台あたり約1〜2時間が目安です。送迎の合間や休園日の施工に対応します。' },
      { q: 'マイクロバスや幼児バスにも対応していますか？', a: 'はい、大型バス・中型バス・マイクロバス・幼児専用バスなど、すべてのサイズのバスに対応しています。' },
    ],
    cta: 'バスへの安全装置取付について相談する',
    relatedSlugs: ['truck', 'forklift', 'heavy-equipment'],
  },

  'ship': {
    slug: 'ship',
    title: '船舶用ドライブレコーダー取付',
    titleEn: 'Marine Vessel Dashcam Installation',
    heroTitle: '船舶用<br>ドライブレコーダー取付',
    heroSubtitle: '防水・耐振動・耐塩害仕様の船舶専用ドラレコを全国出張取付。',
    image: '/static/images/service-ship.png',
    metaDescription: '船舶用ドライブレコーダーの出張取付サービス。防水・耐振動・耐塩害仕様の船舶専用ドラレコ対応。漁船・作業船・旅客船に。全国対応。SVA公認パートナーが施工。',
    metaKeywords: '船舶,ドライブレコーダー,防水,耐塩害,取付,出張,漁船,作業船,旅客船,海上安全',
    challenges: [
      { title: '防水・耐塩害の必要性', text: '海上での使用は水しぶき・塩害にさらされるため、IP67以上の防水性能と耐塩害処理が施された専用機器が必要。' },
      { title: '振動への耐性', text: '船舶特有のエンジン振動・波による衝撃に耐えられる高耐久設計が求められる。' },
      { title: '設置環境の多様性', text: '漁船・作業船・旅客船で操舵室の構造が大きく異なり、機種ごとの設置ノウハウが必要。' },
      { title: '取付業者の不足', text: '船舶への電装品取付に対応できる業者は非常に限られている。特に地方の漁港では業者探しが困難。' },
    ],
    devices: [
      { name: '船舶用ドライブレコーダー', desc: 'IP67以上の防水性能、耐塩害処理、耐振動設計の船舶専用ドラレコ。前方・後方の同時録画対応。GPS記録で航路の確認も可能。' },
    ],
    features: [
      { title: '船舶電装の専門知識', text: '船舶特有の電源系統（12V/24V DC）や防水コネクタの処理など、海上環境に適した施工を行います。' },
      { title: '港湾・漁港への出張施工', text: 'お客様の船舶が係留されている港湾・漁港に出向いて施工。船を陸揚げする必要はありません。' },
      { title: '耐環境性の高い機器選定', text: '海上使用に耐えうる防水・耐塩害・耐振動仕様の機器を厳選してご提案。' },
    ],
    faq: [
      { q: '漁船にドライブレコーダーを取り付けることはできますか？', a: 'はい、漁船への船舶用ドラレコ取付に対応しています。船のサイズや形状に合わせた最適な設置方法をご提案します。' },
      { q: '船舶用ドラレコは普通のドラレコとどう違いますか？', a: '船舶用は防水（IP67以上）・耐塩害・耐振動仕様で、海上環境での使用に特化しています。通常の車載用ドラレコでは海水や塩害で短期間に故障してしまいます。' },
      { q: '沿岸部でない港にも出張してくれますか？', a: 'はい、全国の港湾・漁港に出張対応します。離島の場合はフェリーでの移動も含めて対応可能です（事前にご相談ください）。' },
    ],
    cta: '船舶へのドラレコ取付について相談する',
    relatedSlugs: ['truck', 'heavy-equipment', 'forklift'],
  },
}

const SERVICE_LIST = Object.values(SERVICE_PAGES)

// ==========================================
// Service page HTML generator
// ==========================================
export function servicePage(slug: string): string | null {
  const data = SERVICE_PAGES[slug]
  if (!data) return null
  return renderServicePage(data)
}

export function getServiceSlugs(): string[] {
  return Object.keys(SERVICE_PAGES)
}

export function getServiceList(): { slug: string; title: string }[] {
  return SERVICE_LIST.map(s => ({ slug: s.slug, title: s.title }))
}

// Device icon SVGs by category
function deviceIcon(name: string): string {
  if (name.includes('AI') || name.includes('人検知') || name.includes('停止装置')) {
    return '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"/></svg>'
  }
  if (name.includes('ドライブレコーダー') || name.includes('ドラレコ') || name.includes('ドラレコ')) {
    return '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25z"/></svg>'
  }
  if (name.includes('バックカメラ')) {
    return '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316z"/><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0z"/></svg>'
  }
  if (name.includes('ETC')) {
    return '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5z"/></svg>'
  }
  if (name.includes('デジタルタコグラフ') || name.includes('デジタコ')) {
    return '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6z"/><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5z"/></svg>'
  }
  if (name.includes('クラウド')) {
    return '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15z"/></svg>'
  }
  if (name.includes('SOS') || name.includes('置き去り')) {
    return '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>'
  }
  if (name.includes('LED') || name.includes('マーカー')) {
    return '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/></svg>'
  }
  // Default
  return '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17l-5.384 3.08A2.065 2.065 0 013 16.367V7.633a2.065 2.065 0 013.036-1.884l5.384 3.08a2.065 2.065 0 010 3.768zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
}

// Feature icon by index
function featureIcon(idx: number): string {
  const icons = [
    '<svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17l-5.384 3.08A2.065 2.065 0 013 16.367V7.633a2.065 2.065 0 013.036-1.884l5.384 3.08a2.065 2.065 0 010 3.768zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    '<svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>',
    '<svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"/></svg>',
  ]
  return icons[idx % icons.length]
}

function renderServicePage(data: ServicePageData): string {
  // Structured data
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `https://sva-assist.com/service/${data.slug}#service`,
        "name": data.title,
        "provider": { "@id": "https://sva-assist.com/#organization" },
        "serviceType": data.title,
        "areaServed": { "@type": "Country", "name": "Japan" },
        "description": data.metaDescription,
        "url": `https://sva-assist.com/service/${data.slug}`,
        "image": `https://sva-assist.com${data.image}`,
      },
      {
        "@type": "FAQPage",
        "@id": `https://sva-assist.com/service/${data.slug}#faq`,
        "mainEntity": data.faq.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://sva-assist.com/" },
          { "@type": "ListItem", "position": 2, "name": "サービス", "item": "https://sva-assist.com/#service" },
          { "@type": "ListItem", "position": 3, "name": data.title, "item": `https://sva-assist.com/service/${data.slug}` }
        ]
      }
    ]
  })

  // Related services
  const relatedServices = data.relatedSlugs
    .map(s => SERVICE_PAGES[s])
    .filter(Boolean)

  return siteHead(
    `${data.title} | SVA - Special Vehicle Assist`,
    data.metaDescription,
    `/service/${data.slug}`,
    `<meta name="keywords" content="${data.metaKeywords}">
    <meta property="og:image" content="https://sva-assist.com${data.image}">
    <script type="application/ld+json">${structuredData}</script>
    <style>
      .hero-service { position: relative; overflow: hidden; }
      .hero-service-img {
        position: absolute; inset: 0;
        width: 100%; height: 100%;
        object-fit: cover;
        opacity: 0.35;
        filter: brightness(0.6);
        transition: transform 0.5s ease;
      }
      .hero-service:hover .hero-service-img { transform: scale(1.03); }
      .hero-service-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(135deg, rgba(26,26,46,0.92) 0%, rgba(26,26,46,0.7) 50%, rgba(15,52,96,0.85) 100%);
      }
      @media (min-width: 768px) {
        .hero-service-img { opacity: 0.5; }
        .hero-service-overlay {
          background: linear-gradient(90deg, rgba(26,26,46,0.95) 0%, rgba(26,26,46,0.8) 45%, rgba(15,52,96,0.4) 100%);
        }
      }
      .challenge-image {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 1rem;
        overflow: hidden;
      }
      .challenge-image img {
        width: 100%; height: 100%;
        object-fit: cover;
        opacity: 0.7;
        mix-blend-mode: luminosity;
      }
      .device-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .device-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(196,30,58,0.1);
      }
      .feature-card {
        position: relative;
        overflow: hidden;
      }
      .feature-card::before {
        content: '';
        position: absolute; top: 0; left: 0;
        width: 4px; height: 100%;
        background: linear-gradient(180deg, #C41E3A 0%, #1A5276 100%);
        border-radius: 4px 0 0 4px;
      }
      .related-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        overflow: hidden;
      }
      .related-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.1);
      }
      .related-card img {
        transition: transform 0.3s ease;
      }
      .related-card:hover img {
        transform: scale(1.05);
      }
      .stat-number {
        background: linear-gradient(135deg, #C41E3A, #1A5276);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
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
          <a href="/#service" class="hover:text-sva-red transition-colors">サービス</a>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span class="text-gray-800 font-medium">${escapeHtml(data.title)}</span>
        </nav>
      </div>
    </div>

    <!-- Hero with Background Image -->
    <section class="hero-service">
      <img src="${data.image}" alt="${escapeHtml(data.title)}" class="hero-service-img" loading="eager" width="1365" height="768">
      <div class="hero-service-overlay"></div>
      <div class="relative z-10 py-20 sm:py-28 lg:py-32">
        <div class="max-w-6xl mx-auto px-4 sm:px-6">
          <div class="max-w-2xl">
            <p class="inline-block bg-sva-red/20 text-sva-red font-semibold text-xs tracking-widest px-4 py-1.5 rounded-full mb-6 border border-sva-red/30 backdrop-blur-sm">${data.titleEn.toUpperCase()}</p>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">${data.heroTitle}</h1>
            <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-10">${escapeHtml(data.heroSubtitle)}</p>
            <div class="flex flex-col sm:flex-row gap-4">
              <a href="#contact-service" class="inline-flex items-center justify-center px-8 py-4 bg-sva-red text-white font-medium rounded-xl hover:bg-red-800 transition-all text-sm shadow-lg shadow-red-900/30 hover:shadow-xl hover:shadow-red-900/40">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                ${escapeHtml(data.cta)}
              </a>
              <a href="tel:06-6152-7511" class="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all text-sm backdrop-blur-sm border border-white/20">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                06-6152-7511
              </a>
            </div>
          </div>
          <!-- Stats bar -->
          <div class="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 max-w-lg">
            <div>
              <p class="text-2xl sm:text-3xl font-bold text-white">47</p>
              <p class="text-xs text-gray-400 mt-1">都道府県対応</p>
            </div>
            <div>
              <p class="text-2xl sm:text-3xl font-bold text-white">24V</p>
              <p class="text-xs text-gray-400 mt-1">電源対応</p>
            </div>
            <div>
              <p class="text-2xl sm:text-3xl font-bold text-white">0<span class="text-lg">円</span></p>
              <p class="text-xs text-gray-400 mt-1">見積もり無料</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Challenges with Side Image -->
    <section class="py-16 sm:py-20 bg-sva-light">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <p class="text-sva-red text-sm font-medium tracking-widest mb-2">CHALLENGES</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-sva-dark">こんな課題はありませんか？</h2>
        </div>
        <div class="grid lg:grid-cols-5 gap-8 items-start">
          <!-- Image column (hidden on mobile, shown on lg) -->
          <div class="hidden lg:block lg:col-span-2">
            <div class="challenge-image aspect-[4/5] sticky top-24 rounded-2xl shadow-2xl">
              <img src="${data.image}" alt="${escapeHtml(data.title)}" loading="lazy" class="rounded-2xl" width="1365" height="768">
              <div class="absolute inset-0 bg-gradient-to-t from-sva-dark/80 via-transparent to-transparent rounded-2xl"></div>
              <div class="absolute bottom-0 left-0 right-0 p-6">
                <p class="text-white text-sm font-medium opacity-80">SVAが解決します</p>
                <p class="text-white text-lg font-bold mt-1">${escapeHtml(data.title)}</p>
              </div>
            </div>
          </div>
          <!-- Cards column -->
          <div class="lg:col-span-3 grid sm:grid-cols-2 gap-5">
            ${data.challenges.map((c, i) => `
              <div class="bg-white rounded-xl p-6 border border-gray-100 hover:border-sva-red/20 transition-colors">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span class="text-sva-red font-bold text-sm">${String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <h3 class="font-bold text-sva-dark text-sm mb-2">${escapeHtml(c.title)}</h3>
                    <p class="text-sm text-gray-500 leading-relaxed">${escapeHtml(c.text)}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- Devices -->
    <section class="py-16 sm:py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <p class="text-sva-red text-sm font-medium tracking-widest mb-2">DEVICES</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-sva-dark">対応装置</h2>
          <p class="text-sm text-gray-500 mt-3 max-w-lg mx-auto">専門技術者が最適な装置を選定し、確実に取付施工します。</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          ${data.devices.map(d => `
            <div class="device-card bg-gradient-to-br from-sva-light to-white rounded-xl p-6 border border-gray-100">
              <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 text-sva-red shadow-sm border border-gray-50">
                ${deviceIcon(d.name)}
              </div>
              <h3 class="font-bold text-sva-dark text-sm mb-2">${escapeHtml(d.name)}</h3>
              <p class="text-xs text-gray-500 leading-relaxed">${escapeHtml(d.desc)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SVA Features -->
    <section class="py-16 sm:py-20 bg-sva-light">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <p class="text-sva-red text-sm font-medium tracking-widest mb-2">WHY SVA</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-sva-dark">SVAが選ばれる理由</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          ${data.features.map((f, i) => `
            <div class="feature-card bg-white rounded-xl p-8 border border-gray-100">
              <div class="w-14 h-14 bg-gradient-to-br from-sva-red/10 to-sva-accent/10 rounded-2xl flex items-center justify-center mb-5 text-sva-red">
                ${featureIcon(i)}
              </div>
              <h3 class="text-lg font-bold text-sva-dark mb-3">${escapeHtml(f.title)}</h3>
              <p class="text-sm text-gray-500 leading-relaxed">${escapeHtml(f.text)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-16 sm:py-20 bg-white">
      <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <p class="text-sva-red text-sm font-medium tracking-widest mb-2">FAQ</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-sva-dark">よくあるご質問</h2>
        </div>
        <div class="space-y-3">
          ${data.faq.map(f => `
            <div class="bg-sva-light rounded-xl border border-gray-100 overflow-hidden">
              <button data-faq-toggle class="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/50 transition-colors">
                <span class="text-sm font-medium text-sva-dark pr-4">${escapeHtml(f.q)}</span>
                <span data-faq-icon class="text-sva-red text-lg font-light shrink-0 w-6 text-center transition-transform duration-200">+</span>
              </button>
              <div data-faq-content class="hidden px-6 pb-5">
                <p class="text-sm text-gray-500 leading-relaxed">${escapeHtml(f.a)}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Related Services with Images -->
    ${relatedServices.length > 0 ? `
    <section class="py-16 sm:py-20 bg-sva-light">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-10">
          <p class="text-sva-red text-sm font-medium tracking-widest mb-2">RELATED</p>
          <h2 class="text-xl sm:text-2xl font-bold text-sva-dark">関連サービス</h2>
        </div>
        <div class="grid sm:grid-cols-3 gap-6">
          ${relatedServices.map(s => `
            <a href="/service/${s.slug}" class="related-card bg-white rounded-2xl border border-gray-100 hover:border-sva-red/20 block group">
              <div class="aspect-[16/9] overflow-hidden rounded-t-2xl bg-sva-dark">
                <img src="${s.image}" alt="${escapeHtml(s.title)}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" loading="lazy" width="1365" height="768">
              </div>
              <div class="p-5">
                <p class="font-bold text-sva-dark text-sm mb-1.5 group-hover:text-sva-red transition-colors">${escapeHtml(s.title)}</p>
                <p class="text-xs text-gray-500 line-clamp-2">${escapeHtml(s.heroSubtitle)}</p>
                <span class="inline-flex items-center gap-1 text-xs text-sva-red font-medium mt-3">
                  詳しく見る
                  <svg class="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                </span>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    </section>
    ` : ''}

    <!-- Contact CTA -->
    <section id="contact-service" class="py-16 sm:py-20 bg-gradient-to-br from-sva-dark via-[#16213e] to-[#0f3460] relative overflow-hidden">
      <div class="absolute inset-0 opacity-5">
        <img src="${data.image}" alt="" class="w-full h-full object-cover" loading="lazy">
      </div>
      <div class="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div class="w-16 h-16 bg-sva-red/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-sva-red/30">
          <svg class="w-8 h-8 text-sva-red" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4">${escapeHtml(data.cta)}</h2>
        <p class="text-sm text-gray-300 mb-10">お見積もりは無料です。まずはお気軽にお問い合わせください。</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/#contact" class="inline-flex items-center justify-center px-8 py-4 bg-sva-red text-white font-medium rounded-xl hover:bg-red-800 transition-all text-sm shadow-lg shadow-red-900/30">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
            お問い合わせフォーム
          </a>
          <a href="tel:06-6152-7511" class="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all text-sm backdrop-blur-sm border border-white/20">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
            06-6152-7511
          </a>
        </div>
        <p class="text-xs text-gray-400 mt-6">受付時間 9:00〜18:00（土日祝を除く）</p>
      </div>
    </section>
  </main>
  <script>
    document.querySelectorAll('[data-faq-toggle]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var content = this.nextElementSibling;
        var icon = this.querySelector('[data-faq-icon]');
        var isOpen = !content.classList.contains('hidden');
        document.querySelectorAll('[data-faq-content]').forEach(function(c) { c.classList.add('hidden'); });
        document.querySelectorAll('[data-faq-icon]').forEach(function(i) { i.textContent = '+'; i.style.transform = ''; });
        if (!isOpen) { content.classList.remove('hidden'); icon.textContent = '-'; icon.style.transform = 'rotate(180deg)'; }
      });
    });
  </script>
  ` + siteFooter()
}
