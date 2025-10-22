"use client";

import { cloudinaryLoader } from "@/lib/cloudinaryLoader";
import Image from "next/image";
import { TexteTemoignageDTO } from "../../../types/articles-type";

interface Props {
  temoignagestext: TexteTemoignageDTO[];
}

export default function TemoignagesSection({temoignagestext}: Props) {


  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-text">
            Témoignages de nos clients
          </h2>
          <p className="mt-3 text-lg">
            Découvrez comment <span className="font-semibold">Medium Mamadou Coulibaly</span> a transformé la vie de nombreuses personnes à travers le monde.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {temoignagestext.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4 mb-4">
                {t.photo?.url ? (
                  <Image
                    loader={cloudinaryLoader}
                    src={t.photo.url}
                    alt={`Photo de ${t.name}`}
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-gray-200"
                    sizes="(max-width: 640px) 48px, (max-width: 1024px) 56px, 64px"
                    priority={false}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-gray-200" />
                )}
                <div>
                  <p className="font-semibold text-gray-800">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.pays}</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">“{t.description}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
