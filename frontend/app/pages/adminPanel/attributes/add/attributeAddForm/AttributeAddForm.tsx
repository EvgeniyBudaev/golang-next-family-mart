"use client";

import type { FC } from "react";
import { experimental_useFormState as useFormState } from "react-dom";
import { attributeAddAction } from "@/app/actions/adminPanel/attributes/add/attributeAddAction";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/adminPanel/attributes/add/enums";
import { SubmitButton } from "@/app/shared/form/submitButton";
import { Input } from "@/app/uikit/components/input";
import { notify } from "@/app/uikit/components/toast/utils";

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

export const AttributeAddForm: FC = () => {
  const [state, formAction] = useFormState(attributeAddAction, initialState);
  console.log("state: ", state);
  const { t } = useTranslation("index");
  if (state?.error) {
    notify.error({ title: state?.error });
  }

  return (
    <form action={formAction} className="AttributeAddForm-Form">
      <Input
        errors={state?.errors?.alias}
        isRequired={true}
        label={t("form.alias") ?? "Alias"}
        name={EFormFields.Alias}
        type="text"
      />
      <Input
        errors={state?.errors?.name}
        isRequired={true}
        label={t("form.name") ?? "Name"}
        name={EFormFields.Name}
        type="text"
      />
      <Input
        errors={state?.errors?.type}
        isRequired={true}
        label={t("form.type") ?? "Type"}
        name={EFormFields.Type}
        type="text"
      />
      <div className="AttributeAddForm-FormFieldGroup"></div>
      <div className="AttributeAddForm-FormControl">
        <SubmitButton buttonText={t("common.actions.add")} />
      </div>
    </form>
  );
};
