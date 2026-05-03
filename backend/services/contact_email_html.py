"""
Branded multipart/alternative HTML for contact notifications.

Uses table layout + inline CSS for Outlook/Gmail compatibility. Escapes user input.
Light inner card renders well where clients strip dark ``body`` backgrounds.
"""

from __future__ import annotations

import html

from schemas.contact import ContactSubmission

_PURPLE = "#7c3aed"
_PURPLE_DARK = "#5b21b6"
_CYAN = "#06b6d4"
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
            '<tr>'
            f'<td style="padding:10px 0;border-bottom:1px solid {_BORDER};vertical-align:top;">'
            f'<p style="margin:0;color:{_SLATE_MUTED};font-size:12px;text-transform:uppercase;'
            'letter-spacing:0.08em;font-weight:600;">'
            f'{esc(label)}</p>'
            f'</td>'
            f'<td style="padding:10px 0 10px 16px;border-bottom:1px solid {_BORDER};vertical-align:top;">'
            f'<p style="margin:0;color:{_SLATE_HEAD};font-size:15px;line-height:1.55;font-weight:500;">'
            f'{esc(value)}</p>'
            '</td>'
            '</tr>'
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
    snippet = html.escape(raw_snippet[:140] + ("…" if len(raw_snippet) > 140 else ""), quote=False)

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
            <td style="padding:0;border-radius:14px 14px 0 0;background:{_PURPLE};">
              <div style="background:linear-gradient(125deg,{_PURPLE} 0%,{_CYAN} 98%);padding:26px 28px 28px;">
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
            <td style="background:{_CARD};padding:0 28px 32px;border:1px solid {_BORDER};
              border-top:none;border-radius:0 0 14px 14px;box-shadow:0 14px 40px rgba(15,23,42,0.07);">

              <p style="margin:0;padding:24px 0 6px;color:{_SLATE_BODY};font-size:15px;line-height:1.65;">
                Here&apos;s everything they submitted. Lead source: your portfolio contact flow.
              </p>
              <p style="margin:0;padding:0 0 22px;color:{_SLATE_MUTED};font-size:13px;line-height:1.55;">
                <span style="font-family:ui-monospace,Consolas,'Liberation Mono',monospace;font-size:12px;color:{_PURPLE};">
                  https://qubixsolution.com/contact</span>
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="height:3px;line-height:3px;background:linear-gradient(90deg,{_PURPLE},{_CYAN});
                    border-radius:2px;font-size:0;">&#8203;</td>
                </tr>
                <tr><td style="height:18px;font-size:0;line-height:0;">&#8203;</td></tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">{rows}</table>

              <p style="margin:24px 0 10px;color:{_SLATE_MUTED};font-size:11px;font-weight:700;
                letter-spacing:0.14em;text-transform:uppercase;">Project details</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:18px 20px;background:{_MESSAGING_BG};border:1px solid {_BORDER};
                    border-left:4px solid {_CYAN};border-radius:0 10px 10px 0;">
                    <div style="margin:0;color:{_SLATE_HEAD};font-size:15px;line-height:1.65;">{message_block}</div>
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
