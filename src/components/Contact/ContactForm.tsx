"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";

export default function ContactClient() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); // déclenche l'animation fade-in
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("✅ Votre message m’a bien été transmis.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        alert("❌ Une erreur est survenue, veuillez réessayer plus tard.");
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Impossible d’envoyer le message.");
    }
  };

  return (
    <div
      className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"
        }`}
    >
      {/* Header */}
      <header className="text-center mb-16">
        <h1 className="md:text-5xl font-extrabold text-2xl font-bold bg-gradient-text mb-4 animate-fadeIn">
          Contactez-moi directement
        </h1>
        <p className="text-lg text-white max-w-2xl mx-auto animate-fadeIn delay-150">
          Je suis <strong>Marabout Medium MAMADOU COULIBALY</strong>, grand voyant et médium
          traditionnel. Écrivez-moi dès aujourd’hui, votre demande restera
          strictement confidentielle.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-12">
        {/* --- Formulaire --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-8 space-y-6 animate-fadeIn delay-300"
        >
          {/** Nom **/}
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-2 font-semibold text-slate-700">
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Votre nom complet"
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition transform duration-200 hover:scale-105"
            />
          </div>

          {/** Email **/}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 font-semibold text-slate-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="mediummamadoucoulibaly@gmail.com"
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition transform duration-200 hover:scale-105"
            />
          </div>

          {/** Sujet **/}
          <div className="flex flex-col">
            <label htmlFor="subject" className="mb-2 font-semibold text-slate-700">
              Sujet
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              placeholder="Sujet de votre message"
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition transform duration-200 hover:scale-105"
            />
          </div>

          {/** Message **/}
          <div className="flex flex-col">
            <label htmlFor="message" className="mb-2 font-semibold text-slate-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Écrivez votre message ici..."
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition transform duration-200 hover:scale-105 resize-none"
            />
          </div>

          {/* Bouton Envoyer */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 
             bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 
             text-purple-900 font-bold py-3 rounded-lg 
             hover:scale-105 hover:brightness-110 transition-transform duration-200"
          >
            <Send className="w-5 h-5" /> Envoyer votre Message
          </button>

        </form>

        {/* --- Infos de contact --- */}
        <div className="space-y-8 animate-fadeIn delay-500">
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold bg-gradient-text mb-4">Mes coordonnées directes</h2>
            <ul className="space-y-4 text-slate-700">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 bg-gradient-text" />
                <span>+2290162239983</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 bg-gradient-text" />
                <span>contact@medium-mamadou-coulibaly.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 bg-gradient-text" />
                <span>Bénin – Consultation à distance possible partout</span>
              </li>
            </ul>
            <Image src="/image/coulibaly-mamadou-attestation.jpg" alt="Medium MAMADOU COULIBALY" width={600} height={600} />
            <Image src="/image/attestation-mamadou-coulibaly.jpg" alt="Medium MAMADOU COULIBALY" width={600} height={600} />
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl shadow-lg p-8 text-center transform transition-transform duration-200 hover:scale-105">
            <MessageCircle className="w-10 h-10 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Échangez avec moi sur WhatsApp</h3>
            <p className="mb-4">
              Je suis disponible à tout moment pour vous apporter une réponse rapide.
            </p>
            <Link
              href="https://wa.me/2290162239983"
              target="_blank"
              className="inline-block bg-white text-green-600 font-bold px-6 py-3 rounded-full hover:bg-slate-100 transition"
            >
              M’écrire sur WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
