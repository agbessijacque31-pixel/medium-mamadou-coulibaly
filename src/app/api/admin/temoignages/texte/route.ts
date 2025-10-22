import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/adminOnly";

// ---------------------------
// GET /api/admin/temoignages/texte
// ---------------------------
// export async function GET(req: NextRequest) {
//     await requireAdmin();

//     try {
//         const { searchParams } = new URL(req.url);
//         const page = Number(searchParams.get("page")) || 1;
//         const limit = Number(searchParams.get("limit")) || 10;
//         const skip = (page - 1) * limit;

//         const category = searchParams.get("category");
//         const pays = searchParams.get("pays");
//         const search = searchParams.get("search");

//         const where: Prisma.TemoignagesTexteWhereInput = {};

//         if (category) {
//             where.category = { equals: category, mode: "insensitive" };
//         }

//         if (pays) {
//             where.pays = { equals: pays, mode: "insensitive" };
//         }

//         if (search) {
//             where.OR = [
//                 { name: { contains: search, mode: "insensitive" } },
//                 { description: { contains: search, mode: "insensitive" } },
//                 { category: { contains: search, mode: "insensitive" } },
//                 { pays: { contains: search, mode: "insensitive" } },
//             ];
//         }

//         const [temoignages, total] = await Promise.all([
//             prisma.temoignagesTexte.findMany({
//                 where,
//                 skip,
//                 take: limit,
//                 orderBy: { createdAt: "desc" },
//             }),
//             prisma.temoignagesTexte.count({ where }),
//         ]);

//         return NextResponse.json({
//             success: true,
//             data: temoignages,
//             pagination: {
//                 total,
//                 page,
//                 limit,
//                 totalPages: Math.ceil(total / limit),
//             },
//         });

//     } catch (err: unknown) {
//         console.error(err);
//         return NextResponse.json(
//             { message: err instanceof Error ? err.message : "Erreur serveur" },
//             { status: 500 }
//         );
//     }
// }



export async function GET(_req: NextRequest) {
  await requireAdmin();

  try {
    const temoignages = await prisma.temoignagesTexte.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: temoignages,
    });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}


// ---------------------------
// POST /api/admin/temoignages/texte
// ---------------------------
export async function POST(req: NextRequest) {
    await requireAdmin();
    try {
        const formData = await req.formData();

        const name = formData.get("name") as string;
        const category = formData.get("category") as string;
        const description = formData.get("description") as string;
        const pays = formData.get("pays") as string;

        // --- Photo ---
        let photoJson: Prisma.InputJsonValue | typeof Prisma.JsonNull = Prisma.JsonNull;
        const photoFile = formData.get("photo");

        if (photoFile instanceof File) {
            const uploaded = await uploadImage(photoFile, "temoignages/texte");
            photoJson = {
                url: uploaded.secure_url,
                publicId: uploaded.public_id,
            };
        }

        const temoignage = await prisma.temoignagesTexte.create({
            data: {
                name,
                category,
                description,
                pays,
                photo: photoJson,
            },
        });

        return NextResponse.json(temoignage, { status: 201 });
    } catch (err: unknown) {
        console.error(err);
        return NextResponse.json(
            { message: err instanceof Error ? err.message : "Erreur serveur" },
            { status: 500 }
        );
    }
}
