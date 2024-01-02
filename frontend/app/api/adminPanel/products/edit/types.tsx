import type { z } from "zod";
import {
  productEditResponseSchema,
  productEditParamsSchema,
} from "@/app/api/adminPanel/products/edit/schemas";

export type TProductEditParams = z.infer<typeof productEditParamsSchema>;
export type TProductEditResponse = z.infer<typeof productEditResponseSchema>;
