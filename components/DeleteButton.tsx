"use client";
import { deleteImage } from "@/app/actions/memberActions";
import { Photo } from "@prisma/client";
import React, { useTransition } from "react";
import { AiFillDelete, AiOutlineDelete } from "react-icons/ai";
import { PiSpinnerGap } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "sonner";

interface Props {
  photo: Photo;
  profilePhoto: string | null;
}

const DeleteButton = ({ photo, profilePhoto }: Props) => {
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    toast.loading("Deleting image", { id: "image-delete" });
    startTransition(() => {
      deleteImage({ photo, profilePhoto })
        .then((res) => {
          if (res.success) {
            return toast.success(res.message, { id: "image-delete" });
          } else {
            return toast.error(res.error, { id: "image-delete" });
          }
        })
        .catch(() => {
          return toast.error("Internal Server Error, deleting image", {
            id: "delete-image",
          });
        });
    });
  };

  return (
    <div
      className="relative hover:opacity-80 transition cursor-pointer"
      onClick={onDelete}
    >
      {!isPending ? (
        <>
          <RiDeleteBin6Line
            size={20}
            className="text-red-600 hover:bg-slate-50 rounded-sm"
          />
        </>
      ) : (
        <>
          <PiSpinnerGap size={30} className="fill-white animate-spin" />
        </>
      )}
    </div>
  );
};

export default DeleteButton;
