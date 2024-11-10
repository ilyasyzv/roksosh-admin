import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

// GET method to fetch a color with multilingual support
export async function GET(
  _req: Request,
  { params }: { params: { colorId: string; lang: string } },
) {
  try {
    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: { id: params.colorId },
    });

    // Return color with the language-specific name
    let name = color?.name;
    if (params.lang === "ru" && color?.nameRu) {
      name = color.nameRu;
    } else if (params.lang === "kg" && color?.nameKg) {
      name = color.nameKg;
    }

    return NextResponse.json({ ...color, name });
  } catch (error) {
    console.error("[COLOR_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PATCH method to update a color with multilingual support
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, nameRu, nameKg, value } = body;

    if (!name && !nameRu && !nameKg) {
      return new NextResponse("At least one name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findUnique({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const color = await prismadb.color.update({
      where: { id: params.colorId },
      data: { name, nameRu, nameKg, value },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error("[COLOR_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE method to delete a color (no changes needed for multilingual)
export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; colorId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findUnique({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const color = await prismadb.color.delete({
      where: { id: params.colorId },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error("[COLOR_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
