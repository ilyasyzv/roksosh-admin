"use client";

import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  Category,
  Color,
  Image,
  Product as ProductModel,
  Size,
} from "@prisma/client";

import { ProductForm } from "./product-form";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export const Product = ({
  initialData,
  categories,
  sizes,
  colors,
}: {
  initialData: (ProductModel & { images: Image[] }) | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product" : "Add a new product";

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted.");
    } catch (error) {
      toast.error("Something went wrong.");
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
        <ProductForm
          initialData={initialData}
          categories={categories}
          colors={colors}
          sizes={sizes}
        />
      </section>
    </React.Fragment>
  );
};
