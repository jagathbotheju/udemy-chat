"use client";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { GiPadlock } from "react-icons/gi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/schema";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useTransition } from "react";
import Link from "next/link";
import { loginCredentials } from "@/app/actions/authActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    console.log(data);
    startTransition(() => {
      loginCredentials(data)
        .then((res) => {
          if (res.success) {
            router.push("/");
            router.refresh();
            return toast.success(res.message);
          } else {
            return toast.error(res.error);
          }
        })
        .catch((err) => {
          return toast.error("Internal Server Error, please try again later");
        });
    });
  };

  return (
    <Card className="w-full md:w-2/5 mx-auto p-5">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center text-secondary">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <h1 className="text-3xl font-semibold">Login</h1>
          </div>
          <p className="text-neutral-500">Welcome back to NextMatch</p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* email */}
          <div className="space-y-4">
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

            <Button
              fullWidth
              isLoading={isPending}
              color="secondary"
              isDisabled={!isValid}
              type="submit"
            >
              Login
            </Button>
          </div>
        </form>
      </CardBody>
      <CardFooter className="flex justify-center">
        <Link href="/auth/register" className="text-sm hover:text-secondary">
          {"Don't have an Account? Create New"}
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
