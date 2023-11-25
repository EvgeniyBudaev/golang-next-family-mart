import type { FC } from "react";
import { Error } from "@/app/shared/components/error";
import { I18nProps } from "@/app/i18n/props";

type TProps = {
  error?: Error;
  message?: string;
} & I18nProps;

export const ErrorBoundary: FC<TProps> = ({ error, i18n, message = message }) => {
  return <Error error={error} i18n={i18n} message={message} />;
};
