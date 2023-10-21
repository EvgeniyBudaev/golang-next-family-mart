import type { FC, PropsWithChildren } from "react";
import { Footer } from "@/app/components/layout/footer";
import { Header } from "@/app/components/layout/header";
import "./Layout.scss";
import { I18nProps } from "@/app/i18n/props";

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
