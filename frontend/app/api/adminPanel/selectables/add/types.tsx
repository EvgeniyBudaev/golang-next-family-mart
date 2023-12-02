import type { z } from "zod";
import {
  selectableAddResponseSchema,
  selectableAddParamsSchema,
} from "@/app/api/adminPanel/selectables/add/schemas";

export type TSelectableAddParams = z.infer<typeof selectableAddParamsSchema>;
export type TSelectableAddResponse = z.infer<typeof selectableAddResponseSchema>;
