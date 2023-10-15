import type { FC, ReactNode } from "react";
import "./Container.scss";

type TProps = {
  children?: ReactNode;
};

export const Container: FC<TProps> = ({ children }) => {
  return <div className="Container">{children}</div>;
};
