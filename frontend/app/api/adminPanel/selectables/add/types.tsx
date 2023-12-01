import type { z } from "zod";
import {
  selectableAddSchema,
  selectableAddParamsSchema,
} from "@/app/api/adminPanel/selectables/add/schemas";

export type TSelectableAddParams = z.infer<typeof selectableAddParamsSchema>;
export type TSelectableAdd = z.infer<typeof selectableAddSchema>;
