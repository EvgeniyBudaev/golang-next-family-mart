import { EErrorTypes } from "../enums";
import { TApiConfig, TApiFunction, TErrorResponse } from "@/app/shared/types/api";
import { gatewayTimeout } from "@/app/shared/utils/gatewayTimeout";
import { internalError } from "@/app/shared/utils/internalError";
import { processError } from "@/app/shared/utils/processError";
import { processSuccessResponse } from "@/app/shared/utils/processSuccessResponse";
import { setResponseTimeout } from "@/app/shared/utils/setResponseTimeout";
import { getAccessToken } from "@/app/shared/utils/auth";

let language: string = "ru";

/**
 *  Функция создания api- клиента
 *
 * @param config конфигурация {@buttonLink TApiConfig}
 *
 * Возвращает функцию для осуществления http запросов {@buttonLink TApiFunction}
 */
export function createApi(config: TApiConfig): {
  fetchApi: TApiFunction;
  setApiLanguage: (lng: string) => void;
  getApiLanguage: () => string;
} {
  const { basePath } = config;

  const fetchApi: TApiFunction = async (path, options) => {
    const accessToken = await getAccessToken();
    const url = basePath + path;
    let contentType: { "Content-Type"?: string } = { "Content-Type": "application/json" };
    let body;

    if (options?.body) {
      if (options?.body instanceof FormData) {
        contentType = {};
        body = options?.body;
      } else {
        body = JSON.stringify(options.body);
      }
    }

    const requestOptions = {
      ...options,
      headers: {
        ...contentType,
        Authorization: `Bearer ${accessToken}`,
        "Accept-Language": language,
        ...options?.headers,
      },
      body,
    };

    let errorResponse: TErrorResponse | null = null;

    for (let i = 0; i < (options?.retry ?? config.retry); i++) {
      const [signal, timeoutId] = setResponseTimeout(config.timeout);
      try {
        const response = await fetch(url, { ...requestOptions, signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          return await processSuccessResponse(response);
        }
        errorResponse = { type: EErrorTypes.Server, response: response };
      } catch (e: any) {
        errorResponse = processError(e);
      }
    }
    if (errorResponse) {
      if (errorResponse.type === EErrorTypes.Abort) {
        throw gatewayTimeout();
      }
      if (errorResponse.response) {
        const { response } = errorResponse;
        const errorMsg = await errorResponse.response.text();
        throw new Response(errorMsg, { status: response?.status });
      }
      throw internalError("Unexpected error");
    }
    throw internalError("Unexpected error");
  };

  const setApiLanguage = (lng: string) => {
    language = lng;
  };

  const getApiLanguage = () => language;

  return { fetchApi, setApiLanguage, getApiLanguage };
}
