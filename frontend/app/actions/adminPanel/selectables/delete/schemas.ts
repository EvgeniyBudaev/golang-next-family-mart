import { z } from "zod";
import { EFormFields } from "@/app/pages/adminPanel/selectables/delete/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";

export const selectableDeleteFormSchema = z.object({
  [EFormFields.AttributeAlias]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.Uuid]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
});
