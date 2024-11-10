import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { 
      name, description, nameRu, nameKg, descriptionRu, descriptionKg, 
      price, weight, categoryId, colorId, sizeId, images, isFeatured, isArchived 
    } = body;

    // Input validation
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!description) return new NextResponse("Description is required", { status: 400 });
    if (!price) return new NextResponse("Price is required", { status: 400 });
    if (!weight) return new NextResponse("Weight is required", { status: 400 });
    if (!categoryId) return new NextResponse("Category id is required", { status: 400 });
    if (!colorId) return new NextResponse("Color id is required", { status: 400 });
    if (!images || !images.length) return new NextResponse("Images are required", { status: 400 });

    const storeByUserId = await prismadb.store.findUnique({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("You are not authorized to manage this store", { status: 403 });
    }

    const product = await prismadb.product.create({
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
        sizeId: sizeId || null,  // If sizeId is optional, make sure to handle null
        isFeatured,
        isArchived,
        storeId: params.storeId,
        images: {
          createMany: {
            data: images.map((image: { url: string }) => image),
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("An error occurred while processing the request.", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const categories = searchParams.getAll("categoryId");
    const colors = searchParams.getAll("colorId") || undefined;
    const sizes = searchParams.getAll("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    const lang = searchParams.get("lang") || "en"; // Default to English if no language is specified

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId: categories.length > 0 ? { in: categories } : undefined,
        colorId: colors.length > 0 ? { in: colors } : undefined,
        sizeId: sizes.length > 0 ? { in: sizes } : undefined,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Modify products for multilingual support based on `lang`
    const updatedProducts = products.map((product) => {
      let productName = product.name || '';
      let productDescription = product.description || '';

      if (lang === "ru" && product.nameRu) {
        productName = product.nameRu;
      } else if (lang === "kg" && product.nameKg) {
        productName = product.nameKg;
      }

      if (lang === "ru" && product.descriptionRu) {
        productDescription = product.descriptionRu;
      } else if (lang === "kg" && product.descriptionKg) {
        productDescription = product.descriptionKg;
      }

      return { ...product, name: productName, description: productDescription };
    });

    return NextResponse.json(updatedProducts);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("An error occurred while processing the request.", { status: 500 });
  }
}
