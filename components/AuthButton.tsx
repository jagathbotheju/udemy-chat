import { auth } from "@/config/auth";
import { User } from "@prisma/client";
import { Button } from "@nextui-org/react";
import AuthMenu from "./AuthMenu";
import Link from "next/link";
import { getUserById } from "@/app/actions/authActions";

const AuthButton = async () => {
  const session = await auth();
  let user = session?.user as User;

  if (user) {
    const res = await getUserById(user.id);
    const userDB = res.data as User;
    user = userDB;
  }

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
