import type { z } from "zod";
import {
  productAddResponseSchema,
  productAddParamsSchema,
} from "@/app/api/adminPanel/products/add/schemas";

export type TProductAddParams = z.infer<typeof productAddParamsSchema>;
export type TProductAddResponse = z.infer<typeof productAddResponseSchema>;
