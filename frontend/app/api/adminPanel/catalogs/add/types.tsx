import type { z } from "zod";
import {
  catalogAddResponseSchema,
  catalogAddParamsSchema,
} from "@/app/api/adminPanel/catalogs/add/schemas";

export type TCatalogAddParams = z.infer<typeof catalogAddParamsSchema>;
export type TCatalogAddResponse = z.infer<typeof catalogAddResponseSchema>;
