import { title } from "@/components/primitives";
import { auth } from "@/config/auth";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function BlogPage() {
  const session = await auth();
  const user = session?.user as User;

  if (!user) redirect("/auth/login");

  return (
    <div>
      <h1 className={title()}>Members</h1>
    </div>
  );
}
