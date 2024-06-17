"use client";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { GiPadlock } from "react-icons/gi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/lib/schema";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";

const RegisterForm = () => {
  const [showPass, setShowPass] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "all",
  });

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    console.log(data);
  };

  return (
    <Card className="w-2/5 mx-auto p-5">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center text-secondary">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <h1 className="text-3xl font-semibold">Register</h1>
          </div>
          <p className="text-neutral-500">Welcome back to NextMatch</p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* name */}
            <Input
              errorMessage={errors.name?.message}
              label="Name"
              variant="bordered"
              {...register("name")}
              isInvalid={!!errors.name}
            />

            {/* email */}
            <Input
              errorMessage={errors.email?.message}
              label="Email"
              variant="bordered"
              {...register("email")}
              isInvalid={!!errors.email}
            />

            {/* password */}
            <Input
              endContent={
                <button
                  className="focus:outline-none cursor-pointer"
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? (
                    <FaEye className="h-5 w-5" />
                  ) : (
                    <FaEyeSlash className="h-5 w-5" />
                  )}
                </button>
              }
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password}
              label="Password"
              type={showPass ? "text" : "password"}
              variant="bordered"
              {...register("password")}
            />

            {/* confirm password */}
            <Input
              endContent={
                <button
                  className="focus:outline-none cursor-pointer"
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? (
                    <FaEye className="h-5 w-5" />
                  ) : (
                    <FaEyeSlash className="h-5 w-5" />
                  )}
                </button>
              }
              errorMessage={errors.confirmPassword?.message}
              isInvalid={!!errors.confirmPassword}
              label="Confirm Password"
              type={showPass ? "text" : "password"}
              variant="bordered"
              {...register("confirmPassword")}
            />

            <Button
              fullWidth
              color="secondary"
              isDisabled={!isValid}
              type="submit"
            >
              Register
            </Button>
          </div>
        </form>
      </CardBody>
      <CardFooter className="flex justify-center">
        <Link href="/auth/login" className="text-sm hover:text-secondary">
          {"Already have an Account? Log In"}
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
