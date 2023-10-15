import { TErrorResponse } from "@/app/types/api";
import { EErrorTypes } from "@/app/enums";

/**
 * Обрабатывает ошибочный запрос
 *
 * @param e
 */
export const processError = (e: Error | Response): TErrorResponse => {
  if (e instanceof Response) {
    throw e;
  }
  if (e.name === "AbortError") {
    return { type: EErrorTypes.Abort };
  }
  return { type: EErrorTypes.Server };
};
