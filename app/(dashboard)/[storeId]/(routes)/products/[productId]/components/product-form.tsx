"use client";

import React from "react";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Product, Image, Category, Size, Color } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

// Update form schema to include nameRu, nameKg, descriptionRu, descriptionKg
const formSchema = z.object({
  name: z.string().min(1),
  nameRu: z.string().min(1),
  nameKg: z.string().min(1),
  description: z.string().min(1),
  descriptionRu: z.string().min(1),
  descriptionKg: z.string().min(1),
  images: z
    .object({
      url: z.string().url(),
    })
    .array()
    .nonempty({ message: "At least one image is required" }),
  price: z.coerce.number().min(0.01),
  weight: z.coerce.number().min(0.01),
  categoryId: z.string().min(1, { message: "Category is required" }),
  colorId: z.string().min(1, { message: "Color is required" }),
  sizeId: z.string().optional(), // This makes sizeId optional
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});


type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm = ({
  initialData,
  categories,
  sizes,
  colors,
}: {
  initialData: (Product & { images: Image[] }) | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}) => {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData.price)),
          weight: parseFloat(String(initialData.weight)),
          sizeId: initialData.sizeId === null ? undefined : initialData.sizeId,
        }
      : {
          name: "",
          nameRu: "",
          nameKg: "",
          description: "",
          descriptionRu: "",
          descriptionKg: "",
          images: [],
          price: 0,
          weight: 0,
          categoryId: "",
          colorId: "",
          sizeId: undefined,
          isFeatured: false,
          isArchived: false,
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data,
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/products`);
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
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <ImageUpload
                  urls={field.value.map((image) => image.url)}
                  disabled={loading}
                  onChange={(url) => field.onChange([...field.value, { url }])}
                  onRemove={(url) =>
                    field.onChange([
                      ...field.value.filter((image) => image.url !== url),
                    ])
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Product name"
                    disabled={loading}
                    {...field}
                    title={field.name}
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
                    placeholder="Product name in Russian"
                    disabled={loading}
                    {...field}
                    title={field.name}
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
                    placeholder="Product name in Kyrgyz"
                    disabled={loading}
                    {...field}
                    title={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="99.99"
                    disabled={loading}
                    {...field}
                    title={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select disabled={loading} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="[&_span]:overflow-hidden [&_span]:overflow-ellipsis [&_span]:whitespace-nowrap [&_span]:text-left">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="99.99"
                    disabled={loading}
                    {...field}
                    title={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sizeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="[&_span]:overflow-hidden [&_span]:overflow-ellipsis [&_span]:whitespace-nowrap [&_span]:text-left">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sizes.map((size) => (
                      <SelectItem key={size.id} value={size.id}>
                        {size.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="colorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <Select disabled={loading} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="[&_span]:overflow-hidden [&_span]:overflow-ellipsis [&_span]:whitespace-nowrap [&_span]:text-left">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color.id} value={color.id}>
                        <div className="flex items-center gap-x-2">
                          <div
                            className="h-5 w-5 rounded-full border"
                            style={{ backgroundColor: color.value }}
                          />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description here."
                    disabled={loading}
                    {...field}
                    title={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="descriptionRu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Russian Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description in Russian."
                    disabled={loading}
                    {...field}
                    title={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="descriptionKg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kyrgyz Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description in Kyrgyz."
                    disabled={loading}
                    {...field}
                    title={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex w-full flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured</FormLabel>
                  <FormDescription>
                    This product will appear on the homepage
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isArchived"
            render={({ field }) => (
              <FormItem className="flex w-full flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Archived</FormLabel>
                  <FormDescription>
                    This product will not appear anywhere on the homepage
                  </FormDescription>
                </div>
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
