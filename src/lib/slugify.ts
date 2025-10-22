import { customAlphabet } from "nanoid";

// lib/slugify.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")               // supprime les accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")           // espaces → tirets
    .replace(/[^a-z0-9-]/g, "")     // supprime caractères spéciaux
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}



// alphabet : lettres + chiffres, longueur 6
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);

export function generateSlug(text: string, forceUnique = false): string {
  const baseSlug = slugify(text);

  // si forceUnique = true → on rajoute un identifiant court
  return forceUnique ? `${baseSlug}-${nanoid()}` : baseSlug;
}