import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

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
      return new NextResponse("At least one name (name, nameRu, or nameKg) is required", { status: 400 });
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

    const size = await prismadb.size.create({
      data: {
        name,
        nameRu,
        nameKg,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("[SIZES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; lang?: string } },
) {
  try {
    const lang = params.lang || "en"; // Default to English if lang param is not provided
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    // Modify size data for multilingual support
    const modifiedSizes = sizes.map(size => {
      const sizeName = lang === "ru" && size.nameRu ? size.nameRu : lang === "kg" && size.nameKg ? size.nameKg : size.name;
      return { ...size, name: sizeName };
    });

    return NextResponse.json(modifiedSizes);
  } catch (error) {
    console.error("[SIZES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
