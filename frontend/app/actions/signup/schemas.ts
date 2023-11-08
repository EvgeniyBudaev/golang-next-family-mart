import { z } from "zod";
import { EFormFields } from "@/app/pages/signupPage/enums";
import {
  EMAIL_ERROR_MESSAGE,
  EMAIL_NOT_CYRILLIC_ERROR_MESSAGE,
  EMAIL_NOT_CYRILLIC_REGEXP,
  EMAIL_REGEXP,
  EMPTY_FIELD_ERROR_MESSAGE,
  NAME_ERROR_MESSAGE,
  NAME_REGEXP,
} from "@/app/shared/validation";

export const signupFormSchema = z.object({
  [EFormFields.UserName]: z
    .any(),
    // .string()
    // .trim()
    // .min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.FirstName]: z
    .any(),
    // .string()
    // .trim()
    // .min(1, EMPTY_FIELD_ERROR_MESSAGE)
    // .regex(NAME_REGEXP, NAME_ERROR_MESSAGE),
  [EFormFields.LastName]: z
    .any(),
    // .string()
    // .trim()
    // .min(1, EMPTY_FIELD_ERROR_MESSAGE)
    // .regex(NAME_REGEXP, NAME_ERROR_MESSAGE),
  // [EFormFields.MobileNumber]: z.string().trim().min(11, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.MobileNumber]: z.any(),
  [EFormFields.Email]: z
    .any(),
    // .string()
    // .trim()
    // .min(1, EMPTY_FIELD_ERROR_MESSAGE)
    // .regex(EMAIL_NOT_CYRILLIC_REGEXP, EMAIL_NOT_CYRILLIC_ERROR_MESSAGE)
    // .regex(EMAIL_REGEXP, EMAIL_ERROR_MESSAGE),
  [EFormFields.Password]: z
    .any(),
    // .string()
    // .trim()
    // .min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.PasswordConfirm]: z
    .any(),
    // .string()
    // .trim()
    // .min(1, EMPTY_FIELD_ERROR_MESSAGE),
});
