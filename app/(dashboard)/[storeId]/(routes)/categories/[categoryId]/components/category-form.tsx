"use client";

import React from "react";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Billboard, Category } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Update the form schema to handle the new fields
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameRu: z.string().min(1, "Russian name is required"),
  nameKg: z.string().min(1, "Kyrgyz name is required"),
  billboardId: z.string().min(1, "Please select a billboard"),
});

type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm = ({
  initialData,
  billboards,
}: {
  initialData: Category | null;
  billboards: Billboard[];
}) => {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const toastMessage = initialData ? "Category updated." : "Category created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "", nameRu: "", nameKg: "", billboardId: "" },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data,
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/categories`);
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
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          {/* Name Fields for Multiple Languages */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-1/4 flex-shrink-0 basis-full sm:basis-1/3 md:basis-1/4">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Category name"
                    disabled={loading}
                    {...field}
                    title={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nameRu"
            render={({ field }) => (
              <FormItem className="w-1/4 flex-shrink-0 basis-full sm:basis-1/3 md:basis-1/4">
                <FormLabel>Russian Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Category name in Russian"
                    disabled={loading}
                    {...field}
                    title={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nameKg"
            render={({ field }) => (
              <FormItem className="w-1/4 flex-shrink-0 basis-full sm:basis-1/3 md:basis-1/4">
                <FormLabel>Kyrgyz Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Category name in Kyrgyz"
                    disabled={loading}
                    {...field}
                    title={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Billboard Selection */}
          <FormField
            control={form.control}
            name="billboardId"
            render={({ field }) => (
              <FormItem className="w-1/4 flex-shrink-0 basis-full sm:basis-1/3 md:basis-1/4">
                <FormLabel>Billboard</FormLabel>
                <Select disabled={loading} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="min-w-max gap-x-4">
                      <SelectValue placeholder="Select a billboard" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {billboards.map((billboard) => (
                      <SelectItem key={billboard.id} value={billboard.id}>
                        {billboard.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {action}
        </Button>
      </form>
    </Form>
  );
};
