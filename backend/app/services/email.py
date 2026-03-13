import resend
from app.config import settings


def send_password_reset_email(to_email: str, reset_url: str) -> bool:
    if not settings.RESEND_API_KEY or settings.RESEND_API_KEY.startswith("re_placeholder"):
        print(f"[EMAIL STUB] Password reset link for {to_email}: {reset_url}")
        return True

    resend.api_key = settings.RESEND_API_KEY

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #059669;">TandaPay Password Reset</h2>
      <p>You requested a password reset. Click the button below to set a new password.</p>
      <p>This link expires in <strong>1 hour</strong>.</p>
      <a href="{reset_url}"
         style="display:inline-block;padding:12px 24px;background:#059669;color:#fff;
                text-decoration:none;border-radius:8px;font-weight:600;margin:16px 0;">
        Reset Password
      </a>
      <p style="color:#6b7280;font-size:13px;">
        If you didn't request this, you can safely ignore this email.
      </p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
      <p style="color:#6b7280;font-size:12px;">TandaPay — Secure bill splitting powered by M-PESA</p>
    </div>
    """

    try:
        resend.Emails.send({
            "from": settings.EMAIL_FROM,
            "to": [to_email],
            "subject": "Reset your TandaPay password",
            "html": html,
        })
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send reset email to {to_email}: {e}")
        return False
