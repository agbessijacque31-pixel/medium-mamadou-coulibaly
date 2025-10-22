"use client";

import { Mail, Phone, Clock, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ContactArticle() {
return (
  <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-purple-950/70 via-indigo-900/60 to-blue-900/70 backdrop-blur-lg border border-purple-500/20 shadow-2xl rounded-3xl p-10 space-y-8">
    
    {/* Titre */}
    <h2 className="text-4xl font-extrabold text-center tracking-tight">
      <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
        Contactez-moi
      </span>
    </h2>

    {/* Email */}
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
      <Mail className="w-7 h-7 text-yellow-400" />
      <Link
        href="mailto:mediummamadoucoulibaly@gmail.com"
        className="text-purple-100 font-medium hover:text-yellow-400 transition"
      >
        mediummamadoucoulibaly@gmail.com
      </Link>
    </div>

    {/* Téléphone */}
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
      <Phone className="w-7 h-7 text-yellow-400" />
      <Link
        href="tel:+2290162239983"
        className="text-purple-100 font-medium hover:text-yellow-400 transition"
      >
        +229 01 62 23 99 83
      </Link>
    </div>

    {/* WhatsApp */}
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
      <MessageCircle className="w-7 h-7 text-green-400" />
      <Link
        href="https://wa.me/2290162239983"
        target="_blank"
        className="text-purple-100 font-medium hover:text-green-400 transition"
      >
        WhatsApp : +2290162239983
      </Link>
    </div>

    {/* Disponibilité */}
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
      <Clock className="w-7 h-7 text-yellow-400" />
      <p className="text-purple-200 italic">
        Disponible <span className="font-semibold text-yellow-400">7j/7</span> — Réponse rapide garantie
      </p>
    </div>

    {/* Attestations */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="overflow-hidden rounded-2xl border border-purple-500/30 shadow-lg">
        <Image
          src="/image/coulibaly-mamadou-attestation.jpg"
          alt="Attestation Medium Mamadou Coulibaly"
          width={600}
          height={600}
          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="overflow-hidden rounded-2xl border border-purple-500/30 shadow-lg">
        <Image
          src="/image/attestation-mamadou-coulibaly.jpg"
          alt="Attestation Medium Mamadou Coulibaly"
          width={600}
          height={600}
          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  </div>
);


}
