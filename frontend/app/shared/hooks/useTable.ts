import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import isNull from "lodash/isNull";
import isNil from "lodash/isNil";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

import { TDeleteModalState } from "@/app/entities/attributes/list/types";
import { TTableSortingColumnState } from "@/app/uikit/components/table/types";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/app/shared/constants/pagination";
import { TSearchParams } from "@/app/shared/components/search/types";
import { mapTableSortingToDto } from "@/app/api/sorting";
import { DEBOUNCE_TIMEOUT } from "@/app/shared/constants/transition";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const defaultSearch: string = !isNull(search) ? search : "";
  const defaultSort: string = !isNull(sort) ? sort : "";

  const page = !isNil(pageOption) ? pageOption.toString() : DEFAULT_PAGE_SIZE.toString();
  const limit = !isNil(limitOption) ? limitOption.toString() : DEFAULT_PAGE_SIZE.toString();

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
      setSearchParams(
        getSearchParams({
          page: (selected + 1).toString(),
        }),
      );
    },
    [getSearchParams, setSearchParams],
  );

  const handleChangeLimit = useCallback(
    (limit: number) => {
      setSearchParams(
        getSearchParams({
          limit: limit.toString(),
        }),
      );
    },
    [getSearchParams, setSearchParams],
  );

  const handleSortTableByProperty = (
    params?: TTableSortingColumnState | TTableSortingColumnState[],
  ) => {
    const formattedParams = mapTableSortingToDto(params);
    setSearchParams(
      getSearchParams({
        sort: formattedParams.sort,
        page: DEFAULT_PAGE.toString(),
      }),
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetcher = useCallback(
    debounce((query: string) => {
      setSearchParams(
        getSearchParams({
          search: query,
          page: DEFAULT_PAGE.toString(),
        }),
      );
    }, DEBOUNCE_TIMEOUT),
    [searchParams],
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
