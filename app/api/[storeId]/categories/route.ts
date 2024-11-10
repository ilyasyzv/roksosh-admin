import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

// POST method to create a category with multilingual support
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, nameRu, nameKg, billboardId } = body;

    if (!billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    if (!name && !nameRu && !nameKg) {
      return new NextResponse("At least one name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findUnique({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const category = await prismadb.category.create({
      data: {
        name,
        nameRu,
        nameKg,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// GET method to fetch categories with multilingual support
export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; lang: string } },
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    // Return categories with the language-specific name
    const response = categories.map((category) => {
      let name = category.name;
      if (params.lang === "ru" && category.nameRu) {
        name = category.nameRu;
      } else if (params.lang === "kg" && category.nameKg) {
        name = category.nameKg;
      }

      return { ...category, name };
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
