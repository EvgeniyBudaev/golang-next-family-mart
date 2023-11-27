import { redirect } from "next/navigation";
import { type TAttributeList } from "@/app/api/adminPanel/attributes/list";
import { useTranslation } from "@/app/i18n";
import { AttributeListPage } from "@/app/pages/adminPanel/attributes/list";
import { ErrorBoundary } from "@/app/shared/components/errorBoundary";
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from "@/app/shared/constants/pagination";
import { EPermissions, ERoutes } from "@/app/shared/enums";
import { checkPermissionsByServer } from "@/app/shared/utils/permissions";
import { createPath, getResponseError } from "@/app/shared/utils";
import { getAttributeList } from "@/app/api/adminPanel/attributes/list";
import { TCommonResponseError } from "@/app/shared/types/error";

type TSearchParams = { [key: string]: string | string[] | undefined };

type TProps = {
  params: { lng: string };
  searchParams: TSearchParams;
};

const mapParamsToDto = (searchParams: TSearchParams) => {
  const limit = searchParams?.limit ?? DEFAULT_PAGE_LIMIT;
  const page = searchParams?.page ?? DEFAULT_PAGE;
  const search = searchParams?.search ?? undefined;

  return {
    limit,
    page,
    ...(search ? { search: searchParams?.search } : {}),
  };
};

async function loader(searchParams: TSearchParams) {
  console.log("[loader searchParams] ", searchParams);

  const paramsToDto = mapParamsToDto(searchParams);
  console.log("[loader paramsToDto] ", paramsToDto);

  try {
    const response = await getAttributeList(paramsToDto);
    return response.data as TAttributeList;
  } catch (error) {
    const errorResponse = error as Response;
    const responseData: TCommonResponseError = await errorResponse.json();
    const { message: formError, fieldErrors, success } = getResponseError(responseData) ?? {};
    throw new Error("errorBoundary.common.unexpectedError");
  }
}

export default async function AttributeListRoute(props: TProps) {
  const {
    params: { lng },
    searchParams,
  } = props;

  const [{ t }, isPermissions] = await Promise.all([
    useTranslation(lng, "index"),
    checkPermissionsByServer([EPermissions.Admin]),
  ]);

  if (!isPermissions) {
    redirect(
      createPath({
        route: ERoutes.PermissionDenied,
      }),
    );
  }

  try {
    const attributeList = await loader(searchParams);
    return <AttributeListPage attributeList={attributeList} />;
  } catch (error) {
    return <ErrorBoundary i18n={{ lng, t }} message={t(error.message)} />;
  }
}
