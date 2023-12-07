import { z } from "zod";
import { EFormFields } from "@/app/pages/adminPanel/catalogs/edit/catalogEditForm/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";

export const catalogEditFormSchema = z.object({
  [EFormFields.Alias]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.Enabled]: z.string().trim(),
  [EFormFields.Image]: z.string().trim().optional(),
  [EFormFields.Name]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.Uuid]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
});
