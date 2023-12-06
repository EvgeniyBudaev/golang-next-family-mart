import { z } from "zod";
import { EFormFields } from "@/app/pages/adminPanel/catalogs/add/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";

export const catalogAddFormSchema = z.object({
  [EFormFields.Alias]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.Name]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
});
