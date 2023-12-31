export enum ERoutes {
  Root = "/",
  About = "/about",
  AdminPanel = "/admin",
  Contacts = "/contacts",
  Delivery = "/delivery",
  Login = "/login",
  Signup = "/signup",
  PermissionDenied = "/403",

  AdminAttributeList = "/admin/attributes",
  AdminAttributeAdd = "/admin/attributes/add",
  AdminAttributeEdit = "/admin/attributes/:alias/edit",

  AdminCatalogs = "/admin/catalogs",
  AdminCatalogAdd = "/admin/catalogs/add",
  AdminCatalogEdit = "/admin/catalogs/:alias/edit",

  AdminProducts = "/admin/products",
  AdminProductAdd = "/admin/products/add",
  AdminProductEdit = "/admin/products/:alias/edit",

  AdminOrders = "/admin/orders",
  AdminOrderEdit = "/admin/orders/:id/edit",

  Cart = "/cart",
  CatalogDetail = "/catalogs/:aliasCatalog",
  Order = "/shipping/recipient/order",
  ProductDetail = "/catalogs/:aliasCatalog/:aliasProduct",
  Recipient = "/shipping/recipient",
  Settings = "/settings",
  Shipping = "/shipping",

  ResourcesAdminProductAddUploadImage = "/resources/admin/products/add",
  ResourcesAttributesByCatalog = "/resources/catalogs/attributes/:alias",
  ResourcesCatalogs = "/resources/catalogs",
  ResourcesCart = "/resources/cart",
  ResourcesCartItemIncrement = "/resources/cart/increment",
  ResourcesLogout = "/resources/logout",
  ResourcesSearch = "/resources/search",
  ResourcesLanguage = "/resources/language",
  ResourcesTheme = "/resources/theme",
}
