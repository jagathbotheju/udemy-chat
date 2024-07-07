"use client";
import { setMainImage } from "@/app/actions/memberActions";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { PiSpinnerGap } from "react-icons/pi";
import { toast } from "sonner";

interface Props {
  selected: boolean;
  loading: boolean;
  mainPhoto: string | null;
  photo: string;
}

const StarButton = ({ selected, loading, mainPhoto, photo }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onSetMainImage = () => {
    startTransition(() => {
      setMainImage(photo)
        .then((res) => {
          if (res.success) {
            router.refresh();
            return toast.success(res.message);
          } else {
            return toast.error(res.error);
          }
        })
        .catch(() => {
          return toast.error("Internal Server Error, setting main image");
        });
    });
  };

  return (
    <div
      className="relative hover:opacity-80 transition cursor-pointer"
      onClick={onSetMainImage}
    >
      {!isPending ? (
        <>
          {mainPhoto === photo ? (
            <AiFillStar size={20} className="fill-yellow-500" />
          ) : (
            <AiOutlineStar size={20} className="fill-white" />
          )}
        </>
      ) : (
        <>
          <PiSpinnerGap size={30} className="fill-white animate-spin" />
        </>
      )}
    </div>
  );
};

export default StarButton;
