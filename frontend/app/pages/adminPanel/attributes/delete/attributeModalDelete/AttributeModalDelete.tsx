"use client";

import isNil from "lodash/isNil";
import { useEffect, type FC } from "react";
import { experimental_useFormState as useFormState } from "react-dom";
import { attributeDeleteAction } from "@/app/actions/adminPanel/attributes/delete/attributeDeleteAction";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/adminPanel/attributes/delete/enums";
import { SubmitButton } from "@/app/shared/form/submitButton";
import { Button } from "@/app/uikit/components/button";
import { Modal } from "@/app/uikit/components/modal";
import { notify } from "@/app/uikit/components/toast/utils";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./AttributeModalDelete.scss";

declare module "react-dom" {
  function experimental_useFormState<State>(
    action: (state: State) => Promise<State>,
    initialState: State,
    permalink?: string,
  ): [state: State, dispatch: () => void];
  function experimental_useFormState<State, Payload>(
    action: (state: State, payload: Payload) => Promise<State>,
    initialState: State,
    permalink?: string,
  ): [state: State, dispatch: (payload: Payload) => void];
}

const initialState = {
  error: null,
  success: false,
};

type TProps = {
  attributeUuid: string;
  isOpen: boolean;
  onClose: () => void;
};

export const AttributeModalDelete: FC<TProps> = ({ attributeUuid, isOpen, onClose }) => {
  const { t } = useTranslation("index");
  const [state, formAction] = useFormState(attributeDeleteAction, initialState);

  useEffect(() => {
    if (state?.error) {
      notify.error({ title: state?.error });
    }
    if (!isNil(state.data) && state.success && !state?.error) {
      notify.success({ title: "Ok" });
    }
  }, [state]);

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
          <input defaultValue={attributeUuid} name={EFormFields.Uuid} type="hidden" />
        </Modal.Content>
        <Modal.Footer>
          <div className="AttributeModalDelete-Footer">
            <Button className="AttributeModalDelete-Cancel" onClick={onClose}>
              {t("common.actions.cancel")}
            </Button>
            <SubmitButton buttonText={t("common.actions.delete")} onClick={onClose} />
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
