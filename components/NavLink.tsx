"use client";
import { useMessageStore } from "@/store/useMessageStore";
import { NavbarItem, cn } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  item: {
    label: string;
    href: string;
  };
}

const NavLink = ({ item }: Props) => {
  const pathname = usePathname();
  const { unRedCount } = useMessageStore((state) => state);

  return (
    <NavbarItem
      as={Link}
      className={cn(
        "text-left w-full rounded-xl font-semibold cursor-pointer px-3 py-1 text-slate-800"
      )}
      href={item.href}
      isActive={pathname.startsWith(item.href)}
    >
      <span>{item.label}</span>
      {item.href === "/messages" && <span>({unRedCount})</span>}
    </NavbarItem>
  );
};

export default NavLink;
