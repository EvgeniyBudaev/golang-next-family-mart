"use client";

import isNil from "lodash/isNil";
import { useEffect, type FC, useState } from "react";
import { useFormState } from "react-dom";
import { attributeDeleteAction } from "@/app/actions/adminPanel/attributes/delete/attributeDeleteAction";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/adminPanel/attributes/delete/enums";
import type { TInitialState } from "@/app/pages/adminPanel/attributes/delete/types";
import { SubmitButton } from "@/app/shared/form/submitButton";
import { Button } from "@/app/uikit/components/button";
import { Modal } from "@/app/uikit/components/modal";
import { notify } from "@/app/uikit/components/toast/utils";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./AttributeModalDelete.scss";

type TProps = {
  isOpen: boolean;
  onClose: () => void;
  uuid: string;
};

export const AttributeModalDelete: FC<TProps> = ({ uuid, isOpen, onClose }) => {
  const initialState: TInitialState = {
    data: undefined,
    error: undefined,
    errors: undefined,
    success: false,
  };
  const { t } = useTranslation("index");
  const [isFormSubmitting, setFormSubmitting] = useState(false);
  const [state, formAction] = useFormState(attributeDeleteAction, initialState);

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
            value={t("common.modal.deleteQuestion")}
            variant={ETypographyVariant.TextB2Bold}
          />
        </Modal.Header>
        <Modal.Content>
          <input defaultValue={uuid} name={EFormFields.Uuid} type="hidden" />
        </Modal.Content>
        <Modal.Footer>
          <div className="AttributeModalDelete-Footer">
            <Button className="AttributeModalDelete-Cancel" onClick={onClose}>
              {t("common.actions.cancel")}
            </Button>
            <SubmitButton buttonText={t("common.actions.delete")} onClick={handleSubmit} />
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
