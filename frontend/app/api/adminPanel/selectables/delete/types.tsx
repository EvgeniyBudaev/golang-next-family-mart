import type { z } from "zod";
import {
  selectableDeleteResponseSchema,
  selectableDeleteParamsSchema,
} from "@/app/api/adminPanel/selectables/delete/schemas";

export type TSelectableDeleteParams = z.infer<typeof selectableDeleteParamsSchema>;
export type TSelectableDeleteResponse = z.infer<typeof selectableDeleteResponseSchema>;
