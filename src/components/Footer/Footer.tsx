// app/components/Footer.tsx

import { FaInstagram, FaYoutube, FaTiktok, FaEnvelope, FaPhone, FaMapMarkerAlt, FaDisease } from "react-icons/fa";
import WhatsAppButton from "../Contact/WhatsAppButton";
import { menuLinks } from "../MenuLinks/menuLinks";
import Link from "next/link";

export default function Footer() {

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Medium Marabout";
    const lab = `Contacter ${siteName}`;

    // Informations de contact factices - à remplacer par les vôtres
    const contactInfo = {
        phone: "+2290162239983",
        email: "contact@medium-mamadou-coulibaly.com",
        address: "Bénin, Afrique de l'Ouest", // Exemple de localisation
    };

    return (
        <footer className="relative z-40 bg-purple-950 text-white shadow-2xl shadow-purple-900/50">

            {/* Bouton WhatsApp flottant (conserver pour l'accessibilité) */}
            <WhatsAppButton phone="2290162239983" label={lab} />

            {/* Contenu principal du Footer */}
            <div className="max-w-7xl mx-auto px-6 py-16">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-b border-purple-700/50 pb-12">

                    {/* Section 1 : Logo / Citation & Services */}
                    <div className="col-span-2 md:col-span-1 text-center md:text-left">
                        <h3 className="text-3xl font-extrabold mb-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
                            {siteName}
                        </h3>
                        <p className="text-purple-300 italic text-sm leading-relaxed mb-4">
                            &ldquo;La puissance des ancêtres vous guide vers la lumière et la prospérité.&rdquo;
                        </p>

                        <h4 className="text-lg font-bold text-yellow-400 mt-6 mb-2">Nos Services Clés</h4>
                        <ul className="text-purple-200 text-sm space-y-1">
                            <li>Retour Affectif Rapide</li>
                            <li>Chance et Prospérité</li>
                            <li>Protection et Désenvoutement</li>
                        </ul>
                    </div>

                    {/* Section 2 : Liens rapides */}
                    <div className="text-center md:text-left">
                        <h4 className="text-xl font-semibold mb-5 border-b-2 border-yellow-400/50 inline-block pb-1">Navigation Rapide</h4>
                        <ul className="space-y-3 text-purple-200">
                            {
                                menuLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={link.href}
                                            className="hover:text-yellow-400 transition-colors text-base font-medium relative before:absolute before:w-1 before:h-1 before:rounded-full before:bg-yellow-400 before:-left-3 before:top-1/2 before:-translate-y-1/2 before:opacity-0 hover:before:opacity-100">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>

                    {/* Section 3 : Coordonnées */}
                    <div className="text-center md:text-left">
                        <h4 className="text-xl font-semibold mb-5 border-b-2 border-yellow-400/50 inline-block pb-1">Contactez-moi</h4>
                        <ul className="space-y-3 text-purple-200">
                            <li className="flex items-center justify-center md:justify-start gap-3">
                                <FaPhone className="text-yellow-400 min-w-4" />
                                <Link href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="hover:text-yellow-400 transition-colors text-base">{contactInfo.phone}</Link>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-3">
                                <FaEnvelope className="text-yellow-400 min-w-4" />
                                <Link href={`mailto:${contactInfo.email}`} className="hover:text-yellow-400 transition-colors text-base">{contactInfo.email}</Link>
                            </li>
                            <li className="flex items-start justify-center md:justify-start gap-3">
                                <FaMapMarkerAlt className="text-yellow-400 mt-1 min-w-4" />
                                <span className="text-base">{contactInfo.address}</span>
                            </li>
                            <li className='pt-2'>
                                <Link href="#appointment" className="inline-block px-4 py-2 bg-yellow-500 text-purple-900 font-bold rounded-full hover:bg-yellow-400 transition-colors text-sm shadow-lg">
                                    Prenez Rendez-vous
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Section 4 : Réseaux sociaux & Avertissement */}
                    <div className="text-center md:text-left">
                        <h4 className="text-xl font-semibold mb-5 border-b-2 border-yellow-400/50 inline-block pb-1">Suivez-moi</h4>
                        <div className="flex justify-center md:justify-start gap-5 text-yellow-400 text-2xl mb-8">
                            <Link href="https://www.tiktok.com/@harrystyle030?_t=ZM-90SmWwUPMbI&_r=1" aria-label="Facebook" className="hover:text-orange-500 transition-transform duration-300 hover:scale-110"><FaTiktok /></Link>
                            <Link href="https://www.instagram.com/fatimatandiayes?igsh=bjFvcnpwMWNmYjVz" aria-label="Instagram" className="hover:text-orange-500 transition-transform duration-300 hover:scale-110"><FaInstagram /></Link>
                            <Link href="https://www.youtube.com/@mamadoucoulibalys" aria-label="Youtube" className="hover:text-orange-500 transition-transform duration-300 hover:scale-110"><FaYoutube /></Link>
                            <Link href="https://www.youtube.com/@mamadoucoulibalys" aria-label="Youtube" className="hover:text-orange-500 transition-transform duration-300 hover:scale-110"><FaDisease /></Link>

                        </div>

                        <h4 className="text-lg font-bold text-red-400 mt-6 mb-2">Avertissement</h4>
                        <p className="text-purple-400 text-xs italic">
                            Les résultats peuvent varier d&apos;une personne à l&apos;autre. Le Maraboutage est un accompagnement spirituel et non un substitut aux soins médicaux ou conseils légaux.
                        </p>
                    </div>
                </div>

                {/* Copyright et Mentions Légales */}
                <div className="mt-8 pt-4 text-center text-purple-400 text-xs flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                    <p className="order-2 md:order-1">
                        © {new Date().getFullYear()} **{siteName}**. Tous droits réservés.
                    </p>
                    <div className="space-x-4 order-1 md:order-2">
                        <Link href="#" className="hover:text-yellow-400 transition-colors">Mentions Légales</Link>
                        <Link href="#" className="hover:text-yellow-400 transition-colors">Confidentialité</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}