import type { z } from "zod";
import {
  selectableEditResponseSchema,
  selectableEditParamsSchema,
} from "@/app/api/adminPanel/selectables/edit/schemas";

export type TSelectableEditParams = z.infer<typeof selectableEditParamsSchema>;
export type TSelectableEditResponse = z.infer<typeof selectableEditResponseSchema>;
