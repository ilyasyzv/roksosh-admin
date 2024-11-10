"use client";

import React from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import Heading from "@/components/ui/heading";
import ApiList from "@/components/ui/api-list";
import { CategoryColumn, columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

const CategoryClient = ({ data }: { data: CategoryColumn[] }) => {
  const params = useParams();

  return (
    <React.Fragment>
      <div className="flex flex-wrap items-center justify-between gap-y-3">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage categories for your store"
        />

        <Button asChild className="min-w-fit">
          <Link href={`/${params.storeId}/categories/new`}>
            <Plus className="mr-2 w-4" />
            Add New
          </Link>
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <section>
        <Heading title="API" description="API calls for Categories" />
        <Separator className="my-2" />
        <ApiList entityName="categories" entityIdName="categoryId" />
      </section>
    </React.Fragment>
  );
};

export default CategoryClient;
