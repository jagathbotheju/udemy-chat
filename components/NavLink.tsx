"use client";
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

  return (
    <NavbarItem
      as={Link}
      isActive={pathname.startsWith(item.href)}
      href={item.href}
      className={cn(
        "text-left w-full rounded-xl font-semibold cursor-pointer px-3 py-1 text-slate-800"
      )}
    >
      {item.label}
    </NavbarItem>
  );
};

export default NavLink;
