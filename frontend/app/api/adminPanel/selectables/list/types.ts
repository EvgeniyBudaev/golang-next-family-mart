import type { z } from "zod";
import {
  selectableListItemSchema,
  selectableListParamsSchema,
  selectableListResponseSchema,
  selectableListSchema,
} from "@/app/api/adminPanel/selectables/list/schemas";

export type TSelectableListParams = z.infer<typeof selectableListParamsSchema>;
export type TSelectableList = z.infer<typeof selectableListSchema>;
export type TSelectableListItem = z.infer<typeof selectableListItemSchema>;
export type TSelectableListResponse = z.infer<typeof selectableListResponseSchema>;
