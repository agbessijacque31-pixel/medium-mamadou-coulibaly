"use client";

import { ArticleDTO } from "../../../types/articles-type";
import { ReactNode } from "react";
import ArticleCard from "./ArticleCard";

type Props = {
    content: {
        h1: string;
        h2: string;
        description1: string;
        description2?: string | null;
        photo1: string;
        photo2?: string | null;
    };
    articles: ArticleDTO[];
    sidebar: ReactNode; // Injecte le sidebar depuis le serveur
};

export default function BlogClient({ content, articles, sidebar }: Props) {
    return (
        <div className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 gap-12">
            {/* Header */}
            <div className="text-center flex flex-col gap-4">
                <h1 className="text-3xl md:text-5xl font-extrabold">
                    {content.h1}
                </h1>
                <p className="text-lg md:text-xl mb-8 text-purple-200 leading-relaxed">
                    {content.description1}
                </p>
            </div>

            {/* Layout principal */}
            <div className="flex flex-col lg:flex-row gap-10">
                {/* Liste des articles */}
                <section className="flex-1 flex flex-wrap gap-8" >
                    {articles.map((article) => (
                        <div key={article.slug} className="flex-1 min-w-[280px]">
                            <ArticleCard article={article} />
                        </div>
                    ))}
                </section>

                {/* Sidebar injectée depuis le serveur */}
                <aside className="w-full lg:w-1/4">{sidebar}</aside>
            </div>
        </div>
    );
}
