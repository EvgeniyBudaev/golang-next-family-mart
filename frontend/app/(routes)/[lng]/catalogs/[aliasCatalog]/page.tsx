import { TSearchParams } from "@/app/api/common";
import { useTranslation } from "@/app/i18n";
import { CatalogPage } from "@/app/pages/catalogPage/CatalogPage";
import { ErrorBoundary } from "@/app/shared/components/errorBoundary";
import { getCatalogDetail, TCatalogDetail } from "@/app/api/adminPanel/catalogs/detail";

type TLoader = {
  aliasCatalog: string;
  searchParams: TSearchParams;
};

async function loader(params: TLoader) {
  const { aliasCatalog, searchParams } = params;
  console.log("loader aliasCatalog: ", aliasCatalog);
  try {
    const catalogResponse = await getCatalogDetail({ alias: aliasCatalog });
    const catalog = catalogResponse.data as TCatalogDetail;
    return { catalog };
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
    return <CatalogPage catalog={data.catalog} />;
  } catch (error) {
    return <ErrorBoundary i18n={{ lng, t }} message={t(error?.message)} />;
  }
}
