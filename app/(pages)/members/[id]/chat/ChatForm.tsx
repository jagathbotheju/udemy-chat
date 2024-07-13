"use client";
import React, { useEffect, useState, useTransition } from "react";
import { MessageSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input } from "@nextui-org/react";
import { HiPaperAirplane } from "react-icons/hi2";
import { useParams, useRouter } from "next/navigation";
import { createMessage } from "@/app/actions/messageActions";
import { toast } from "sonner";
import { MessageExt } from "@/lib/types";

const ChatForm = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting, isValid },
  } = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      text: "",
    },
    mode: "all",
  });

  useEffect(() => {
    setFocus("text");
  }, [setFocus]);

  const onSubmit = (formData: z.infer<typeof MessageSchema>) => {
    console.log("ChatForm", formData);
    startTransition(() => {
      createMessage(params.id, formData)
        .then((res) => {
          if (res.success) {
            reset();
            // return toast.success(res.message);
          } else {
            reset();
            setFormErrors(res.error);
          }
        })
        .catch((err) => {
          reset();
          setFormErrors(err);
        });
      setFocus("text");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex items-center gap-2">
        <Input
          fullWidth
          placeholder="Type a message"
          variant="faded"
          {...register("text")}
          isInvalid={!!errors.text}
          errorMessage={errors.text?.message}
        />

        <Button
          type="submit"
          isIconOnly
          color="secondary"
          radius="full"
          isLoading={isSubmitting}
          isDisabled={!isValid || isSubmitting || isPending}
        >
          <HiPaperAirplane size={18} />
        </Button>
      </div>

      <div className="flex flex-col">
        {formErrors && (
          <p className="text-red-500 self-end text-xs p-2 pr-12 font-semibold">
            {formErrors}
          </p>
        )}
      </div>
    </form>
  );
};

export default ChatForm;
