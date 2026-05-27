import { buildNewsletterTemplate } from './emailTemplates'

const RESEND_API_URL = 'https://api.resend.com'

/**
 * Returns the correct Audience ID based on NODE_ENV.
 * Uses TEST audience in development/test, PROD audience in production.
 */
function getAudienceId(): string {
  const isProd = process.env.NODE_ENV === 'production'
  const id = isProd
    ? process.env.RESEND_AUDIENCE_ID_PROD
    : process.env.RESEND_AUDIENCE_ID_TEST

  if (!id) {
    throw new Error(
      `Missing Resend Audience ID env var: ${isProd ? 'RESEND_AUDIENCE_ID_PROD' : 'RESEND_AUDIENCE_ID_TEST'}`,
    )
  }
  return id
}

interface ResendContact {
  email: string
  first_name?: string | null
  last_name?: string | null
  unsubscribed: boolean
}

/**
 * Fetches all subscribed contacts from the configured Resend Audience.
 */
async function getAudienceContacts(): Promise<ResendContact[]> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('Missing RESEND_API_KEY environment variable')

  const audienceId = getAudienceId()
  const res = await fetch(`${RESEND_API_URL}/audiences/${audienceId}/contacts`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Resend contacts fetch failed (${res.status}): ${body}`)
  }

  const data = (await res.json()) as { data: ResendContact[] }
  // Filter out unsubscribed contacts
  return (data.data ?? []).filter((c) => !c.unsubscribed)
}

interface SendEmailParams {
  to: string
  subject: string
  html: string
  replyTo?: string
}

/**
 * Sends a single email via Resend.
 */
async function sendEmail({ to, subject, html, replyTo }: SendEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('Missing RESEND_API_KEY environment variable')

  const from = process.env.RESEND_FROM_EMAIL || 'newsletter@lunavalos.com'

  const res = await fetch(`${RESEND_API_URL}/emails`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Resend email send failed to ${to} (${res.status}): ${body}`)
  }
}

export interface NewsletterPostData {
  title: string
  subtitle?: string | null
  excerpt?: string | null
  imageUrl?: string | null
  relevantInfoHtml?: string | null
  ctaSectionHtml?: string | null
  slug: string
}

/**
 * Sends the newsletter to all subscribed contacts in the configured audience.
 * Returns the number of emails sent successfully.
 */
export async function sendNewsletter(post: NewsletterPostData): Promise<number> {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://lunavalos.com'
  const postUrl = `${frontendUrl}/blog/${post.slug}`
  const env = process.env.NODE_ENV === 'production' ? 'PROD' : 'TEST'

  console.log(`[Newsletter] Starting send — Audience: ${env}, Post: "${post.title}"`)

  const contacts = await getAudienceContacts()
  console.log(`[Newsletter] Found ${contacts.length} subscribed contacts`)

  if (contacts.length === 0) {
    console.warn('[Newsletter] No subscribed contacts found. Skipping send.')
    return 0
  }

  const html = buildNewsletterTemplate({
    title: post.title,
    subtitle: post.subtitle,
    excerpt: post.excerpt,
    imageUrl: post.imageUrl,
    relevantInfoHtml: post.relevantInfoHtml,
    ctaSectionHtml: post.ctaSectionHtml,
    postUrl,
  })

  const subject = post.subtitle
    ? `${post.title} — ${post.subtitle}`
    : post.title

  let sent = 0
  const errors: string[] = []

  // Send sequentially to avoid hitting rate limits
  for (const contact of contacts) {
    try {
      await sendEmail({ to: contact.email, subject, html })
      sent++
      // Small delay to respect Resend rate limits (2 req/sec on free tier)
      await new Promise((r) => setTimeout(r, 500))
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      errors.push(`${contact.email}: ${msg}`)
      console.error(`[Newsletter] Failed to send to ${contact.email}:`, msg)
    }
  }

  console.log(`[Newsletter] Done — ${sent}/${contacts.length} sent.`)
  if (errors.length > 0) {
    console.warn(`[Newsletter] Errors (${errors.length}):`, errors)
  }

  return sent
}
