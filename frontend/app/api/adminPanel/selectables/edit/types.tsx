import type { z } from "zod";
import {
  selectableEditSchema,
  selectableEditParamsSchema,
} from "@/app/api/adminPanel/selectables/edit/schemas";

export type TSelectableEditParams = z.infer<typeof selectableEditParamsSchema>;
export type TSelectableEdit = z.infer<typeof selectableEditSchema>;
