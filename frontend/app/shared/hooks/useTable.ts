"use client";

import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import { useCallback, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

import { mapTableSortingToDto } from "@/app/api/sorting";
import { TSearchParams } from "@/app/shared/components/search/types";
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from "@/app/shared/constants/pagination";
import { DEBOUNCE_TIMEOUT } from "@/app/shared/constants/transition";
import { useQueryParams } from "@/app/shared/hooks/useQueryParams";
import { TTableSortingColumnState } from "@/app/uikit/components/table/types";

type TParams = {
  pageOption?: number;
  limitOption?: number;
};

type TUseTable = (params: TParams) => {
  defaultSearch: string;
  isSearchActive: boolean;
  onChangeLimit: (size: number) => void;
  onChangePage: ({ selected }: { selected: number }) => void;
  onSearch: (event: ChangeEvent<HTMLFormElement>) => void;
  onSearchBlur: () => void;
  onSearchFocus: () => void;
  onSearchKeyDown: (event: KeyboardEvent) => void;
  onSortTableByProperty: (params?: TTableSortingColumnState | TTableSortingColumnState[]) => void;
};

export const useTable: TUseTable = ({ limitOption, pageOption }) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { queryParams, setQueryParams } = useQueryParams();
  const search = !isNil(queryParams) ? queryParams.get("search") : null;
  const sort = !isNil(queryParams) ? queryParams.get("sort") : null;
  const defaultSearch: string = !isNil(search) ? search : "";
  const defaultSort: string = !isNil(sort) ? sort : "";

  const page = !isNil(pageOption) ? pageOption.toString() : DEFAULT_PAGE.toString();
  const limit = !isNil(limitOption) ? limitOption.toString() : DEFAULT_PAGE_LIMIT.toString();

  const getSearchParams = (params: Partial<TSearchParams>) => {
    const defaultSearchParams: TSearchParams = {
      limit,
      page,
      // ...(!isNil(search) ? {search: search} : {}),
      search: isEmpty(defaultSearch) ? undefined : defaultSearch,
      sort: isEmpty(defaultSort) ? undefined : defaultSort,
    };
    const mergedParams = {
      ...defaultSearchParams,
      ...params,
    };
    return Object.fromEntries(
      // Object.entries(mergedParams).filter(([_key, value]) => !isEmpty(value)),
      Object.entries(mergedParams),
    );
  };

  const handleChangePage = useCallback(
    ({ selected }: { selected: number }) => {
      setQueryParams(
        getSearchParams({
          page: (selected + 1).toString(),
        }),
      );
    },
    [getSearchParams, setQueryParams],
  );

  const handleChangeLimit = useCallback(
    (limit: number) => {
      setQueryParams(
        getSearchParams({
          limit: limit.toString(),
        }),
      );
    },
    [getSearchParams, setQueryParams],
  );

  const handleSortTableByProperty = (
    params?: TTableSortingColumnState | TTableSortingColumnState[],
  ) => {
    const formattedParams = mapTableSortingToDto(params);
    setQueryParams(
      getSearchParams({
        sort: formattedParams.sort,
        page: DEFAULT_PAGE.toString(),
      }),
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetcher = useCallback(
    debounce((query: string) => {
      const newParams = getSearchParams({
        search: query,
        page: DEFAULT_PAGE.toString(),
      });
      setQueryParams(newParams);
    }, DEBOUNCE_TIMEOUT),
    [queryParams, setQueryParams],
  );

  const handleSearch = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    debouncedFetcher(event.target.value);
  };

  const handleSearchBlur = () => {
    setIsSearchActive(false);
  };
  const handleSearchFocus = () => {
    setIsSearchActive(true);
  };

  const handleSearchKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsSearchActive(false);
    }
  };

  return {
    defaultSearch,
    isSearchActive,
    onChangeLimit: handleChangeLimit,
    onChangePage: handleChangePage,
    onSearch: handleSearch,
    onSearchBlur: handleSearchBlur,
    onSearchFocus: handleSearchFocus,
    onSearchKeyDown: handleSearchKeyDown,
    onSortTableByProperty: handleSortTableByProperty,
  };
};
