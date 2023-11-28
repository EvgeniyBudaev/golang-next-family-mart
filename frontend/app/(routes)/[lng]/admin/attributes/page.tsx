import isNil from "lodash/isNil";
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

const getParamsField = (
  field: string | string[] | undefined,
  defaultValue: string | number | undefined,
) => {
  if (isNil(field) || Array.isArray(field)) {
    return defaultValue;
  }
  return field;
};

const getLimit = (searchParams: TSearchParams) => {
  return !isNil(getParamsField(searchParams?.limit, DEFAULT_PAGE_LIMIT))
    ? Number(searchParams?.limit)
    : DEFAULT_PAGE_LIMIT;
};

const mapParamsToDto = (searchParams: TSearchParams) => {
  const limit = getParamsField(searchParams?.limit, DEFAULT_PAGE_LIMIT);
  const page = getParamsField(searchParams?.page, DEFAULT_PAGE);
  const search = !Array.isArray(searchParams?.search)
    ? searchParams?.search ?? undefined
    : undefined;
  const sort = !Array.isArray(searchParams?.sort) ? searchParams?.sort ?? undefined : undefined;

  return {
    limit,
    page,
    ...(search ? { search: searchParams?.search } : {}),
    ...(sort ? { sort: searchParams?.sort } : {}),
  };
};

async function loader(searchParams: TSearchParams) {
  const paramsToDto = mapParamsToDto(searchParams);

  try {
    const response = await getAttributeList(paramsToDto);
    return response.data as TAttributeList;
  } catch (error) {
    const errorResponse = error as Response;
    const responseData: TCommonResponseError = await errorResponse.json();
    console.log("responseData: ", responseData);
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
