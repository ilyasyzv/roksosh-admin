import React from "react";

import prismadb from "@/lib/prismadb";
import { Product } from "./components/product";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await prismadb.product.findUnique({
    where: { id: params.productId },
    include: { images: true },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <Product
      initialData={product}
      categories={categories}
      sizes={sizes}
      colors={colors}
    />
  );
};

export default ProductPage;
