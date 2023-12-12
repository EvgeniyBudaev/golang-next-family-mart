"use client";

import isNil from "lodash/isNil";
import { useEffect, type FC } from "react";
import { useFormState } from "react-dom";
import { attributeEditAction } from "@/app/actions/adminPanel/attributes/edit/attributeEditAction";
import { TAttributeDetail } from "@/app/api/adminPanel/attributes/detail/types";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/adminPanel/attributes/edit/enums";
import type { TInitialState } from "@/app/pages/adminPanel/attributes/edit/types";
import { SubmitButton } from "@/app/shared/form/submitButton";
import { Input } from "@/app/uikit/components/input";
import { notify } from "@/app/uikit/components/toast/utils";
import "./AttributeEditForm.scss";

type TProps = {
  attribute: TAttributeDetail;
};

export const AttributeEditForm: FC<TProps> = ({ attribute }) => {
  const initialState: TInitialState = {
    data: undefined,
    error: undefined,
    errors: undefined,
    success: false,
  };
  const [state, formAction] = useFormState(attributeEditAction, initialState);
  const { t } = useTranslation("index");

  useEffect(() => {
    if (state?.error) {
      notify.error({ title: state?.error });
    }
    if (!isNil(state.data) && state.success && !state?.error) {
      notify.success({ title: "Ok" });
    }
  }, [state]);

  return (
    <form action={formAction} className="AttributeEditForm-Form">
      <Input
        defaultValue={attribute.alias}
        errors={state?.errors?.alias}
        isReadOnly={true}
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
        isReadOnly={true}
        isRequired={true}
        label={t("form.type") ?? "Type"}
        name={EFormFields.Type}
        type="text"
      />
      <input defaultValue={attribute.uuid} name={EFormFields.Uuid} type="hidden" />
      <div className="AttributeEditForm-FormControl">
        <SubmitButton buttonText={t("common.actions.edit")} />
      </div>
    </form>
  );
};
