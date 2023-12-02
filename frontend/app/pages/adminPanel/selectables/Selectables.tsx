"use client";

import { useMemo, useState } from "react";
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
import { SelectableModalEdit } from "@/app/pages/adminPanel/selectables/edit/selectableModalEdit";
import { SelectableModalDelete } from "@/app/pages/adminPanel/selectables/delete/selectableModalDelete";

type TProps = {
  attribute: TAttributeDetail;
  selectableList: TSelectableList;
};

export const Selectables: FC<TProps> = ({ attribute, selectableList }) => {
  const { t } = useTranslation("index");
  const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [selectableUuid, setSelectableUuid] = useState("");

  const selectableValue = useMemo(() => {
    return (selectableList.content ?? []).find((item) => item.uuid === selectableUuid)?.value;
  }, [selectableUuid]);

  const handleCloseModal = () => {
    setIsOpenModalAdd(false);
    setIsOpenModalDelete(false);
    setIsOpenModalEdit(false);
  };

  const handleOpenModalAdd = () => {
    setIsOpenModalAdd(true);
  };

  const handleOpenModalDelete = () => {
    setIsOpenModalDelete(true);
  };

  const handleOpenModalEdit = () => {
    setIsOpenModalEdit(true);
  };

  const handleSelectableDelete = (uuid: string) => {
    setSelectableUuid(uuid);
    handleOpenModalDelete();
  };

  const handleSelectableEdit = (uuid: string) => {
    setSelectableUuid(uuid);
    handleOpenModalEdit();
  };

  const { onChangeLimit, onChangePage, onSortTableByProperty } = useTable({
    limitOption: selectableList?.limit ?? DEFAULT_PAGE_LIMIT,
    onDelete: handleSelectableDelete,
    pageOption: selectableList?.page ?? DEFAULT_PAGE,
  });

  return (
    <div className="Selectables">
      <div className="Selectables-Button">
        <Tooltip message={t("common.actions.add")}>
          <Button
            // isDisabled={attribute?.type === EAttributeType.Double}
            onClick={handleOpenModalAdd}
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
        onSelectableDelete={handleSelectableDelete}
        onSelectableEdit={handleSelectableEdit}
        selectableList={selectableList}
      />
      <SelectableModalAdd
        attributeAlias={attribute.alias}
        attributeId={attribute.id}
        isOpen={isOpenModalAdd}
        onClose={handleCloseModal}
      />
      <SelectableModalEdit
        defaultValue={selectableValue}
        attributeAlias={attribute.alias}
        isOpen={isOpenModalEdit}
        onClose={handleCloseModal}
        selectableUuid={selectableUuid}
      />
      <SelectableModalDelete
        attributeAlias={attribute.alias}
        isOpen={isOpenModalDelete}
        onClose={handleCloseModal}
        selectableUuid={selectableUuid}
      />
    </div>
  );
};
