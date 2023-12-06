"use client";

import isNil from "lodash/isNil";
import { redirect } from "next/navigation";
import { useEffect, type FC } from "react";
import { experimental_useFormState as useFormState } from "react-dom";
import { catalogAddAction } from "@/app/actions/adminPanel/catalogs/add/catalogAddAction";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/adminPanel/catalogs/add/enums";
import { SubmitButton } from "@/app/shared/form/submitButton";
import { Input } from "@/app/uikit/components/input";
import { notify } from "@/app/uikit/components/toast/utils";
import "./CatalogAddForm.scss";

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

export const CatalogAddForm: FC = () => {
  const [state, formAction] = useFormState(catalogAddAction, initialState);
  const { t } = useTranslation("index");

  useEffect(() => {
    if (state?.error) {
      notify.error({ title: state?.error });
    }
    if (!isNil(state.data) && state.success && !state?.error) {
      // const path = `/ru/admin/catalog/${state.data?.alias}/edit`;
      // redirect(path);
    }
  }, [state]);

  return (
    <form action={formAction} className="CatalogAddForm-Form">
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
      <div className="CatalogAddForm-FormFieldGroup"></div>
      <div className="CatalogAddForm-FormControl">
        <SubmitButton buttonText={t("common.actions.add")} />
      </div>
    </form>
  );
};
