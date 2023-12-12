"use client";

import isNil from "lodash/isNil";
import { redirect } from "next/navigation";
import { useEffect, type FC, useRef } from "react";
import { useFormState } from "react-dom";
import { attributeAddAction } from "@/app/actions/adminPanel/attributes/add/attributeAddAction";
import { useTranslation } from "@/app/i18n/client";
import type { TInitialState } from "@/app/pages/adminPanel/attributes/add/types";
import { EFormFields } from "@/app/pages/adminPanel/attributes/add/enums";
import { ERoutes } from "@/app/shared/enums";
import { SubmitButton } from "@/app/shared/form/submitButton";
import { createPath } from "@/app/shared/utils";
import { Input } from "@/app/uikit/components/input";
import { notify } from "@/app/uikit/components/toast/utils";
import "./AttributeAddForm.scss";

export const AttributeAddForm: FC = () => {
  const initialState: TInitialState = {
    data: undefined,
    error: undefined,
    errors: undefined,
    success: false,
  };
  const [state, formAction] = useFormState(attributeAddAction, initialState);
  console.log("state: ", state);
  const formRef = useRef<HTMLFormElement | null>(null);
  const { t } = useTranslation("index");

  useEffect(() => {
    if (state?.error) {
      notify.error({ title: state?.error });
    }
    if (!isNil(state.data) && state.success && !state?.error && !state?.errors) {
      const path = createPath({
        route: ERoutes.AdminAttributeEdit,
        params: { alias: state.data.alias },
      });
      redirect(path);
    }
  }, [state]);

  return (
    <form action={formAction} className="AttributeAddForm-Form" ref={formRef}>
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
