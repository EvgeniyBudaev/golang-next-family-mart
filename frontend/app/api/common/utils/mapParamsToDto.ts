import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from "@/app/shared/constants/pagination";
import isNil from "lodash/isNil";
import { TSearchParams } from "@/app/api/common";

const getParamsField = (
  field: string | string[] | undefined,
  defaultValue: string | number | undefined,
): string | number | undefined => {
  if (isNil(field) || Array.isArray(field)) {
    return defaultValue;
  }
  return field;
};

const getLimit = (searchParams: TSearchParams) => {
  const paramField = getParamsField(searchParams?.limit, DEFAULT_PAGE_LIMIT);
  return !isNil(paramField) ? Number(paramField) : DEFAULT_PAGE_LIMIT;
};

const getPage = (searchParams: TSearchParams) => {
  const paramField = getParamsField(searchParams?.page, DEFAULT_PAGE);
  return !isNil(paramField) ? Number(paramField) : DEFAULT_PAGE;
};

export const mapParamsToDto = (searchParams: TSearchParams) => {
  const limit = getLimit(searchParams);
  const page = getPage(searchParams);
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
