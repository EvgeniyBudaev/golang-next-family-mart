import type { z } from "zod";
import {
  catalogEditResponseSchema,
  catalogEditParamsSchema,
} from "@/app/api/adminPanel/catalogs/edit/schemas";

export type TCatalogEditParams = z.infer<typeof catalogEditParamsSchema>;
export type TCatalogEditResponse = z.infer<typeof catalogEditResponseSchema>;
