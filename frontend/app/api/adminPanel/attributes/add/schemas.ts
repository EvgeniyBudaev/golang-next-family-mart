import { z } from "zod";

export const attributeAddParamsSchema = z.object({
  alias: z.string(),
  name: z.string(),
  type: z.string(),
});

export const attributeAddSchema = z.any();
