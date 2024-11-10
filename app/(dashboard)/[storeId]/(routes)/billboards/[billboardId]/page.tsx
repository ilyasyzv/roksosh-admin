import React from "react";

import prismadb from "@/lib/prismadb";
import { Billboard } from "./components/billboard";

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const billboard = await prismadb.billboard.findUnique({
    where: { id: params.billboardId },
  });

  return <Billboard initialData={billboard} />;
};

export default BillboardPage;
