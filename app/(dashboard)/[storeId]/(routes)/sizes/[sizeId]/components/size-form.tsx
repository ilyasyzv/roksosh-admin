"use client";

import React from "react";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Size } from "@prisma/client";
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

// Update the form schema to handle new fields for name in different languages
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameRu: z.string().min(1, "Russian name is required"),
  nameKg: z.string().min(1, "Kyrgyz name is required"),
  value: z.string().min(1, "Size value is required"),
});

type SizeFormValues = z.infer<typeof formSchema>;

export const SizeForm = ({ initialData }: { initialData: Size | null }) => {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const toastMessage = initialData ? "Size updated." : "Size created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "", nameRu: "", nameKg: "", value: "" },
  });

  const onSubmit = async (data: SizeFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data,
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/sizes`);
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
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Size name"
                    disabled={loading}
                    {...field}
                    title={field.name}
                    className="min-w-min"
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
              <FormItem>
                <FormLabel>Russian Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Size name in Russian"
                    disabled={loading}
                    {...field}
                    title={field.name}
                    className="min-w-min"
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
              <FormItem>
                <FormLabel>Kyrgyz Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Size name in Kyrgyz"
                    disabled={loading}
                    {...field}
                    title={field.name}
                    className="min-w-min"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Size Value */}
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Size value"
                    disabled={loading}
                    {...field}
                    title={field.value}
                    className="min-w-min"
                  />
                </FormControl>
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
