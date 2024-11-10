"use client";

import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Size as SizeModel } from "@prisma/client";

import { SizeForm } from "./size-form";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export const Size = ({ initialData }: { initialData: SizeModel | null }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const title = initialData ? "Edit size" : "Create size";
  const description = initialData ? "Edit a size" : "Add a new size";

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success("Size deleted.");
    } catch (error) {
      toast.error("Make shure you removed all products using this size first.");
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
        <SizeForm initialData={initialData} />
      </section>
    </React.Fragment>
  );
};
