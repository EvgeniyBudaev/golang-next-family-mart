"use client";

import isNil from "lodash/isNil";
import { useEffect, type FC, useState } from "react";
import { useFormState } from "react-dom";
import { selectableEditAction } from "@/app/actions/adminPanel/selectables/edit/selectableEditAction";
import { useTranslation } from "@/app/i18n/client";
import type { TInitialState } from "@/app/pages/adminPanel/selectables/edit/types";
import { EFormFields } from "@/app/pages/adminPanel/selectables/edit/enums";
import { SubmitButton } from "@/app/shared/form/submitButton";
import { Input } from "@/app/uikit/components/input";
import { Modal } from "@/app/uikit/components/modal";
import { notify } from "@/app/uikit/components/toast/utils";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";

type TProps = {
  attributeAlias: string;
  defaultValue: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  selectableUuid: string;
};

export const SelectableModalEdit: FC<TProps> = ({
  attributeAlias,
  defaultValue,
  isOpen,
  onClose,
  selectableUuid,
}) => {
  const initialState: TInitialState = {
    data: undefined,
    error: undefined,
    errors: undefined,
    success: false,
  };
  const { t } = useTranslation("index");
  const [isFormSubmitting, setFormSubmitting] = useState(false);
  const [state, formAction] = useFormState(selectableEditAction, initialState);

  useEffect(() => {
    if (state?.error) {
      notify.error({ title: state?.error });
    }
    if (!isNil(state.data) && state.success && !state?.error) {
      notify.success({ title: "Ok" });
    }
  }, [state]);

  const handleSubmit = () => {
    if (!isFormSubmitting) {
      setFormSubmitting(true);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onCloseModal={onClose}>
      <form action={formAction}>
        <Modal.Header>
          <Typography
            value={t("pages.admin.attributeEdit.editModal")}
            variant={ETypographyVariant.TextB2Bold}
          />
        </Modal.Header>
        <Modal.Content>
          <div>
            <Input
              defaultValue={defaultValue}
              errors={state?.errors?.value}
              label={t("form.value") ?? "Value"}
              name={EFormFields.Value}
              type="text"
            />
            <input defaultValue={attributeAlias} name={EFormFields.AttributeAlias} type="hidden" />
            <input defaultValue={selectableUuid} name={EFormFields.Uuid} type="hidden" />
          </div>
        </Modal.Content>
        <Modal.Footer>
          <SubmitButton buttonText={t("common.actions.save")} onClick={handleSubmit} />
        </Modal.Footer>
      </form>
    </Modal>
  );
};
