"use client";

import LoginForm from "./LoginForm";

export default function LoginFormWrapper() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4">
      <div className="text-center absolute top-10">
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-400">
          Bienvenue chez{" "}
          <span className="text-orange-500 hover:text-orange-600 transition">
            {siteName}
          </span>
        </h1>
        <p className="mt-2 text-gray-200">
          Connectez-vous pour accéder à votre espace sécurisé
        </p>
      </div>

      <LoginForm />
    </section>
  );
}
