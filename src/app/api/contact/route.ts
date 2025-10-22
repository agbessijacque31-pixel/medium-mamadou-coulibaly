import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminOnly";




// GET: Récupérer tous les messages
export async function GET() {
      await requireAdmin();
  
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" }, // du plus récent au plus ancien
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des messages :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
      await requireAdmin();

  try {
    const { name, email, subject, message } = await req.json();

    // 1️⃣ Enregistrement en base
    const savedMessage = await prisma.message.create({
      data: { name, email, subject, message },
    });

    // 2️⃣ Transport SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3️⃣ Email pour TOI (Maître Moussa)
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 Nouveau message : ${subject}`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; color: #333;">
          <div style="background: #f5f7fa; padding: 20px; border-radius: 15px; border: 1px solid #e0e0e0;">
            <h2 style="color: #0ea5e9;">📩 Nouveau message de ${name}</h2>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Sujet :</strong> ${subject}</p>
            <p><strong>Message :</strong></p>
            <p style="background: #e0f7fa; padding: 15px; border-radius: 10px;">${message}</p>
            <hr style="margin: 20px 0; border-color: #cbd5e1;" />
            <p style="font-size: 14px; color: #666;">Message envoyé depuis le site officiel de Maître Mamadou Coulibaly</p>
          </div>
        </div>
      `,
    });

    // 4️⃣ Email automatique pour l’UTILISATEUR
    await transporter.sendMail({
      from: `"Maître Mamadou Coulibaly" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Votre message a bien été reçu",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; color: #333;">
          <div style="background: #f0fdf4; padding: 20px; border-radius: 15px; border: 1px solid #d1fae5;">
            <h2 style="color: #22c55e;">✅ Bonjour ${name}</h2>
            <p>Merci pour votre message concernant <strong>"${subject}"</strong>.</p>
            <p>Je l’ai bien reçu et vous répondrai dans les plus brefs délais.</p>
            <p style="margin-top: 20px;">🙏 Avec respect, <br/> <strong>Maître Mamadou Coulibaly</strong></p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data: savedMessage });
  } catch (error) {
    console.error("Erreur d’envoi d’email ou enregistrement en base:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
