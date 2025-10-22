"use client";

import { ArticleDTO } from "../../../types/articles-type";
import Link from "next/link";
import Image from "next/image";

import { ReactNode } from "react";
import ContactArticle from "../Contact/ContactArticle";

type Props = {
    article: ArticleDTO;
    articles: ArticleDTO[];
    sidebar: ReactNode; // Injecte le sidebar depuis le serveur
};

export default function BlogClientSlug({ article, articles, sidebar }: Props) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* --- Article principal --- */}
            <article className="lg:col-span-3 space-y-10">
                {/* Header */}
                <header>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
                        {article.title}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {new Date(article.updatedAt).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                    <Image
                        src={article.coverImage?.url || "/default-cover.jpg"}
                        alt={article.title}
                        width={1200}
                        height={600}
                        className="w-full h-80 object-cover rounded-2xl mt-6 shadow-md"
                    />
                </header>

                {/* Sections */}
                <div className="space-y-16">
                    {article.content.sections.map((section, index) => (
                        <div
                            key={index}
                            className="grid md:grid-cols-2 gap-8 items-center"
                        >
                            {/* Image */}
                            <div className={`${index % 2 === 1 ? "md:order-2" : "md:order-1"}`}>
                                <Image
                                    src={
                                        typeof section.image === "string"
                                            ? section.image
                                            : section.image?.url || "/default-cover.jpg"
                                    }
                                    alt={section.subtitle}
                                    width={600}
                                    height={400}
                                    className="w-full h-64 object-cover rounded-2xl shadow-md"
                                />

                            </div>

                            {/* Texte */}
                            <div className={`${index % 2 === 1 ? "md:order-1" : "md:order-2"}`}>
                                <h2 className="text-2xl font-bold text-cyan-700 mb-4">
                                    {section.subtitle}
                                </h2>
                                <p className="text-slate-700 leading-relaxed">{section.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Conclusion */}
                <div className="bg-slate-100 p-6 rounded-2xl shadow-md">
                    <h2 className="text-2xl font-bold text-cyan-700 mb-4">En Conclusion</h2>
                    <p className="text-slate-700 leading-relaxed">{article.conclusion}</p>
                    <ContactArticle />
                </div>

                {/* Articles similaires */}
                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">
                        Autres articles
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((a) => (
                            <Link
                                key={a.slug}
                                href={`/rituels/${a.slug}`}
                                className="block bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
                            >
                                <Image
                                    src={a.coverImage?.url || "/default-cover.jpg"}
                                    alt={a.title}
                                    width={400}
                                    height={250}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h4 className="text-lg font-semibold text-slate-800 mb-2">
                                        {a.title}
                                    </h4>
                                    <p className="text-sm text-slate-600">{a.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </article>

            {/* --- Sidebar enrichi --- */}
            <aside className="">{sidebar}</aside>

        </div>
    );
}
