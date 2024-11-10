import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

// POST method to create a color with multilingual support
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
    const { name, nameRu, nameKg, value } = body;

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
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

    const color = await prismadb.color.create({
      data: {
        name,
        nameRu,
        nameKg,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error("[COLORS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// GET method to fetch colors with multilingual support
export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; lang: string } },
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    // Return colors with language-specific names
    const colorsWithLangNames = colors.map(color => {
      let name = color.name;
      if (params.lang === "ru" && color.nameRu) {
        name = color.nameRu;
      } else if (params.lang === "kg" && color.nameKg) {
        name = color.nameKg;
      }

      return { ...color, name };
    });

    return NextResponse.json(colorsWithLangNames);
  } catch (error) {
    console.error("[COLORS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
