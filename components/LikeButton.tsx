"use client";
import { toggleLikeMember } from "@/app/actions/likeActions";
import { toast } from "sonner";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Button } from "@nextui-org/react";

interface Props {
  targetId: string;
  hasLiked: boolean;
}

const LikeButton = ({ targetId, hasLiked }: Props) => {
  const toggleLike = (e: React.MouseEvent) => {
    toggleLikeMember(targetId, hasLiked)
      .then((res) => {
        if (res.success) {
          return toast.success(res.message);
        } else {
          return toast.error(res.error);
        }
      })
      .catch(() => {
        return toast.error("Internal Server Error");
      });
  };

  return (
    <div
      className="relative hover:opacity-80 transition cursor-pointer"
      onClick={toggleLike}
    >
      <AiOutlineHeart
        size={28}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <AiFillHeart
        size={28}
        className={hasLiked ? "fill-rose-500" : "fill-neutral-500/70"}
      />
    </div>
  );
};

export default LikeButton;
