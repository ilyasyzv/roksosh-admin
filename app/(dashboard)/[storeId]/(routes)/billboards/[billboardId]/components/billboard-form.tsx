"use client";

import React from "react";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Billboard } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
  label: z.string().min(1, "Label is required"),
  labelRu: z.string().min(1, "Russian label is required"),
  labelKg: z.string().min(1, "Kyrgyz label is required"),
  imageUrl: z.string().min(2, "Please upload an image"),
});

type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForm = ({
  initialData,
}: {
  initialData: Billboard | null;
}) => {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const toastMessage = initialData ? "Billboard updated." : "Billboard created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { label: "", labelRu: "", labelKg: "", imageUrl: "" },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        {/* Image Upload */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background image</FormLabel>
              <FormControl>
                <ImageUpload
                  urls={field.value ? [field.value] : []}
                  disabled={loading}
                  onChange={(url) => field.onChange(url)}
                  onRemove={() => field.onChange("")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Label En */}
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  placeholder="Billboard label"
                  disabled={loading}
                  {...field}
                  className="min-w-min"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Label Ru */}
        <FormField
          control={form.control}
          name="labelRu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Russian Label</FormLabel>
              <FormControl>
                <Input
                  placeholder="Billboard label in Russian"
                  disabled={loading}
                  {...field}
                  className="min-w-min"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Label Kg */}
        <FormField
          control={form.control}
          name="labelKg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kyrgyz Label</FormLabel>
              <FormControl>
                <Input
                  placeholder="Billboard label in Kyrgyz"
                  disabled={loading}
                  {...field}
                  className="min-w-min"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
          <Button type="submit" disabled={loading}>
            {action}
          </Button>
        </div>
      </form>
    </Form>
  );
};
