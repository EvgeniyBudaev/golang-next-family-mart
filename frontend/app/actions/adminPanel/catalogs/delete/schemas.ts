import { z } from "zod";
import { EFormFields } from "@/app/pages/adminPanel/catalogs/delete/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";

export const catalogDeleteFormSchema = z.object({
  [EFormFields.Uuid]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
});
