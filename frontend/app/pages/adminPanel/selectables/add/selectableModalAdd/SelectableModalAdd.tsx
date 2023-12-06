"use client";

import isNil from "lodash/isNil";
import { useEffect, type FC } from "react";
import { experimental_useFormState as useFormState } from "react-dom";
import { selectableAddAction } from "@/app/actions/adminPanel/selectables/add/selectableAddAction";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/adminPanel/selectables/add/enums";
import { SubmitButton } from "@/app/shared/form/submitButton";
import { Input } from "@/app/uikit/components/input";
import { Modal } from "@/app/uikit/components/modal";
import { notify } from "@/app/uikit/components/toast/utils";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";

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
  const { t } = useTranslation("index");
  const [state, formAction] = useFormState(selectableAddAction, initialState);

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
          <SubmitButton buttonText={t("common.actions.add")} onClick={onClose} />
        </Modal.Footer>
      </form>
    </Modal>
  );
};
