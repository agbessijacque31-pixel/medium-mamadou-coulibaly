import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BlogLayout from "@/components/Admin/BlogLayout";

type Category = {
    name: string;
    articles: {
        id: string | number;
        slug: string;
        title: string;
        description: string;
        coverImage?: ImageValue;
    }[];
};

type Article = {
    slug: string;
    title: string;
    description: string;
    coverImage?: ImageValue;
};

type CategoryPageProps = {
    category: Category | null;
    articlesAll: Article[];
    content: PageEntity;
    seoData: SEOProps;
    redirectPath?: string;
    tag:{ id: string; name: string; slug: string }[];
};

import { generateJSONLD, SEOProps } from "@/lib/seo";
import { PageEntity } from "../../../types/page-type";
import { ImageValue } from "../../../types/articles-type";

export default function CategoryPage({
    category,
    articlesAll,
    content,
    seoData,
    redirectPath = "/rituels",
    tag,
}: CategoryPageProps) {
    if (!category) {
        redirect(redirectPath);
    }

    return (
        <>
            <BlogLayout content={content} tags={tag}>
                <article className="lg:col-span-3 space-y-10">
                    {/* Articles de la catégorie */}
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold mb-6 text-center">
                            Articles dans la catégorie : {category?.name}
                        </h1>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {category?.articles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/rituels/${article.slug}`}
                                    className="block bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden"
                                >
                                    {article.coverImage?.url && (
                                        <Image
                                            src={article.coverImage.url}
                                            alt={article.title}
                                            className="w-full h-48 object-cover"
                                            width={400}
                                            height={192}
                                        />
                                    )}
                                    <div className="p-4">
                                        <h2 className="mb-2 text-2xl font-bold bg-gradient-text">{article.title}</h2>
                                        <p className="mb-3 text-black">{article.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Articles similaires */}
                    <div className="mt-16">
                        <h3 className="text-2xl font-bold bg-gradient-text mb-6">Autres articles</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articlesAll.map((a) => (
                                <Link
                                    key={a.slug}
                                    href={`/rituels/${a.slug}`}
                                    className="block bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
                                >
                                    <Image
                                        src={a.coverImage?.url ?? "/default-cover.jpg"}
                                        alt={a.title}
                                        width={400}
                                        height={250}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-4">
                                        <h4 className="text-2xl font-bold bg-gradient-text mb-2">{a.title}</h4>
                                        <p className="text-black">{a.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </article>
            </BlogLayout>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: generateJSONLD(seoData) }}
            />
        </>
    );
}
