import { TAttributeListItem } from "@/app/api/adminPanel/attributes/list/types";

export type TDeleteModalState = {
  isOpen: boolean;
  alias?: string;
};

export type TTableColumn = TAttributeListItem;
