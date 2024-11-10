import React from "react";
import { redirect } from "next/navigation";
import { auth, UserButton } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

import MainNav from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <header className="border-b">
      <div className="container flex items-center justify-between gap-x-4 p-4 sm:px-8">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <StoreSwitcher items={stores} />
          <MainNav className="py-2" />
        </nav>
        <span className="flex flex-row items-center gap-3 self-start sm:self-auto">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </span>
      </div>
    </header>
  );
};

export default Navbar;
