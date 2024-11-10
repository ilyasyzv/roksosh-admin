import React from "react";

import prismadb from "@/lib/prismadb";
import { Category } from "./components/category";

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const category = await prismadb.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return <Category billboards={billboards} initialData={category} />;
};

export default CategoryPage;
