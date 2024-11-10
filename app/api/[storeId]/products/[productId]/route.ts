import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(_req: Request, { params }: { params: { productId: string; lang: string } }) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: { id: params.productId },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });

    // Handle multilingual response based on the `lang` query parameter
    let productName = product?.name || '';
    let productDescription = product?.description || '';

    if (params.lang === "ru" && product?.nameRu) {
      productName = product.nameRu;
    } else if (params.lang === "kg" && product?.nameKg) {
      productName = product.nameKg;
    }

    if (params.lang === "ru" && product?.descriptionRu) {
      productDescription = product.descriptionRu;
    } else if (params.lang === "kg" && product?.descriptionKg) {
      productDescription = product.descriptionKg;
    }

    return NextResponse.json({ ...product, name: productName, description: productDescription });
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string; productId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, description, nameRu, nameKg, descriptionRu, descriptionKg, price, weight, categoryId, colorId, sizeId, images, isFeatured, isArchived } = body;

    if (!description && !descriptionRu && !descriptionKg) {
      return new NextResponse("At least one description is required", { status: 400 });
    }

    if (!name && !nameRu && !nameKg) {
      return new NextResponse("At least one name is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!weight) {
      return new NextResponse("Weight is required", { status: 400 });
    }

    if (!categoryId || !colorId || !sizeId) {
      return new NextResponse("Category, color, and size ids are required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findUnique({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const productExists = await prismadb.product.findUnique({
      where: { id: params.productId },
    });

    if (!productExists) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const updatedProduct = await prismadb.product.update({
      where: { id: params.productId },
      data: {
        name,
        description,
        nameRu,
        nameKg,
        descriptionRu,
        descriptionKg,
        price,
        weight,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        images: {
          createMany: {
            data: images.map((image: { url: string }) => image),
          },
        },
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { storeId: string; productId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findUnique({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prismadb.product.delete({
      where: { id: params.productId },
    });

    return NextResponse.json({ message: "Product deleted successfully", productId: product.id });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
