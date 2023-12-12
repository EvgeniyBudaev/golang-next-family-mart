import { TSelectableListItem } from "@/app/api/adminPanel/selectables/list";

type TErrors = {
  attributeAlias?: string[];
  value?: string[];
};

export type TInitialState = {
  data?: TSelectableListItem;
  error?: string;
  errors?: TErrors;
  success: boolean;
};
