import { z } from "zod";

export const selectableAddParamsSchema = z.object({
  attribute_id: z.number(),
  value: z.string(),
});

export const selectableAddSchema = z.object({
  id: z.number(),
  attribute_id: z.number(),
  created_at: z.string(),
  deleted: z.boolean(),
  enabled: z.boolean(),
  updated_at: z.string(),
  uuid: z.string(),
  value: z.string(),
});
