"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phone: string; // numéro WhatsApp (ex: 2290152027185)
  label?: string; // texte affiché au-dessus
}

export default function WhatsAppButton({ phone, label }: WhatsAppButtonProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col sm:flex-row items-center sm:items-end gap-2 sm:gap-3">
      {/* Texte au-dessus */}
      {label && (
        <span className="hidden sm:block animate-bounce bg-emerald-700 text-white text-xs sm:text-sm px-3 py-2 rounded-2xl shadow-md text-center leading-snug">
          {label}
        </span>
      )}

      <Link
        href={`https://wa.me/${phone}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ouvrir WhatsApp"
        className="group relative block"
      >
        {/* Ondes animées */}
        <span
          className="pointer-events-none absolute inset-0 -m-2 rounded-full bg-green-500/30 animate-ping"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute inset-0 -m-4 rounded-full bg-green-500/20 animate-ping"
          style={{ animationDelay: "0.9s" }}
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute inset-0 -m-6 rounded-full ring-2 ring-green-400/30 animate-ping"
          style={{ animationDelay: "1.8s" }}
          aria-hidden="true"
        />

        {/* Bouton principal */}
        <span className="relative inline-flex items-center justify-center bg-green-500 text-white p-4 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-400/50">
          <MessageCircle className="w-6 h-6" />
          <span className="sr-only">Contacter sur WhatsApp</span>
        </span>
      </Link>
    </div>
  );
}
