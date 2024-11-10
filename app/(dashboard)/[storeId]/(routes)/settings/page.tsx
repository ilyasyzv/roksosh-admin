import React from "react";

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

import { Settings } from "./components/settings";

const SettingsPage = async ({ params }: { params: { storeId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: { id: params.storeId, userId: userId },
  });

  if (!store) {
    redirect("/");
  }

  return <Settings initialData={store} />;
};

export default SettingsPage;
