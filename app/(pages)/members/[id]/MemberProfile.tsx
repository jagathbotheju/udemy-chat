"use client";
import { updateMemberProfile } from "@/app/actions/memberActions";
import { MemberEditSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Divider,
  CardHeader,
  CardBody,
  Input,
  Textarea,
  Button,
} from "@nextui-org/react";
import { Member, User } from "@prisma/client";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  member: Member;
  currentUser: User | undefined;
}

const MemberProfile = ({ member, currentUser }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [edit, setEdit] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm<z.infer<typeof MemberEditSchema>>({
    resolver: zodResolver(MemberEditSchema),
    defaultValues: {
      name: member.name,
      description: member.description,
      city: member.city,
      country: member.country,
    },
    mode: "all",
  });

  const onSubmit = (formData: z.infer<typeof MemberEditSchema>) => {
    startTransition(() => {
      updateMemberProfile({
        data: formData,
        userId: member.userId,
      })
        .then((res) => {
          if (res.success) {
            setEdit(false);
            return toast.success(res.message);
          } else {
            return toast.error(res.error);
          }
        })
        .catch(() => {
          return toast.error("Internal Server Error");
        });
    });
  };

  return (
    <>
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <h3 className="text-2xl font-semibold text-secondary">
            {currentUser && currentUser.id === member.userId && edit && "Edit "}
            {currentUser && currentUser.id === member.userId
              ? "My Profile"
              : "Profile"}
          </h3>
          {currentUser && currentUser.id === member.userId && (
            <FaEdit
              className="size-5 text-secondary cursor-pointer"
              onClick={() => setEdit(!edit)}
            />
          )}
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        {currentUser && currentUser.id === member.userId && edit ? (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4 w-[70%] p-10">
                {/* name */}
                <Input
                  errorMessage={errors.name?.message}
                  label="Name"
                  variant="bordered"
                  {...register("name")}
                  isInvalid={!!errors.name}
                />

                {/* description */}
                <Textarea
                  errorMessage={errors.description?.message}
                  label="Description"
                  variant="bordered"
                  {...register("description")}
                  isInvalid={!!errors.description}
                />

                {/* city */}
                <Input
                  errorMessage={errors.city?.message}
                  label="City"
                  variant="bordered"
                  {...register("city")}
                  isInvalid={!!errors.city}
                />

                {/* country */}
                <Input
                  errorMessage={errors.country?.message}
                  label="Country"
                  variant="bordered"
                  {...register("country")}
                  isInvalid={!!errors.country}
                />
              </div>

              <div className="px-10 flex gap-2 items-center">
                <Button
                  type="submit"
                  color="secondary"
                  isLoading={isPending || isSubmitting}
                  isDisabled={!isValid || isPending}
                >
                  Update Profile
                </Button>
                <Button
                  type="button"
                  color="default"
                  variant="bordered"
                  onClick={() => setEdit(!edit)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="grid grid-cols-4 p-10 gap-4">
              <p className="font-semibold">NAME</p>
              <p className="col-span-3 text-left">{member.name}</p>
              <p className="font-semibold">DESCRIPTION</p>
              <p className="col-span-3 text-left">{member.description}</p>
              <p className="font-semibold">CITY</p>
              <p className="col-span-3 text-left">{member.city}</p>
              <p className="font-semibold">COUNTRY</p>
              <p className="col-span-3 text-left">{member.country}</p>
            </div>
          </>
        )}
      </CardBody>
    </>
  );
};

export default MemberProfile;
