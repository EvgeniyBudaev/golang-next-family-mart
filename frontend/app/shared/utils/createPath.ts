import { ERoutes } from "../enums";

type TRoutes =
  | ERoutes.AdminAttributeAdd
  | ERoutes.AdminAttributes
  | ERoutes.AdminCatalogAdd
  | ERoutes.AdminCatalogs
  | ERoutes.AdminOrders
  | ERoutes.AdminPanel
  | ERoutes.AdminProductAdd
  | ERoutes.AdminProducts
  | ERoutes.Cart
  | ERoutes.Login
  | ERoutes.Order
  | ERoutes.PermissionDenied
  | ERoutes.Recipient
  | ERoutes.ResourcesLanguage
  | ERoutes.ResourcesTheme
  | ERoutes.Root
  | ERoutes.Settings
  | ERoutes.Shipping
  | ERoutes.Signup;

type TRoutesWithParams =
  | ERoutes.AdminAttributeEdit
  | ERoutes.AdminCatalogEdit
  | ERoutes.AdminOrderEdit
  | ERoutes.AdminProductEdit
  | ERoutes.CatalogDetail
  | ERoutes.ResourcesAttributesByCatalog
  | ERoutes.ProductDetail;

type TCreatePathProps =
  | { route: TRoutes }
  | { route: TRoutesWithParams; params: Record<string, string | number> };

type TCreatePathPropsWithParams = Extract<TCreatePathProps, { route: any; params: any }>;

export function createPath(
  props: TCreatePathProps,
  // lng: string,
  query?: Record<string, string> | URLSearchParams,
): string {
  let path: string = props.route;

  if (props.hasOwnProperty("params")) {
    path = Object.entries((props as TCreatePathPropsWithParams).params).reduce(
      (previousValue: string, [param, value]) => previousValue.replace(`:${param}`, String(value)),
      path,
    );
  }

  if (query && Object.keys(query).length) {
    path = `${path}${path.includes("?") ? "&" : "?"}${new URLSearchParams(query)}`;
  }

  // if(lng) {
  //   path = `${lng}/${path}`;
  // }

  return path;
}
