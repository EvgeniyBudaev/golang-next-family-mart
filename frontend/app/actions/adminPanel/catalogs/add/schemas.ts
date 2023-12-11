import { z } from "zod";
import { EFormFields } from "@/app/pages/adminPanel/catalogs/add/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";

// export const catalogAddFormSchema = z.object({
//   [EFormFields.Alias]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
//   [EFormFields.DefaultImage]: z.any(),
//   [EFormFields.Files]: z.any(),
//   [EFormFields.Name]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
// });

export const catalogAddFormSchema = z.any();
