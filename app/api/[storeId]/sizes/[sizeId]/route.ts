import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  _req: Request,
  { params }: { params: { sizeId: string; lang?: string } },
) {
  try {
    const lang = params.lang || "en"; // Default to English if lang param is not provided
    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: { id: params.sizeId },
    });

    // Modify size data for multilingual support
    const sizeName = lang === "ru" && size?.nameRu ? size.nameRu : lang === "kg" && size?.nameKg ? size.nameKg : size?.name;

    return NextResponse.json({ ...size, name: sizeName });
  } catch (error) {
    console.error("[SIZE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, nameRu, nameKg, value } = body;

    if (!name && !nameRu && !nameKg) {
      return new NextResponse("At least one name (name, nameRu, or nameKg) is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findUnique({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const size = await prismadb.size.update({
      where: { id: params.sizeId },
      data: { 
        name,
        nameRu,
        nameKg,
        value 
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("[SIZE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; sizeId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findUnique({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const size = await prismadb.size.delete({
      where: { id: params.sizeId },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("[SIZE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
