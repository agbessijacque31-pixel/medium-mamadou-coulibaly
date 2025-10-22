// /src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import { getVerificationEmailTemplate } from "@/lib/emailTemplates";
import { requireAdmin } from "@/lib/adminOnly";
export async function POST(req: Request) {
        await requireAdmin();
    
    try {
        const { name, email, password } = await req.json();
        console.log("POST /register payload:", { name, email });

        if (!name || !email || !password) {
            console.warn("Champs requis manquants");
            return NextResponse.json(
                { error: "Champs requis manquants" },
                { status: 400 }
            );
        }

        // Vérifie si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json(
                { error: "Cet email est déjà utilisé" },
                { status: 400 }
            );
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Génère un token de vérification
        const verificationToken = Buffer.from(email + Date.now()).toString("base64");

        // Crée l'utilisateur
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, token: verificationToken },
        });

        // URL de confirmation
        const confirmUrl = `${process.env.NEXT_PUBLIC_URL_SITE_BASE}/verify-email?token=${verificationToken}&email=${email}`;

        // Envoi de l'email

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // ton email
                pass: process.env.EMAIL_PASS, // mot de passe ou App Password
            },
        });

        // Contenu de l’email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Confirmez votre adresse email, ${name}`,
            html: getVerificationEmailTemplate(name, confirmUrl),
        };

        // Envoi
        await transporter.sendMail(mailOptions);


        return NextResponse.json({
            message:
                "Utilisateur créé avec succès. Vérifiez votre email pour confirmer le compte.",
            user,
        });
    } catch (error) {
        console.error("Erreur POST /register:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
