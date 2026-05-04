"""
Branded multipart/alternative HTML for contact notifications.

Uses table layout + inline CSS for Outlook/Gmail compatibility. Escapes user input.
Light inner card renders well where clients strip dark ``body`` backgrounds.

The ``PUBLIC_SITE_URL`` env (see ``contact_urls``) controls which /contact URL is
shown — it documents *your* canonical form endpoint for ops, not the visitor's site.
"""

from __future__ import annotations

import html

from schemas.contact import ContactSubmission
from services.contact_urls import public_contact_form_url

_BRAND_NAVY = "#1e40af"
_BRAND_CYAN = "#06b6d4"
_OUTER_BG = "#f1f5f9"
_CARD = "#ffffff"
_SLATE_HEAD = "#0f172a"
_SLATE_BODY = "#334155"
_SLATE_MUTED = "#64748b"
_BORDER = "#e2e8f0"
_MESSAGING_BG = "#f8fafc"


def render_contact_notification_html(data: ContactSubmission) -> str:
    """Return a polished lead summary for ops inboxes."""

    def esc(v: object) -> str:
        return html.escape(str(v), quote=False)

    def meta_row(label: str, value: str | None) -> str:
        if not value or not str(value).strip():
            return ""
        return (
            "<tr>"
            f'<td width="132" valign="top" '
            f'style="width:132px;max-width:132px;padding:9px 10px 9px 0;'
            f"border-bottom:1px solid {_BORDER};vertical-align:top;\">"
            f'<p style="margin:0;color:{_SLATE_HEAD};font-size:13px;font-weight:600;line-height:1.4;">'
            f"{esc(label)}</p>"
            "</td>"
            f'<td valign="top" style="padding:9px 0;border-bottom:1px solid {_BORDER};vertical-align:top;">'
            f'<p style="margin:0;color:{_SLATE_BODY};font-size:15px;line-height:1.55;font-weight:500;">'
            f"{esc(value)}</p>"
            "</td>"
            "</tr>"
        )

    rows = "".join(
        (
            meta_row("Name", data.name),
            meta_row("Reply email", str(data.email)),
            meta_row("Company", data.company),
            meta_row("Phone", data.phone),
            meta_row("Service", data.service),
            meta_row("Budget", data.budget),
        )
    )

    message_block = esc(data.message).replace("\r\n", "\n").replace("\n", "<br />\n")
    raw_snippet = data.message.replace("\r\n", " ").replace("\n", " ").strip()
    snippet = html.escape(
        raw_snippet[:140] + ("…" if len(raw_snippet) > 140 else ""),
        quote=False,
    )

    form_url = public_contact_form_url()
    form_href = html.escape(form_url, quote=True)
    form_link_label = html.escape(form_url)

    return f"""<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<title>New inquiry — Qubix Solutions</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
</head>
<body style="margin:0;padding:0;background:{_OUTER_BG};
 font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;font-size:1px;color:{_OUTER_BG};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
    New lead from {esc(data.name)} — {snippet}
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:{_OUTER_BG};padding:28px 16px 40px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">

          <tr>
            <td style="padding:0;border-radius:14px 14px 0 0;background:{_BRAND_NAVY};">
              <div style="background:linear-gradient(125deg,{_BRAND_CYAN} 0%,{_BRAND_NAVY} 98%);padding:26px 28px 28px;">
                <p style="margin:0 0 4px;color:rgba(255,255,255,0.9);font-size:11px;font-weight:700;
                  letter-spacing:0.26em;text-transform:uppercase;">QUBIX SOLUTIONS</p>
                <p style="margin:0;color:#ffffff;font-size:23px;font-weight:700;line-height:1.2;
                  text-shadow:0 1px 2px rgba(0,0,0,0.1);">New contact inquiry</p>
                <p style="margin:12px 0 0;color:rgba(255,255,255,0.94);font-size:14px;line-height:1.5;font-weight:500;">
                  Use <strong>Reply</strong> — we set the visitor&apos;s address for you.</p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background:{_CARD};padding:0 26px 30px;border:1px solid {_BORDER};
              border-top:none;border-radius:0 0 14px 14px;box-shadow:0 14px 40px rgba(15,23,42,0.07);">

              <p style="margin:0;padding:22px 0 14px;color:{_SLATE_BODY};font-size:15px;line-height:1.6;">
                Summary of their submission is below.&nbsp;<strong style="color:{_SLATE_HEAD};">Reply</strong> in your mail app to respond directly to them.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 18px 0;">
                <tr>
                  <td style="padding:12px 16px;background:{_MESSAGING_BG};border:1px solid {_BORDER};border-radius:10px;">
                    <p style="margin:0 0 8px;color:{_SLATE_MUTED};font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">
                      Where this came from</p>
                    <p style="margin:0 0 10px;color:{_SLATE_BODY};font-size:14px;line-height:1.55;">
                      Captured through your published <strong style="color:{_SLATE_HEAD};font-weight:600;">contact page</strong>.
                      Any link below points at <em>your</em> domain (FYI / QA) — not the visitor&apos;s company site.</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0;">
                      <tr>
                        <td style="border-radius:8px;background:{_CARD};border:1px solid {_BORDER};">
                          <a href="{form_href}" target="_blank" rel="noopener noreferrer"
                            style="display:inline-block;padding:10px 16px;font-size:13px;font-weight:600;color:{_BRAND_NAVY};text-decoration:none;">
                            Open your contact page</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:10px 0 0;color:{_SLATE_MUTED};font-size:12px;line-height:1.45;word-break:break-all;">{form_link_label}</p>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="height:3px;line-height:3px;background:linear-gradient(90deg,{_BRAND_NAVY},{_BRAND_CYAN});
                    border-radius:2px;font-size:0;">&#8203;</td>
                </tr>
                <tr><td style="height:16px;font-size:0;line-height:0;">&#8203;</td></tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">{rows}</table>

              <p style="margin:22px 0 8px;color:{_SLATE_MUTED};font-size:11px;font-weight:700;
                letter-spacing:0.12em;text-transform:uppercase;">Project details</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:12px 16px;background:{_MESSAGING_BG};border:1px solid {_BORDER};
                    border-left:4px solid {_BRAND_CYAN};border-radius:0 10px 10px 0;">
                    <div style="margin:0;color:{_SLATE_HEAD};font-size:15px;line-height:1.58;">{message_block}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 8px 0;text-align:center;">
              <p style="margin:0;color:{_SLATE_MUTED};font-size:12px;line-height:1.65;">
                Sent by <strong style="color:{_SLATE_HEAD};">Qubix Solutions</strong> contact pipeline<br/>
                <span style="font-size:11px;color:{_SLATE_MUTED};">Internal — do not distribute</span>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

