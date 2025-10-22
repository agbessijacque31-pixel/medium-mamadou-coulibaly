"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type StatusType =
  | { type: "loading"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<StatusType>({
    type: "loading",
    message: "Vérification en cours...",
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus({ type: "error", message: "Paramètres manquants." });
      return;
    }

    fetch("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token, email }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus({
            type: "success",
            message: data.message || "Vérification réussie ✅",
          });
          setTimeout(() => router.push("/login"), 2000);
        } else {
          setStatus({
            type: "error",
            message: data.error || "Erreur lors de la vérification.",
          });
        }
      })
      .catch(() =>
        setStatus({
          type: "error",
          message: "Erreur réseau, veuillez réessayer.",
        })
      );
  }, [searchParams, router]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Vérification de votre e-mail</h1>

        {status.type === "loading" && (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 border-4 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">{status.message}</p>
          </div>
        )}

        {status.type === "success" && (
          <p className="text-green-600 font-medium">{status.message}</p>
        )}

        {status.type === "error" && (
          <p className="text-red-600 font-medium">{status.message}</p>
        )}
      </div>
    </section>
  );
}
