import { Environment } from "@/app/environment";
import { createApi } from "../shared/utils";

export const { fetchApi, setApiLanguage, getApiLanguage } = createApi({
  basePath: Environment.API_URL,
  timeout: 50_000,
  retry: 1,
});
