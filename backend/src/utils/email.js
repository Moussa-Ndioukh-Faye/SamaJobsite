const { Resend } = require('resend');

// Instanciation lazy pour éviter un crash si RESEND_API_KEY n'est pas encore configuré
let _resend = null;
const getResend = () => {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
};

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://sama-jobsite.vercel.app';
const FROM_EMAIL   = process.env.FROM_EMAIL    || 'SamaJob <onboarding@resend.dev>';

/**
 * Envoyer l'email de vérification lors de l'inscription
 */
const sendVerificationEmail = async ({ to, nom, token }) => {
  const link = `${FRONTEND_URL}/verify-email?token=${token}`;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Vérifiez votre adresse email – SamaJob',
    html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0">
          <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#1B2A5E,#27AE60);padding:32px;text-align:center">
                  <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:900;letter-spacing:-0.5px">
                    Sama<span style="color:#7fffc4">Job</span>
                  </h1>
                  <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px">La plateforme de micro-missions au Sénégal</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:36px 40px">
                  <h2 style="margin:0 0 12px;color:#111827;font-size:20px">Bonjour ${nom} 👋</h2>
                  <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6">
                    Merci de vous être inscrit sur SamaJob ! Pour activer votre compte, cliquez sur le bouton ci-dessous :
                  </p>
                  <div style="text-align:center;margin:28px 0">
                    <a href="${link}"
                       style="display:inline-block;background:#27AE60;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:700;letter-spacing:0.3px">
                      ✅ Vérifier mon email
                    </a>
                  </div>
                  <p style="margin:0 0 8px;color:#9ca3af;font-size:13px">Ce lien expire dans <strong>24 heures</strong>.</p>
                  <p style="margin:0;color:#9ca3af;font-size:12px;word-break:break-all">
                    Ou copiez ce lien : <a href="${link}" style="color:#1B2A5E">${link}</a>
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb">
                  <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center">
                    Si vous n'avez pas créé de compte SamaJob, ignorez cet email.<br>
                    © ${new Date().getFullYear()} SamaJob — Fait avec ♥ au Sénégal
                  </p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  });
};

module.exports = { sendVerificationEmail };
