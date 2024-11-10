import React from "react";

import prismadb from "@/lib/prismadb";
import { Size } from "./components/size";

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
  const size = await prismadb.size.findUnique({
    where: { id: params.sizeId },
  });

  return <Size initialData={size} />;
};

export default SizePage;
