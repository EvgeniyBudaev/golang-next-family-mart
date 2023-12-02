import type { z } from "zod";
import {
  selectableDeleteSchema,
  selectableDeleteParamsSchema,
} from "@/app/api/adminPanel/selectables/delete/schemas";

export type TSelectableDeleteParams = z.infer<typeof selectableDeleteParamsSchema>;
export type TSelectableDelete = z.infer<typeof selectableDeleteSchema>;
