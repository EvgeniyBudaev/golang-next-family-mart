"use client";

import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import { useCallback, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

import { mapTableSortingToDto } from "@/app/api/sorting";
import { TDeleteModalState } from "@/app/entities/attributes/list/types";
import { TSearchParams } from "@/app/shared/components/search/types";
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from "@/app/shared/constants/pagination";
import { DEBOUNCE_TIMEOUT } from "@/app/shared/constants/transition";
import { useQueryParams } from "@/app/shared/hooks/useQueryParams";
import { TTableSortingColumnState } from "@/app/uikit/components/table/types";

type TParams = {
  onDelete?: (alias: string) => void;
  pageOption?: number;
  limitOption?: number;
};

type TUseTable = (params: TParams) => {
  defaultSearch: string;
  deleteModal: { isOpen: boolean };
  isSearchActive: boolean;
  onChangeLimit: (size: number) => void;
  onChangePage: ({ selected }: { selected: number }) => void;
  onClickDeleteIcon: (alias: string) => void;
  onCloseDeleteModal: () => void;
  onDeleteSubmit: () => void;
  onSearch: (event: ChangeEvent<HTMLFormElement>) => void;
  onSearchBlur: () => void;
  onSearchFocus: () => void;
  onSearchKeyDown: (event: KeyboardEvent) => void;
  onSortTableByProperty: (params?: TTableSortingColumnState | TTableSortingColumnState[]) => void;
};

export const useTable: TUseTable = ({ onDelete, limitOption, pageOption }) => {
  const [deleteModal, setDeleteModal] = useState<TDeleteModalState>({ isOpen: false });
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
      search: isEmpty(defaultSearch) ? undefined : defaultSearch,
      sort: isEmpty(defaultSort) ? undefined : defaultSort,
    };
    const mergedParams = {
      ...defaultSearchParams,
      ...params,
    };
    return Object.fromEntries(
      Object.entries(mergedParams).filter(([_key, value]) => !isEmpty(value)),
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
      setQueryParams(
        getSearchParams({
          search: query,
          page: DEFAULT_PAGE.toString(),
        }),
      );
    }, DEBOUNCE_TIMEOUT),
    [queryParams],
  );

  const handleSearch = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    debouncedFetcher(event.target.value);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleClickDeleteIcon = useCallback(
    (alias: string) => {
      setDeleteModal({
        isOpen: true,
        alias,
      });
    },
    [setDeleteModal],
  );

  const handleDeleteSubmit = () => {
    if (deleteModal.alias) {
      onDelete?.(deleteModal.alias);
      handleCloseDeleteModal();
    }
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
    deleteModal,
    isSearchActive,
    onChangeLimit: handleChangeLimit,
    onChangePage: handleChangePage,
    onClickDeleteIcon: handleClickDeleteIcon,
    onCloseDeleteModal: handleCloseDeleteModal,
    onDeleteSubmit: handleDeleteSubmit,
    onSearch: handleSearch,
    onSearchBlur: handleSearchBlur,
    onSearchFocus: handleSearchFocus,
    onSearchKeyDown: handleSearchKeyDown,
    onSortTableByProperty: handleSortTableByProperty,
  };
};
