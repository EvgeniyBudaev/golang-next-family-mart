import type { z } from "zod";
import {
  productImageDeleteParamsSchema,
  productImageDeleteResponseSchema,
} from "@/app/api/adminPanel/products/deleteImage/schemas";

export type TProductImageDeleteParams = z.infer<typeof productImageDeleteParamsSchema>;
export type TProductImageDeleteResponse = z.infer<typeof productImageDeleteResponseSchema>;
