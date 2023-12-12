"use client";

import isNil from "lodash/isNil";
import { useEffect, type FC, useState } from "react";
import { useFormState } from "react-dom";
import { selectableAddAction } from "@/app/actions/adminPanel/selectables/add/selectableAddAction";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/adminPanel/selectables/add/enums";
import { SubmitButton } from "@/app/shared/form/submitButton";
import { Input } from "@/app/uikit/components/input";
import { Modal } from "@/app/uikit/components/modal";
import { notify } from "@/app/uikit/components/toast/utils";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import type { TInitialState } from "@/app/pages/adminPanel/selectables/add/types";

type TProps = {
  attributeAlias: string;
  attributeId: number;
  isOpen: boolean;
  onClose: () => void;
};

export const SelectableModalAdd: FC<TProps> = ({
  attributeAlias,
  attributeId,
  isOpen,
  onClose,
}) => {
  const initialState: TInitialState = {
    data: undefined,
    error: undefined,
    errors: undefined,
    success: false,
  };
  const { t } = useTranslation("index");
  const [isFormSubmitting, setFormSubmitting] = useState(false);
  const [state, formAction] = useFormState(selectableAddAction, initialState);

  useEffect(() => {
    if (!isOpen) {
      setFormSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (state?.error) {
      notify.error({ title: state?.error });
    }
    if (!isNil(state.data) && state.success && !state?.error) {
      notify.success({ title: "Ok" });
    }
  }, [state]);

  const handleSubmit = (event) => {
    if (!isFormSubmitting) {
      setFormSubmitting(true);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onCloseModal={onClose}>
      <form action={formAction} onSubmit={handleSubmit}>
        <Modal.Header>
          <Typography
            value={t("pages.admin.attributeEdit.addModal")}
            variant={ETypographyVariant.TextB2Bold}
          />
        </Modal.Header>
        <Modal.Content>
          <div>
            <Input
              errors={state?.errors?.value}
              label={t("form.value") ?? "Value"}
              name={EFormFields.Value}
              type="text"
            />
            <input defaultValue={attributeAlias} name={EFormFields.AttributeAlias} type="hidden" />
            <input defaultValue={attributeId} name={EFormFields.AttributeId} type="hidden" />
          </div>
        </Modal.Content>
        <Modal.Footer>
          <SubmitButton buttonText={t("common.actions.add")} />
        </Modal.Footer>
      </form>
    </Modal>
  );
};
