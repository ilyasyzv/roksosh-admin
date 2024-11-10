import React from "react";

import prismadb from "@/lib/prismadb";
import { Color } from "./components/color";

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  const color = await prismadb.color.findUnique({
    where: { id: params.colorId },
  });

  return <Color initialData={color} />;
};

export default ColorPage;
