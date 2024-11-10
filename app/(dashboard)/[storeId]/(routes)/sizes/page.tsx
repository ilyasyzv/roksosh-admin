import React from "react";
import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import SizeClient from "./components/client";
import { SizeColumn } from "./components/columns";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedSizes: SizeColumn[] = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(new Date(size.createdAt), "MMMM do, yyyy"),
  }));

  return <SizeClient data={formattedSizes} />;
};

export default SizesPage;
