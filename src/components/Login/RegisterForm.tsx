"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, User, Mail, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Mon Site";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      setSuccessMsg(
        "Inscription réussie ! Vérifiez votre email pour confirmer le compte."
      );

      setTimeout(() => {
        setSuccessMsg(null);
        router.push("/login?success=1");
      }, 5000);
    } catch (err) {
      setError(
        (err as Error).message || "Impossible de créer le compte. Réessayez."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/95 shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6 backdrop-blur-sm"
    >
      <h2 className="text-2xl font-bold text-center text-indigo-900">
        Inscription –{" "}
        <span className="text-orange-500 hover:text-orange-600 transition">
          {siteName}
        </span>
      </h2>

      {successMsg && (
        <div className="bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-lg text-sm text-center transition-opacity duration-1000">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="bg-orange-600/20 text-orange-600 px-4 py-2 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="name"
            required
            placeholder="Nom complet"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            required
            placeholder="Adresse e-mail"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
          />
        </div>

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

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition disabled:opacity-70 shadow-md"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" /> Inscription...
          </>
        ) : (
          "S'inscrire"
        )}
      </button>

      <p className="text-center text-sm text-gray-600">
        Déjà un compte ?{" "}
        <Link
          href="/login"
          className="text-yellow-400 hover:text-orange-500 font-medium transition"
        >
          Connectez-vous
        </Link>
      </p>
    </form>
  );
}
