// /src/lib/emailTemplates.ts

export function getVerificationEmailTemplate(name: string, confirmUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px; color: #333;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">

        <!-- Header -->
        <div style="background: linear-gradient(90deg, #2563eb, #3b82f6); padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px; color: #fff;">
            Bienvenue, ${name} 🎉
          </h1>
        </div>

        <!-- Body -->
        <div style="padding: 32px; text-align: center;">
          <p style="font-size: 16px; margin-bottom: 24px;">
            Merci de vous être inscrit sur <strong>Notre plateforme</strong>.<br />
            Pour activer votre compte, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
          </p>

          <a href="${confirmUrl}"
             style="display: inline-block; padding: 14px 28px; font-size: 16px;
                    background-color: #2563eb; color: #fff; text-decoration: none;
                    border-radius: 8px; font-weight: bold; transition: background 0.3s;">
            Confirmer mon email
          </a>

          <p style="font-size: 14px; margin-top: 32px; color: #555;">
            Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :
          </p>

          <p style="word-break: break-all; font-size: 14px; color: #2563eb;">
            ${confirmUrl}
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #777;">
          © ${new Date().getFullYear()} Notre plateforme. Tous droits réservés.
        </div>

      </div>
    </div>
  `;
}
