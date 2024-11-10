"use client";

import React from "react";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Color } from "@prisma/client";
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
  value: z.string().regex(/^#[0-9a-fA-F]{6}$/, {
    message: "String must be a valid hex code, e.g. #ff0000",
  }),
});

type ColorFormValues = z.infer<typeof formSchema>;

export const ColorForm = ({ initialData }: { initialData: Color | null }) => {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const toastMessage = initialData ? "Color updated." : "Color created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "", nameRu: "", nameKg: "", value: "" },
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data,
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/colors`);
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
                    placeholder="Color name"
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
                    placeholder="Color name in Russian"
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
                    placeholder="Color name in Kyrgyz"
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

          {/* Color Value (Hex Code) */}
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <div className="grid grid-flow-col items-center gap-x-2">
                    <Input
                      placeholder="Color hex code"
                      disabled={loading}
                      {...field}
                      title={field.value}
                      className="min-w-min"
                    />
                    <div
                      className="h-8 w-8 rounded-full border"
                      style={{ backgroundColor: field.value }}
                    />
                  </div>
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
