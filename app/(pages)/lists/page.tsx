import {
  getCurrentUserLikeIds,
  getLikedMembers,
} from "@/app/actions/likeActions";
import { title } from "@/components/primitives";
import { auth } from "@/config/auth";
import { Member, User } from "@prisma/client";
import { redirect } from "next/navigation";
import ListsTab from "./ListTab";

interface Props {
  searchParams: {
    type: string;
  };
}

export default async function ListsPage({ searchParams }: Props) {
  const session = await auth();
  const user = session?.user as User;

  if (!user) redirect("/auth/login?callbackUrl=/lists");

  const likeIdsRes = await getCurrentUserLikeIds();
  const likeIds = likeIdsRes.likeIds;
  const members = (await getLikedMembers(searchParams.type)) as Member[];

  return (
    <div>
      <ListsTab members={members} likeIds={likeIds} />
    </div>
  );
}
