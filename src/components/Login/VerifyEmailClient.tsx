"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailClient() {
  const [status, setStatus] = useState("Vérification en cours...");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("Paramètres manquants");
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
          setStatus(data.message || "Vérification réussie !");
          setTimeout(() => router.push("/login"), 1000);
        } else {
          setStatus(data.error || "Erreur inconnue");
        }
      })
      .catch(() => setStatus("Erreur réseau"));
  }, [searchParams, router]);

  return <div className="text-center mt-20">{status}</div>;
}
