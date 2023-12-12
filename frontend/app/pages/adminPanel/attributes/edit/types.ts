import { TAttributeListItem } from "@/app/api/adminPanel/attributes/list/types";

type TErrors = {
  alias?: string[];
  name?: string[];
  type?: string[];
  uuid?: string[];
};

export type TInitialState = {
  data?: TAttributeListItem;
  error?: string;
  errors?: TErrors;
  success: boolean;
};
