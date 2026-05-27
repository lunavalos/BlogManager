export interface NewsletterTemplateProps {
  title: string
  subtitle?: string | null
  excerpt?: string | null
  imageUrl?: string | null
  relevantInfoHtml?: string | null
  ctaSectionHtml?: string | null
  postUrl: string
  unsubscribeUrl?: string
}

export function buildNewsletterTemplate({
  title,
  subtitle,
  excerpt,
  imageUrl,
  relevantInfoHtml,
  ctaSectionHtml,
  postUrl,
  unsubscribeUrl = 'https://lunavalos.com/unsubscribe',
}: NewsletterTemplateProps): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header / Logo -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:28px;font-weight:700;color:#e2a847;letter-spacing:2px;text-transform:uppercase;">LunAvalos</p>
              <p style="margin:6px 0 0;font-size:13px;color:#a0aec0;letter-spacing:1px;">Newsletter</p>
            </td>
          </tr>

          <!-- Featured Image -->
          ${
            imageUrl
              ? `
          <tr>
            <td style="padding:0;">
              <img src="${imageUrl}" alt="${title}" width="600" style="width:100%;max-width:600px;display:block;object-fit:cover;max-height:320px;" />
            </td>
          </tr>`
              : ''
          }

          <!-- Title Block -->
          <tr>
            <td style="padding:40px 40px 8px;">
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#1a1a2e;line-height:1.3;">${title}</h1>
              ${subtitle ? `<p style="margin:12px 0 0;font-size:16px;color:#6b7280;font-style:italic;">${subtitle}</p>` : ''}
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:16px 40px;">
              <div style="height:3px;background:linear-gradient(90deg,#e2a847,#f59e0b,transparent);border-radius:2px;"></div>
            </td>
          </tr>

          <!-- Excerpt -->
          ${
            excerpt
              ? `
          <tr>
            <td style="padding:0 40px 24px;">
              <p style="margin:0;font-size:16px;color:#374151;line-height:1.7;">${excerpt}</p>
            </td>
          </tr>`
              : ''
          }

          <!-- Relevant Info Block -->
          ${
            relevantInfoHtml
              ? `
          <tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:#fef9ee;border-left:4px solid #e2a847;border-radius:4px;padding:20px 24px;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#e2a847;text-transform:uppercase;letter-spacing:1px;">✦ Información Destacada</p>
                    <div style="font-size:15px;color:#374151;line-height:1.7;">${relevantInfoHtml}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
              : ''
          }

          <!-- CTA Section -->
          ${
            ctaSectionHtml
              ? `
          <tr>
            <td style="padding:0 40px 24px;">
              <div style="font-size:15px;color:#374151;line-height:1.7;">${ctaSectionHtml}</div>
            </td>
          </tr>`
              : ''
          }

          <!-- Read More Button -->
          <tr>
            <td style="padding:8px 40px 40px;text-align:center;">
              <a href="${postUrl}" style="display:inline-block;background:linear-gradient(135deg,#e2a847,#f59e0b);color:#1a1a2e;text-decoration:none;font-weight:700;font-size:16px;padding:16px 40px;border-radius:50px;letter-spacing:0.5px;">
                Leer artículo completo →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">
                Recibes este correo porque estás suscrito al newsletter de LunAvalos.
              </p>
              <p style="margin:0;font-size:12px;color:#d1d5db;">
                <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline;">Cancelar suscripción</a>
                &nbsp;·&nbsp;
                <a href="https://lunavalos.com" style="color:#9ca3af;text-decoration:underline;">Visitar sitio</a>
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

        <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} LunAvalos. Todos los derechos reservados.</p>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim()
}
