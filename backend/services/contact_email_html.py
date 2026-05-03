"""
Branded multipart/alternative HTML for contact notifications.

Uses inline CSS (mailto clients strip external sheets). Escapes user content via ``html.escape``.
Colours align with globals.css gradient brand (violet → cyan).
"""

from __future__ import annotations

import html

from schemas.contact import ContactSubmission

# Mirrors `globals.css` --gradient-brand / dark surface feel.
_PURPLE = "#7c3aed"
_CYAN = "#22d3ee"
_BG = "#0c0c14"
_CARD = "#12121c"
_FG = "#e4e4e7"
_FG_MUTED = "#a1a1aa"
_BORDER = "#27272f"


def render_contact_notification_html(data: ContactSubmission) -> str:
    """Return a compact, inbox-friendly inquiry layout."""

    def esc(v: object) -> str:
        return html.escape(str(v), quote=False)

    def meta_row(label: str, value: str | None) -> str:
        if not value or not str(value).strip():
            return ""
        return (
            "<tr>"
            f'<td style="padding:8px 0;color:{_FG_MUTED};font-size:13px;width:132px;">{esc(label)}</td>'
            f'<td style="padding:8px 0;color:{_FG};font-size:14px;line-height:1.5;">{esc(value)}</td>'
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

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width"/>
<title>New contact — Qubix Solutions</title>
</head>
<body style="margin:0;padding:0;background:{_BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:{_BG};padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;border-radius:14px;overflow:hidden;
        border:1px solid {_BORDER};background:{_CARD};box-shadow:0 12px 40px rgba(0,0,0,0.35);">

        <!-- Brand bar -->
        <tr>
          <td style="padding:20px 24px;background:linear-gradient(105deg,{_PURPLE} 0%,{_CYAN} 100%);">
            <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.18em;color:rgba(255,255,255,0.9);">
              QUBIX SOLUTIONS
            </p>
            <p style="margin:6px 0 0;font-size:18px;font-weight:700;color:#ffffff;">
              New contact form submission
            </p>
          </td>
        </tr>

        <!-- Summary -->
        <tr>
          <td style="padding:20px 24px 12px;color:{_FG_MUTED};font-size:13px;line-height:1.6;">
            Someone submitted the portfolio contact form below. Reply using <strong style="color:{_CYAN};">Reply</strong>
            to reach them at their address.
          </td>
        </tr>

        <tr><td style="padding:0 24px 8px;"><hr style="border:none;border-top:1px solid {_BORDER};margin:0;"/></td></tr>

        <tr><td style="padding:8px 24px 24px;">
          <table role="presentation" width="100%" cellspacing="0">{rows}</table>
        </td></tr>

        <tr><td style="padding:0 24px 8px;"><hr style="border:none;border-top:1px solid {_BORDER};margin:0;"/></td></tr>

        <!-- Message -->
        <tr><td style="padding:16px 24px 28px;color:{_FG};font-size:14px;line-height:1.65;">
          <p style="margin:0 0 10px;color:{_FG_MUTED};font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">
            Project details
          </p>
          <div style="color:{_FG};">{message_block}</div>
        </td></tr>
      </table>

      <p style="margin:20px auto 0;max-width:560px;color:{_FG_MUTED};font-size:11px;line-height:1.5;">
        This message was generated from <span style="color:{_CYAN};">qubixsolution.com</span> —
        inquiries are forwarded to support.
      </p>
    </td></tr>
  </table>
</body>
</html>
"""
