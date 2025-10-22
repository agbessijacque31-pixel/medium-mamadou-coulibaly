import { z } from "zod";

// ⚡ Preprocess pour convertir string/Date en Date | null
const publishedAtSchema = z.preprocess(
  (val) => {
    if (!val) return null;
    if (val instanceof Date) return val;
    if (typeof val === "string" && !isNaN(Date.parse(val))) return new Date(val);
    return null;
  },
  z.date().nullable()
) as z.ZodType<Date | null>;

export const articleFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, "Le titre doit faire au moins 3 caractères"),
  slug: z.string().min(3, "Le slug doit faire au moins 3 caractères"),
  description: z.string().min(10, "La description est trop courte"),
  conclusion: z.string().min(10, "La conclusion est trop courte"),
  metaTitre: z.string().min(10, "Le meta titre est trop court"),
  metaDescription: z.string().min(10, "La meta description est trop courte"),

  // ✅ Cover image : objet Cloudinary ou File
  coverImage: z
    .union([
      z
        .object({
          url: z.string().url("URL d’image invalide").nullable(),
          publicId: z.string().nullable(),
        })
        .nullable(),
      z.instanceof(File),
    ])
    .optional(),

  categoryId: z.union([z.number().int().positive(), z.literal("")]),
  tags: z.array(z.string().min(1, "Chaque tag doit avoir un nom")),
  published: z.boolean(),
  publishedAt: publishedAtSchema,

  content: z.object({
    sections: z
      .array(
        z.object({
          subtitle: z.string().min(1, "Le sous-titre est requis"),
          text: z.string().min(1, "Le texte est requis"),
          image: z
            .union([
              z
                .object({
                  url: z.string().url("L’image doit être une URL valide").nullable(),
                  publicId: z.string().nullable(),
                })
                .nullable(),
              z.instanceof(File),
            ])
            .nullable()
            .optional(),
        })
      )
      .min(1, "Au moins une section est requise"),
  }),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;









// ✅ Schéma principal pour le formulaire de témoignage vidéo
export const videoTemoignageFormSchema = z.object({

  id: z.number().optional(),

  // 🔤 Texte de base
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  transcript: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),


  // 🎥 Vidéo principale : fichier ou URL
  videotemoi: z
    .union([
      z
        .object({
          url: z.string().url("URL d’image invalide").nullable(),
          publicId: z.string().nullable(),
        })
        .nullable(),
      z.instanceof(File),
    ]),
  // 🗣️ Sous-titres optionnels : fichier ou URL
  subtitlestemoi: z
    .union([
      z
        .object({
          url: z.string().url("URL d’image invalide").nullable(),
          publicId: z.string().nullable(),
        })
        .nullable(),
      z.instanceof(File),
    ]),

  thumbnailtemoi: z
    .union([
      z
        .object({
          url: z.string().url("URL d’image invalide").nullable(),
          publicId: z.string().nullable(),
        })
        .nullable(),
      z.instanceof(File),
    ])
    .optional(),

  webmtemoi: z
    .union([
      z
        .object({
          url: z.string().url("URL d’image invalide").nullable(),
          publicId: z.string().nullable(),
        })
        .nullable(),
      z.instanceof(File),
    ])
    .optional(),




});

// ✅ Type TypeScript dérivé
export type VideoTemoignageFormValues = z.infer<typeof videoTemoignageFormSchema>;






// ✅ Schéma principal pour le formulaire de témoignage texte
export const temoignageTexteFormSchema = z.object({
  id: z.number().optional(),

  // 🧍 Informations principales
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  category: z.string().min(2, "La catégorie est requise"),
  description: z.string().min(5, "La description doit contenir au moins 5 caractères"),
  pays: z.string().min(2, "Le pays est requis"),

  // 🖼️ Photo (fichier ou objet Cloudinary)
  photo: z
    .union([
      z
        .object({
          url: z.string().url("URL d’image invalide").nullable(),
          publicId: z.string().nullable(),
        })
        .nullable(),
      z.instanceof(File),
    ])
    .optional()
    .nullable(),
});

// ✅ Type TypeScript dérivé
export type TemoignageTexteFormValues = z.infer<typeof temoignageTexteFormSchema>;
