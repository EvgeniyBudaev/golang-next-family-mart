import { TAttributeListItem } from "@/app/api/adminPanel/attributes/list/types";

type TErrors = {
  uuid?: string[];
};

export type TInitialState = {
  data?: TAttributeListItem;
  error?: string;
  errors?: TErrors;
  success: boolean;
};
