// Resend mail utility for Cloudflare Workers
// Uses Resend REST API directly (no Node.js dependencies)

const RESEND_API_URL = 'https://api.resend.com/emails'
const FROM_EMAIL = 'SVA <noreply@sva-assist.com>'
const SITE_URL = 'https://sva-assist.com'

interface SendMailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendMail(apiKey: string, options: SendMailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend API error:', res.status, err)
      return { success: false, error: `Resend ${res.status}: ${err}` }
    }

    return { success: true }
  } catch (e: any) {
    console.error('Mail send error:', e.message)
    return { success: false, error: e.message }
  }
}

// ===== Email Templates =====

interface JobNotificationData {
  partnerName: string
  jobTitle: string
  jobNumber?: string
  location?: string
  vehicleType?: string
  deviceType?: string
  vehicleCount?: number
  preferredDate?: string
  urgentNote?: string
}

interface EmailTemplate {
  subject?: string
  body_intro?: string
  body_footer?: string
  sender_name?: string
  cta_text?: string
  cta_url?: string
}

export function buildJobNotificationEmail(data: JobNotificationData, template?: EmailTemplate | null): { subject: string; html: string } {
  // Use template values or defaults
  const senderName = template?.sender_name || 'SVA'
  const ctaText = template?.cta_text || 'マイページで確認する'
  const ctaUrl = template?.cta_url || `${SITE_URL}/partner/mypage`
  const bodyIntro = template?.body_intro || 'SVAから新しい取付依頼が届きました。\n内容をご確認のうえ、受諾・辞退のご対応をお願いいたします。'
  const bodyFooter = template?.body_footer || `このメールはSVA (Special Vehicle Assist) システムから自動送信されています。\nご不明点は <a href="${SITE_URL}" style="color:#B91C1C;text-decoration:none">sva-assist.com</a> までお問い合わせください。`

  const subjectTemplate = template?.subject || `【SVA】新しい取付依頼が届きました: {{job_title}}`
  const subject = subjectTemplate
    .replace('{{job_title}}', data.jobTitle)
    .replace('{{job_number}}', data.jobNumber || '')
    .replace('{{partner_name}}', data.partnerName)
    .replace('{{location}}', data.location || '')

  const introHtml = escHtml(bodyIntro).replace(/\n/g, '<br>')
  const footerHtml = bodyFooter.replace(/\n/g, '<br>')

  const urgentBlock = data.urgentNote
    ? `<tr><td style="padding:12px 20px">
        <div style="background:#FEF2F2;border:2px solid #FCA5A5;border-radius:8px;padding:12px 16px">
          <p style="margin:0 0 4px;font-size:13px;font-weight:bold;color:#DC2626">⚠ 受諾後 即連絡</p>
          <p style="margin:0;font-size:13px;color:#991B1B">${escHtml(data.urgentNote)}</p>
        </div>
       </td></tr>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:24px 0">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">

  <!-- Header -->
  <tr><td style="background:#1A1A2E;padding:20px 24px;text-align:center">
    <p style="margin:0;font-size:18px;font-weight:bold;color:#FFFFFF;letter-spacing:1px">${escHtml(senderName)}</p>
    <p style="margin:4px 0 0;font-size:11px;color:#9CA3AF">Special Vehicle Assist</p>
  </td></tr>

  <!-- Title -->
  <tr><td style="padding:24px 20px 12px">
    <p style="margin:0;font-size:11px;font-weight:bold;color:#B91C1C;text-transform:uppercase;letter-spacing:1px">NEW JOB REQUEST</p>
    <h1 style="margin:8px 0 0;font-size:18px;color:#1F2937;line-height:1.4">新しい取付依頼が届きました</h1>
  </td></tr>

  <!-- Partner greeting -->
  <tr><td style="padding:4px 20px 16px">
    <p style="margin:0;font-size:14px;color:#4B5563">${escHtml(data.partnerName)} 様</p>
    <p style="margin:8px 0 0;font-size:13px;color:#6B7280;line-height:1.6">${introHtml}</p>
  </td></tr>

  ${urgentBlock}

  <!-- Job details -->
  <tr><td style="padding:12px 20px">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden">
      <tr><td style="padding:14px 16px;border-bottom:1px solid #E5E7EB">
        <p style="margin:0;font-size:10px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px">案件名</p>
        <p style="margin:4px 0 0;font-size:15px;font-weight:bold;color:#1F2937">${escHtml(data.jobTitle)}</p>
      </td></tr>
      ${data.jobNumber ? `<tr><td style="padding:10px 16px;border-bottom:1px solid #E5E7EB">
        <p style="margin:0;font-size:10px;color:#9CA3AF">案件No</p>
        <p style="margin:2px 0 0;font-size:13px;color:#4338CA;font-weight:bold;font-family:monospace">${escHtml(data.jobNumber)}</p>
      </td></tr>` : ''}
      <tr><td style="padding:10px 16px;border-bottom:1px solid #E5E7EB">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%" style="padding-right:8px">
              <p style="margin:0;font-size:10px;color:#9CA3AF">作業場所</p>
              <p style="margin:2px 0 0;font-size:13px;color:#374151">${escHtml(data.location || '未定')}</p>
            </td>
            <td width="50%">
              <p style="margin:0;font-size:10px;color:#9CA3AF">希望日程</p>
              <p style="margin:2px 0 0;font-size:13px;color:#374151">${escHtml(data.preferredDate || '未定')}</p>
            </td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="padding:10px 16px">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="33%">
              <p style="margin:0;font-size:10px;color:#9CA3AF">車両タイプ</p>
              <p style="margin:2px 0 0;font-size:13px;color:#374151">${escHtml(data.vehicleType || '-')}</p>
            </td>
            <td width="33%">
              <p style="margin:0;font-size:10px;color:#9CA3AF">取付装置</p>
              <p style="margin:2px 0 0;font-size:13px;color:#374151">${escHtml(data.deviceType || '-')}</p>
            </td>
            <td width="34%">
              <p style="margin:0;font-size:10px;color:#9CA3AF">車両台数</p>
              <p style="margin:2px 0 0;font-size:13px;color:#374151">${data.vehicleCount || 0}台</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </td></tr>

  <!-- CTA -->
  <tr><td style="padding:16px 20px 8px;text-align:center">
    <a href="${escHtml(ctaUrl)}" style="display:inline-block;background:#B91C1C;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:bold;padding:14px 40px;border-radius:8px;letter-spacing:0.5px">${escHtml(ctaText)}</a>
  </td></tr>
  <tr><td style="padding:4px 20px 20px;text-align:center">
    <p style="margin:0;font-size:11px;color:#9CA3AF">上記ボタンから案件詳細の確認・受諾が可能です</p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:16px 20px;text-align:center">
    <p style="margin:0;font-size:11px;color:#9CA3AF">${footerHtml}</p>
    <p style="margin:8px 0 0;font-size:10px;color:#D1D5DB">&copy; ${escHtml(senderName)} - Special Vehicle Assist</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`

  return { subject, html }
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
