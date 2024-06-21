"use client";
import { NavbarItem, cn } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  item: {
    label: string;
    href: string;
  };
  setIsOpen: (open: boolean) => void;
}

const AuthMenuLink = ({ item, setIsOpen }: Props) => {
  const pathname = usePathname();

  return (
    <NavbarItem
      onClick={() => setIsOpen(false)}
      as={Link}
      isActive={item.href === pathname}
      href={item.href}
      className={cn(
        "text-left w-full rounded-xl font-semibold cursor-pointer px-3 py-1 text-slate-800 hover:bg-slate-100"
      )}
    >
      {item.label}
    </NavbarItem>
  );
};

export default AuthMenuLink;
