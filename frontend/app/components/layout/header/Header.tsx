import type { FC } from "react";
import { HeaderContent } from "@/app/components/layout/header/headerContent";
import "./Header.scss";

export const Header: FC = () => {
  return (
    <div className="Header-Wrapper">
      <header className="Header">
        <HeaderContent />
      </header>
    </div>
  );
};
