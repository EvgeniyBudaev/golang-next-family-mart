"use client";

import { useState } from "react";
import type { FC } from "react";
import { TSelectableList } from "@/app/api/adminPanel/selectables/list/types";
import { useTranslation } from "@/app/i18n/client";
import { createPath } from "@/app/shared/utils";
import { ERoutes } from "@/app/shared/enums";
import { useTable } from "@/app/shared/hooks";
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from "@/app/shared/constants/pagination";
import { AttributeListTable } from "@/app/entities/attributes/attributeListTable";
import { ETableColumns } from "@/app/entities/attributes/attributeListTable/enums";
import { SelectableListTable } from "@/app/entities/attributes/selectableListTable";
import "./Selectables.scss";
import { Button } from "@/app/uikit/components/button";
import { Tooltip } from "@/app/uikit/components/tooltip";
import { SelectableModalAdd } from "./add/selectableModalAdd";
import { TAttributeDetail } from "@/app/api/adminPanel/attributes/detail";

type TProps = {
  attribute: TAttributeDetail;
  selectableList: TSelectableList;
};

export const Selectables: FC<TProps> = ({ attribute, selectableList }) => {
  const { t } = useTranslation("index");
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleSelectableDelete = (alias: string) => {};

  const handleSelectableEdit = (alias: string) => {
    // const path = createPath({
    //   route: ERoutes.AdminAttributeEdit,
    //   params: { alias },
    // });
    // router.push(path);
  };

  const {
    defaultSearch,
    deleteModal,
    isSearchActive,
    onChangeLimit,
    onChangePage,
    onClickDeleteIcon,
    onCloseDeleteModal,
    onDeleteSubmit,
    onSearch,
    onSearchBlur,
    onSearchFocus,
    onSearchKeyDown,
    onSortTableByProperty,
  } = useTable({
    limitOption: selectableList?.limit ?? DEFAULT_PAGE_LIMIT,
    onDelete: handleSelectableDelete,
    pageOption: selectableList?.page ?? DEFAULT_PAGE,
  });

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleSubmitModal = ({ value }: { value: string }) => {
    // if (value) {
    //   handleAdd(value);
    //   handleCloseAddModal();
    // }
  };

  return (
    <div className="Selectables">
      <div className="Selectables-Button">
        <Tooltip message={t("common.actions.add")}>
          <Button
            // isDisabled={attribute?.type === EAttributeType.Double}
            onClick={handleOpenModal}
          >
            {t("common.actions.add")}
          </Button>
        </Tooltip>
      </div>
      <SelectableListTable
        fieldsSortState={{
          columns: [
            ETableColumns.Alias,
            ETableColumns.Name,
            ETableColumns.Type,
            ETableColumns.UpdatedAt,
          ],
          multiple: false,
          onChangeSorting: onSortTableByProperty,
        }}
        isLoading={false}
        onChangePage={onChangePage}
        onChangePageSize={onChangeLimit}
        onSelectableDelete={onClickDeleteIcon}
        onSelectableeEdit={handleSelectableEdit}
        selectableList={selectableList}
      />
      <SelectableModalAdd
        attributeAlias={attribute.alias}
        attributeId={attribute.id}
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
};
