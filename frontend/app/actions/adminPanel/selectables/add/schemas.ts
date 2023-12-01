import { z } from "zod";
import { EFormFields } from "@/app/pages/adminPanel/selectables/add/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";

export const selectableAddFormSchema = z.object({
  [EFormFields.AttributeAlias]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.AttributeId]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.Value]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
});
