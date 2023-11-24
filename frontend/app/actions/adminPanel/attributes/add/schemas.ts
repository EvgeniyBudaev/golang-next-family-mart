import { z } from "zod";
import { EFormFields } from "@/app/pages/adminPanel/attributes/add/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";

export const attributeAddFormSchema = z.object({
  [EFormFields.Alias]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.Name]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.Type]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
});
