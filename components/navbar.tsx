import React from "react";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  Link,
} from "@nextui-org/react";
import { Logo } from "@/components/icons";
import AuthButton from "./AuthButton";
import { siteConfig } from "@/config/site";
import NavLink from "./NavLink";

export const Navbar = () => {
  return (
    <NextUINavbar
      className="flex items-center"
      classNames={{
        item: ["text-lg", "data-[active=true]:text-secondary"],
      }}
    >
      <NavbarBrand as={Link} href="/" className="text-slate-800">
        <Logo />
        <p className="font-bold text-inherit text-xl">ACME</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        {siteConfig.navItems.map((item) => (
          <NavLink item={item} />
        ))}
      </NavbarContent>

      <NavbarContent as="div" justify="end" className="p-0">
        <AuthButton />
      </NavbarContent>
    </NextUINavbar>
  );
};
