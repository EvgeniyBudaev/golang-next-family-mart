import { z } from "zod";
import { attributeListItemSchema } from "@/app/api/adminPanel/attributes/list/schemas";

export const attributeAddParamsSchema = z.any();

export const attributeAddSchema = attributeListItemSchema;
