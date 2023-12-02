import type { z } from "zod";
import {
  attributeDeleteResponseSchema,
  attributeDeleteParamsSchema,
} from "@/app/api/adminPanel/attributes/delete/schemas";

export type TAttributeDeleteParams = z.infer<typeof attributeDeleteParamsSchema>;
export type TAttributeDeleteResponse = z.infer<typeof attributeDeleteResponseSchema>;
