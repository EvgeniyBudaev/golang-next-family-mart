import type { z } from "zod";
import {
  catalogDeleteResponseSchema,
  catalogDeleteParamsSchema,
} from "@/app/api/adminPanel/catalogs/delete/schemas";

export type TCatalogDeleteParams = z.infer<typeof catalogDeleteParamsSchema>;
export type TCatalogDeleteResponse = z.infer<typeof catalogDeleteResponseSchema>;
