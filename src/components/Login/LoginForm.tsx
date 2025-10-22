"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, User, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const successParam = searchParams.get("success");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(!!successParam);
  const [showPassword, setShowPassword] = useState(false);

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Mon Site";

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/admin");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/95 shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6 backdrop-blur-sm"
    >
      <h2 className="text-2xl font-bold text-center text-indigo-900">
        Connexion –{" "}
        <span className="text-orange-500 hover:text-orange-600 transition">
          {siteName}
        </span>
      </h2>

      {/* ✅ Message succès */}
      {showSuccess && (
        <div className="bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-lg text-sm text-center transition-opacity duration-1000">
          Votre compte a été confirmé avec succès 🎉 Connectez-vous maintenant.
        </div>
      )}

      {/* ❌ Message d’erreur */}
      {error && (
        <div className="bg-orange-600/20 text-orange-600 px-4 py-2 rounded-lg text-sm text-center transition-opacity duration-500">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Champ email */}
        <div className="relative">
          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            required
            placeholder="Adresse e-mail"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
          />
        </div>

        {/* Champ password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            placeholder="Mot de passe"
            className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-indigo-900 transition"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Bouton submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition disabled:opacity-70 shadow-md"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" /> Connexion...
          </>
        ) : (
          "Se connecter"
        )}
      </button>

      {/* Lien inscription */}
      <p className="text-center text-sm text-gray-600">
        Pas encore de compte ?{" "}
        <Link
          href="/register"
          className="text-yellow-400 hover:text-orange-500 font-medium transition"
        >
          Inscrivez-vous
        </Link>
      </p>
    </form>
  );
}
