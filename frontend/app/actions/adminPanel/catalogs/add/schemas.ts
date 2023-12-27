import { z } from "zod";
import { zfd } from "zod-form-data";
import { EFormFields } from "@/app/pages/adminPanel/catalogs/add/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";
import { fileSchema } from "@/app/api/upload";

export const catalogAddFormSchema = zfd.formData({
  [EFormFields.Alias]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.Name]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.DefaultImage]: fileSchema.or(fileSchema.array()).nullish(),
  [EFormFields.Image]: fileSchema.or(fileSchema.array()).nullish(),
});
