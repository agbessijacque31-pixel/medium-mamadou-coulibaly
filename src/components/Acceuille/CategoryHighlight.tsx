import Image from 'next/image';
import Link from "next/link";
import React from "react";
import type { Service } from "../MenuLinks/menuLinks"; // import type-only (recommandé)

interface CategoryHighlightProps {
    imageSrc: string;
    imageAlt: string;
    title: string;
    categories: Service[]; // <-- utiliser un tableau du type Service
}

export default function CategoryHighlight({ imageSrc, imageAlt, title, categories }: CategoryHighlightProps) {
    return (
        <section className="py-12 md:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Conteneur principal avec disposition flexible/grille */}
                <div className="flex flex-col md:flex-row items-center md:items-start bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">

                    {/* Bloc de l'Image (Gauche) */}
                    <div className="w-full md:w-1/2 aspect-video md:aspect-square relative flex-shrink-0">
                        {/* L'utilisation de next/image est optimisée pour Next.js */}
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            fill // Remplir le conteneur parent
                            style={{ objectFit: 'cover' }} // S'assurer que l'image couvre bien la zone
                            className="transition-transform duration-500 hover:scale-105" // Effet de survol
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority // Optionnel: Charger l'image plus rapidement
                        />
                    </div>

                    {/* Bloc du Contenu/Catégories (Droite) */}
                    <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-12">

                        {/* Titre de la section */}
                        <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-text dark:text-purple-400 mb-6 border-b-2 border-yellow-500/50 pb-2">
                            {title}
                        </h2>

                        {/* Liste à puces des Catégories */}
                        <ul className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
                            {categories.map((category, index) => (
                                <li
                                    key={index}
                                    className="flex items-start group transition-all duration-300 hover:pl-2"
                                >
                                    <span className="text-yellow-500 font-bold text-xl mr-3 transform group-hover:rotate-6 transition-transform duration-300">
                                        {category.icon}
                                    </span>
                                    <Link
                                        href={category.link}
                                        className="font-medium hover:text-purple-600 dark:hover:text-purple-300 transition-colors duration-300"
                                    >
                                        {category.title} 
                                    </Link>
                                </li>
                            ))}
                        </ul>


                        {/* Bouton d'action facultatif */}
                        <div className="mt-10">
                            <Link
                                href="/rituels"
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 transition-colors transform hover:scale-[1.02]"
                            >
                                Voir tous les Services
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- EXEMPLE D'UTILISATION (dans une autre page ou composante parent) ---
/*
  
  import CategoryHighlight from './CategoryHighlight';

  const services = [
    { label: "Retour Affectif", href: "/services/retour-affectif" },
    { label: "Protection Spirituelle", href: "/services/protection" },
    { label: "Chance et Prospérité", href: "/services/chance" },
    { label: "Désenvoutement", href: "/services/desenvoutement" },
    { label: "Réussite Professionnelle", href: "/services/reussite" },
         { label: "Retour Affectif", href: "/services/retour-affectif" },
    { label: "Protection Spirituelle", href: "/services/protection" },
    { label: "Chance et Prospérité", href: "/services/chance" },
    { label: "Désenvoutement", href: "/services/desenvoutement" },
    { label: "Réussite Professionnelle", href: "/services/reussite" },
  ];

  <CategoryHighlight
    imageSrc="/images/marabout-traditionnel.jpg" // Assurez-vous d'avoir cette image dans le dossier /public
    imageAlt="Un marabout en tenue traditionnelle"
    title="Domaines d'Intervention et Catégories"
    categories={services}
  />
*/