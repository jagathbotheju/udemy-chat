"use client";
import { NavbarItem } from "@nextui-org/navbar";
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
    <NavbarItem isActive={pathname === item.href}>
      <Link href={item.href}>{item.label}</Link>
    </NavbarItem>
  );
};

export default NavLink;
