"use client";

import type { FC } from "react";
import { experimental_useFormState as useFormState } from "react-dom";
import { selectableEditAction } from "@/app/actions/adminPanel/selectables/edit/selectableEditAction";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/adminPanel/selectables/edit/enums";
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
  error: "",
  success: false,
};

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
  const { t } = useTranslation("index");
  const [state, formAction] = useFormState(selectableEditAction, initialState);
  console.log("SelectableModalEdit state: ", state);
  if (state?.error) {
    notify.error({ title: state?.error });
  }
  console.log("selectableUuid: ", selectableUuid);

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
          <SubmitButton buttonText={t("common.actions.save")} onClick={onClose} />
        </Modal.Footer>
      </form>
    </Modal>
  );
};
