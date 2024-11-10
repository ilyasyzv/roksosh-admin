"use client";

import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Billboard, Category as CategoryModel } from "@prisma/client";

import { CategoryForm } from "./category-form";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export const Category = ({
  initialData,
  billboards,
}: {
  initialData: CategoryModel | null;
  billboards: Billboard[];
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit a category" : "Add a new category";

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`,
      );
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Category deleted.");
    } catch (error) {
      toast.error(
        "Make shure you removed all products using this category first.",
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <React.Fragment>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <section>
        <header className="flex items-center justify-between">
          <Heading title={title} description={description} />
          {initialData ? (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              disabled={loading}
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          ) : null}
        </header>
        <Separator className="my-4" />
        <CategoryForm billboards={billboards} initialData={initialData} />
      </section>
    </React.Fragment>
  );
};
