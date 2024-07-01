"use client";
import { siteConfig } from "@/config/site";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  User as NextUIUser,
  NavbarItem,
} from "@nextui-org/react";
import NavLink from "./NavLink";
import { useState } from "react";
import { User } from "@prisma/client";
import { logout } from "@/app/actions/authActions";
import AuthMenuLink from "./AuthMenuLink";

interface Props {
  user: User;
}

const AuthMenu = ({ user }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      showArrow
      placement="bottom"
      onOpenChange={(open) => setIsOpen(open)}
      isOpen={isOpen}
    >
      <PopoverTrigger>
        <NextUIUser
          as="button"
          name={user.name ?? "guest"}
          description={user.email}
          // className="transition-transform"
          avatarProps={{
            src: user?.image ?? "",
            fallback: (
              <p className="text-lg">{user?.name?.slice(0, 2).toUpperCase()}</p>
            ),
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-[150px] p-0">
        <div className="flex flex-col w-full gap-1">
          <div className="flex flex-col gap-1">
            {siteConfig.navItems.map((item) => (
              <AuthMenuLink key={item.href} item={item} setIsOpen={setIsOpen} />
            ))}
          </div>

          {/* logout */}
          <NavbarItem
            className="hover:bg-red-50 text-left w-full rounded-xl font-semibold cursor-pointer px-3 py-1"
            onClick={async () => {
              setIsOpen(false);
              await logout();
            }}
          >
            Logout
          </NavbarItem>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AuthMenu;
