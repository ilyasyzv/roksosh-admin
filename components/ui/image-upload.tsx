"use client";

import React from "react";
import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "./button";

const cldUploadPreset = "ml_default"; // from cloudinary.com

const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  urls,
}: {
  disabled?: boolean;
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
  urls: string[];
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const onUpload = (results: any) => {
    onChange(results.info.secure_url);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-start">
      <div className="mb-4 flex items-center gap-4">
        {urls.map((url) => (
          <div
            key={url}
            className="relative h-52 w-52 overflow-hidden rounded-md"
          >
            <div className="absolute right-2 top-2 z-10">
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={() => onRemove(url)}
              >
                <Trash className="w-4" />
              </Button>
            </div>
            <Image
              fill
              src={url}
              alt="Background image"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <CldUploadWidget onUpload={onUpload} uploadPreset={cldUploadPreset}>
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="mr-2 w-4" />
              Upload image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
