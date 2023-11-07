import { TFunction } from "i18next";

export type I18nProps = {
  i18n: {
    t: TFunction<any, any>;
    lng: string;
  };
};
