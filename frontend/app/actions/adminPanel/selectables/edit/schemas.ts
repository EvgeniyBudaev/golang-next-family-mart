import { z } from "zod";
import { EFormFields } from "@/app/pages/adminPanel/selectables/edit/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";

export const selectableEditFormSchema = z.object({
  [EFormFields.AttributeAlias]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.Uuid]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.Value]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
});
