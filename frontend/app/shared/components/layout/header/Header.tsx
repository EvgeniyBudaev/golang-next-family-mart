import type { FC } from "react";
import { HeaderContent } from "@/app/shared/components/layout/header/headerContent";
import "./Header.scss";
import { I18nProps } from "@/app/i18n/props";

export const Header: FC<I18nProps> = ({ i18n }) => {
  return (
    <div className="Header-Wrapper">
      <header className="Header">
        <HeaderContent i18n={i18n} />
      </header>
    </div>
  );
};
