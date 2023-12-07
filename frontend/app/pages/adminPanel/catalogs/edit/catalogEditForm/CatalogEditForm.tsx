"use client";

import isNil from "lodash/isNil";
import { useEffect, type FC } from "react";
import { experimental_useFormState as useFormState } from "react-dom";
import { catalogEditAction } from "@/app/actions/adminPanel/catalogs/edit/catalogEditAction";
import { TCatalogDetail } from "@/app/api/adminPanel/catalogs/detail/types";
import { useTranslation } from "@/app/i18n/client";
import { notify } from "@/app/uikit/components/toast/utils";
import { Input } from "@/app/uikit/components/input";
import { EFormFields } from "@/app/pages/adminPanel/catalogs/edit/catalogEditForm/enums";
import { SubmitButton } from "@/app/shared/form/submitButton";
import "./CatalogEditForm.scss";

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
  catalog: TCatalogDetail;
};

export const CatalogEditForm: FC<TProps> = ({ catalog }) => {
  const [state, formAction] = useFormState(catalogEditAction, initialState);
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
    <form action={formAction} className="CatalogEditForm-Form">
      <Input
        defaultValue={catalog.alias}
        errors={state?.errors?.alias}
        isReadOnly={true}
        isRequired={true}
        label={t("form.alias") ?? "Alias"}
        name={EFormFields.Alias}
        type="text"
      />
      enable check
      <Input
        defaultValue={catalog.name}
        errors={state?.errors?.name}
        isRequired={true}
        label={t("form.name") ?? "Name"}
        name={EFormFields.Name}
        type="text"
      />
      <Input
        defaultValue={catalog.image}
        errors={state?.errors?.type}
        isReadOnly={true}
        isRequired={true}
        label={t("form.image") ?? "Image"}
        name={EFormFields.Image}
        type="text"
      />
      <input defaultValue={catalog.uuid} name={EFormFields.Uuid} type="hidden" />
      <div className="CatalogEditForm-FormFieldGroup"></div>
      <div className="CatalogEditForm-FormControl">
        <SubmitButton buttonText={t("common.actions.edit")} />
      </div>
    </form>
  );
};
