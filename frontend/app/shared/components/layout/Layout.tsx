import type { FC, PropsWithChildren } from "react";
import { I18nProps } from "@/app/i18n/props";
import { Footer } from "@/app/shared/components/layout/footer";
import { Header } from "@/app/shared/components/layout/header";
import "./Layout.scss";

type TProps = {} & PropsWithChildren & I18nProps;

export const Layout: FC<TProps> = ({ children, i18n }) => {
  return (
    <div className="Layout">
      <div className="Layout-Inner">
        <div className="Layout-Content">
          <Header i18n={i18n} />
          <main className="Layout-Main">
            <div className="Layout-Container">{children}</div>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};
