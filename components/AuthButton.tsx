import { auth } from "@/config/auth";
import { User } from "@prisma/client";
import { Button } from "@nextui-org/react";
import AuthMenu from "./AuthMenu";
import Link from "next/link";

const AuthButton = async () => {
  const session = await auth();
  const user = session?.user as User;

  console.log("AuthButton", user);

  return (
    <div className="items-center gap-2 flex">
      {user ? (
        <AuthMenu user={user} />
      ) : (
        <>
          <Button size="sm" variant="bordered" as={Link} href="/auth/login">
            Login
          </Button>
          <Button size="sm" variant="bordered" as={Link} href="/auth/register">
            Register
          </Button>
        </>
      )}
    </div>
  );
};

export default AuthButton;
