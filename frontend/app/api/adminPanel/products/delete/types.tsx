import type { z } from "zod";
import {
  productDeleteResponseSchema,
  productDeleteParamsSchema,
} from "@/app/api/adminPanel/products/delete/schemas";

export type TProductDeleteParams = z.infer<typeof productDeleteParamsSchema>;
export type TProductDeleteResponse = z.infer<typeof productDeleteResponseSchema>;
