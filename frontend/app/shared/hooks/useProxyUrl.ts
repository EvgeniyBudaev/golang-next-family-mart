import { ROUTER_PREFIX } from "@/app/shared/constants/router";
import { PROXY_URL } from "@/app/shared/constants/proxy";

type TUseProxyUrl = () => { proxyUrl: string };

export const useProxyUrl: TUseProxyUrl = () => {
  return { proxyUrl: ROUTER_PREFIX ? `${ROUTER_PREFIX}${PROXY_URL}` : PROXY_URL };
};
