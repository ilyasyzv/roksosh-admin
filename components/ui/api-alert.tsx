"use client";

import toast from "react-hot-toast";
import { Copy, Server } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ApiAlertProps = {
  title: string;
  description: string;
  variant: "public" | "admin";
};

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export const ApiAlert = ({ title, description, variant }: ApiAlertProps) => {
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("API Route copied to clipboard");
  };

  return (
    <Alert className="min-w-min">
      <Server className="w-4" />
      <AlertTitle className="flex flex-wrap items-center gap-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex flex-col items-end justify-between gap-4 sm:flex-row sm:items-center">
        <code className="relative break-all rounded bg-muted p-2 font-mono text-sm font-semibold">
          {description}
        </code>
        <Button type="button" size="icon" variant="outline" onClick={onCopy}>
          <Copy className="w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
