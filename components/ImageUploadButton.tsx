"use client";
import React, { useTransition } from "react";
import {
  CldUploadButton,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { HiPhoto } from "react-icons/hi2";
import { addImages } from "@/app/actions/memberActions";
import { toast } from "sonner";

// interface Props {
//   onUploadImage: (result: CloudinaryUploadWidgetResults) => void;
// }

const ImageUploadButton = () => {
  const [isPending, startTransition] = useTransition();

  const onUploadImage = (result: CloudinaryUploadWidgetResults) => {
    startTransition(() => {
      toast.loading("Uploading images", { id: "image-upload" });
      if (result.info && typeof result.info === "object")
        addImages(result.info.secure_url, result.info.public_id)
          .then((res) => {
            if (res.success) {
              return toast.success(res.message, { id: "image-upload" });
            } else {
              return toast.error(res.error, { id: "image-upload" });
            }
          })
          .catch(() => {
            return toast.error("Internal Server Error, uploading images", {
              id: "image-upload",
            });
          });
    });
  };

  return (
    <CldUploadButton
      options={{
        maxFiles: 1,
      }}
      onSuccess={onUploadImage}
      signatureEndpoint="/api/sign-image"
      uploadPreset="jagath-upload"
      className="flex items-center gap-2 bg-secondary text-white rounded-lg py-2 px-4 hover:bg-secondary/70"
    >
      <HiPhoto size={28} />
      Upload New Image
    </CldUploadButton>
  );
};

export default ImageUploadButton;
