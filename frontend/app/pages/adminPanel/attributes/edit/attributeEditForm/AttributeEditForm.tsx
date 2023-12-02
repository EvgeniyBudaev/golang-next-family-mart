"use client";

import type { FC } from "react";
import { experimental_useFormState as useFormState } from "react-dom";
import { attributeEditAction } from "@/app/actions/adminPanel/attributes/edit/attributeEditAction";
import { TAttributeDetail } from "@/app/api/adminPanel/attributes/detail/types";
import { useTranslation } from "@/app/i18n/client";
import { notify } from "@/app/uikit/components/toast/utils";
import { Input } from "@/app/uikit/components/input";
import { EFormFields } from "@/app/pages/adminPanel/attributes/edit/attributeEditForm/enums";
import { SubmitButton } from "@/app/shared/form/submitButton";
import "./AttributeEditForm.scss";

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
  attribute: TAttributeDetail;
};

export const AttributeEditForm: FC<TProps> = ({ attribute }) => {
  const [state, formAction] = useFormState(attributeEditAction, initialState);

  const { t } = useTranslation("index");
  if (state?.error) {
    notify.error({ title: state?.error });
  }

  return (
    <form action={formAction} className="AttributeEditForm-Form">
      <Input
        defaultValue={attribute.alias}
        errors={state?.errors?.alias}
        isDisabled={true}
        isRequired={true}
        label={t("form.alias") ?? "Alias"}
        name={EFormFields.Alias}
        type="text"
      />
      <Input
        defaultValue={attribute.name}
        errors={state?.errors?.name}
        isRequired={true}
        label={t("form.name") ?? "Name"}
        name={EFormFields.Name}
        type="text"
      />
      <Input
        defaultValue={attribute.type}
        errors={state?.errors?.type}
        isDisabled={true}
        isRequired={true}
        label={t("form.type") ?? "Type"}
        name={EFormFields.Type}
        type="text"
      />
      <input defaultValue={attribute.uuid} name={EFormFields.Uuid} type="hidden" />
      <div className="AttributeEditForm-FormFieldGroup"></div>
      <div className="AttributeEditForm-FormControl">
        <SubmitButton buttonText={t("common.actions.edit")} />
      </div>
    </form>
  );
};
