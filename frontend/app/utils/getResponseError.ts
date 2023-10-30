import { TCommonResponseError, TDomainErrors } from "@/app/types/error";
import { formatResponseFieldErrors } from "@/app/utils/formatResponseFieldErrors";

interface ResponseError {
  message: string;
  fieldErrors?: TDomainErrors;
}

export const DEFAULT_RESPONSE_ERROR_MESSAGE = "Произошла неизвестная ошибка";

export function getResponseError(responseData: TCommonResponseError): ResponseError | null {
  const defaultMessage = DEFAULT_RESPONSE_ERROR_MESSAGE;
  try {
    const responseError: ResponseError = {
      message: responseData.message ?? defaultMessage,
    };
    if (responseData?.fieldErrors) {
      responseError.fieldErrors = formatResponseFieldErrors(responseData.fieldErrors);
    }
    return responseError;
  } catch (error) {
    return { message: defaultMessage };
  }
}
