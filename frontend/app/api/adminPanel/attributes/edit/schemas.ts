import { z } from "zod";
import { attributeListItemSchema } from "@/app/api/adminPanel/attributes/list/schemas";

export const attributeEditParamsSchema = z.any();

export const attributeEditSchema = attributeListItemSchema;
