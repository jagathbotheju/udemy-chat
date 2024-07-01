"use client";
import { Tab, Tabs } from "@nextui-org/react";
import { Member } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Key, useTransition } from "react";
import MemberCard from "../members/MemberCard";
import LoadingCom from "@/components/LoadingCom";

type Props = {
  members: Member[];
  likeIds: string[] | undefined;
};

const ListsTab = ({ members, likeIds }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const tabs = [
    { id: "source", label: "Members I have liked" },
    { id: "target", label: "Members that likes me" },
    { id: "mutual", label: "Mutual Likes" },
  ];

  const handleTabChange = (key: Key) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("type", key.toString());
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex w-full flex-col mt-10 gap-5">
      <Tabs
        aria-label="like tabs"
        items={tabs}
        color="secondary"
        onSelectionChange={handleTabChange}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            {isPending ? (
              <LoadingCom />
            ) : (
              <>
                {members.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 w-fit">
                    {members.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        likeIds={likeIds}
                      />
                    ))}
                  </div>
                ) : (
                  <div>No Members Found!</div>
                )}
              </>
            )}
          </Tab>
        )}
      </Tabs>
    </div>
  );
};

export default ListsTab;
