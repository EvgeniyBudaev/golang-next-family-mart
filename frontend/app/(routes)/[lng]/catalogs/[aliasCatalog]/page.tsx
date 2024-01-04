import { getCatalogDetail, TCatalogDetail } from "@/app/api/adminPanel/catalogs/detail";
import { getProductList, TProductList } from "@/app/api/adminPanel/products/list";
import { TSearchParams } from "@/app/api/common";
import { useTranslation } from "@/app/i18n";
import { CatalogPage } from "@/app/pages/catalogPage/CatalogPage";
import { ErrorBoundary } from "@/app/shared/components/errorBoundary";
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from "@/app/shared/constants/pagination";

type TLoader = {
  aliasCatalog: string;
  searchParams: TSearchParams;
};

async function loader(params: TLoader) {
  const { aliasCatalog, searchParams } = params;
  const formattedParams = {
    catalog: aliasCatalog,
    limit: searchParams?.limit ? Number(searchParams.limit) : DEFAULT_PAGE_LIMIT,
    page: searchParams?.page ? Number(searchParams.page) : DEFAULT_PAGE,
    sort: searchParams.sort ?? "updatedAt_asc",
    // search: "",
  };

  try {
    const [catalogDetailResponse, productListResponse] = await Promise.all([
      getCatalogDetail({ alias: aliasCatalog }),
      getProductList(formattedParams),
    ]);
    const catalogDetail = catalogDetailResponse.data as TCatalogDetail;
    const productList = productListResponse.data as TProductList;
    return { catalogDetail, productList };
  } catch (error) {
    throw new Error("errorBoundary.common.unexpectedError");
  }
}

type TProps = {
  params: { lng: string };
  searchParams: TSearchParams;
};

export default async function CatalogRoute(props: TProps) {
  const { params, searchParams } = props;
  const { aliasCatalog, lng } = params;

  const [{ t }] = await Promise.all([useTranslation(lng, "index")]);

  try {
    const data = await loader({ aliasCatalog, searchParams });
    return <CatalogPage catalogDetail={data.catalogDetail} productList={data.productList} />;
  } catch (error) {
    return <ErrorBoundary i18n={{ lng, t }} message={t(error?.message)} />;
  }
}
