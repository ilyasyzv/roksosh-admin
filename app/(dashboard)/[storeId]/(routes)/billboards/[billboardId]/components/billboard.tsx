"use client";

import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Billboard as BillboardModel } from "@prisma/client";

import { BillboardForm } from "./billboard-form";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export const Billboard = ({
  initialData,
}: {
  initialData: BillboardModel | null;
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard" : "Add a new billboard";

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`,
      );
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("Billboard deleted.");
    } catch (error) {
      toast.error(
        "Make shure you removed all categories using this billboard first.",
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
        <BillboardForm initialData={initialData} />
      </section>
    </React.Fragment>
  );
};
