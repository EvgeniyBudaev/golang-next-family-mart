"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC, PropsWithChildren } from "react";
import { createPath } from "@/app/utils";

type TProps = {
  activeClassName?: string;
  href: string;
} & PropsWithChildren;

export const NavLink: FC<TProps> = ({ activeClassName = "isActive", href, children }) => {
  const pathname = usePathname();

  return (
    <Link
      className={`${pathname === href ? activeClassName : ""}`}
      href={createPath({
        route: href as any,
      })}
    >
      {children}
    </Link>
  );
};
