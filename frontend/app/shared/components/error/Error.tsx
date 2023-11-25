import type { FC } from "react";
import { I18nProps } from "@/app/i18n/props";
import { Icon } from "@/app/uikit/components/icon";
import "./Error.scss";

type TProps = {
  error?: Error;
  message?: string;
} & I18nProps;

export const Error: FC<TProps> = ({ error, i18n, message }) => {
  const errorMessage = message || error?.message || i18n.t("errorBoundary.common.unexpectedError");

  return (
    <section className="Error">
      <div className="Error-Inner">
        <div className="Error-Content">
          <div className="Error-IconBox">
            <Icon className="Error-Icon" type="Attention" />
          </div>
          <div className="Error-Message">
            <h3 className="Error-TitleProd">{errorMessage}</h3>
          </div>
        </div>
      </div>
    </section>
  );
};
