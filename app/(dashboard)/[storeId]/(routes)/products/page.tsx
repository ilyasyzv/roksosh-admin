import React from "react";
import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import ProductClient from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: formatter.format(product.price.toNumber()),
    weight: product.weight.toNumber(),
    category: product.category?.name || "Unknown", // Use fallback if category is null or undefined
    size: product.size?.name || "Unknown", // Use fallback if size is null or undefined
    color: product.color?.name || "Unknown", // Use fallback if color is null or undefined
    createdAt: format(new Date(product.createdAt), "MMMM do, yyyy"),
  }));

  return <ProductClient data={formattedProducts} />;
};

export default ProductsPage;
