import clsx from "clsx";
import xor from "lodash/xor";
import { memo, useCallback, useEffect, useState } from "react";
import { flexRender } from "@tanstack/react-table";
import type { HeaderContext } from "@tanstack/react-table";

import { Button } from "@/app/uikit/components/button";
import { Icon } from "@/app/uikit/components/icon";
import { Modal, useModalWindow } from "@/app/uikit/components/modal";
import { TTableOptionsProps } from "@/app/uikit/components/table/options/types";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./Options.scss";

const Component = <T extends object>({
  columns,
  hiddenColumns,
  optionsCancelText,
  optionsChangeText,
  optionsFieldHeader,
  optionsModalHeader,
  setHiddenColumns,
}: TTableOptionsProps<T>) => {
  const { isOpenModal, closeModal, openModal } = useModalWindow();
  const [localHiddenColls, setLocalHiddenColls] = useState(hiddenColumns || []);

  useEffect(() => {
    setLocalHiddenColls(hiddenColumns || []);
  }, [hiddenColumns]);

  const handleCloseModal = useCallback(() => {
    closeModal();
    if (hiddenColumns) {
      setLocalHiddenColls(hiddenColumns);
    }
  }, [closeModal, hiddenColumns]);

  const onChangeColumn = (id: string) => () => {
    setLocalHiddenColls((prevHiddenColls) => xor(prevHiddenColls, [id]));
  };

  const submit = useCallback(() => {
    closeModal();
    setHiddenColumns(localHiddenColls);
  }, [closeModal, localHiddenColls, setHiddenColumns]);

  return (
    <>
      <Icon className="Options-Icon" onClick={openModal} type="Settings" />
      <Modal isOpen={isOpenModal} onCloseModal={handleCloseModal}>
        <Modal.Header>
          <Typography value={optionsModalHeader ?? ""} variant={ETypographyVariant.TextH6Bold} />
        </Modal.Header>
        <Modal.Content>
          <div className="Options-FieldHeader">
            <Typography
              value={optionsModalHeader ?? ""}
              variant={ETypographyVariant.TextB4Medium}
            />
          </div>
          <div className="Options-Columns">
            {columns.map((column) => {
              const canHide = column.getCanHide();
              return (
                <button
                  key={column.id}
                  className={clsx("Options-ColumnsButton", {
                    "Options-ColumnsButton__canHide": canHide,
                    "Options-ColumnsButton__notCanHide": !canHide,
                    "Options-ColumnsButton__notLocalHiddenColls":
                      canHide && !localHiddenColls.includes(column.id),
                    "Options-ColumnsButton__localHiddenColls":
                      canHide && localHiddenColls.includes(column.id),
                  })}
                  disabled={!canHide}
                  onClick={onChangeColumn(column.id)}
                  type="button"
                >
                  {flexRender(column.columnDef.header, {} as HeaderContext<T, unknown>)}
                </button>
              );
            })}
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="Options-ModalFooter">
            <Button className="Options-ModalCancel" onClick={handleCloseModal}>
              {optionsCancelText}
            </Button>
            <Button onClick={submit} type={"submit"}>
              {optionsChangeText}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export const Options = memo(Component) as typeof Component;
