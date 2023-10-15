import type { FC, PropsWithChildren } from "react";
import { Footer } from "@/app/components/layout/footer";
import { Header } from "@/app/components/layout/header";
import "./Layout.scss";

type TProps = {} & PropsWithChildren;
export const Layout: FC<TProps> = ({ children }) => {
  return (
    <div className="Layout">
      <div className="Layout-Inner">
        <div className="Layout-Content">
          <Header />
          <main className="Layout-Main">
            <div className="Layout-Container">{children}</div>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};