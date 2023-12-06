import type { FC } from "react";
import "./Loader.scss";
import { Icon } from "@/app/uikit/components/icon";

export const Loader: FC = () => {
  return (
    <div className="Loader">
      <Icon type="Spinner" />
    </div>
  );
};
