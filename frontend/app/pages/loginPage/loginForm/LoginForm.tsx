"use client";

import type { FC } from "react";
import { experimental_useFormState as useFormState } from "react-dom";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { loginAction } from "@/app/actions/loginAction";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/loginPage/enums";
import { Button } from "@/app/uikit/components/button";
import { Input } from "@/app/uikit/components/input";
import "./LoginForm.scss";

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
  message: null,
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  const { t } = useTranslation("index");

  return (
    <Button className="LoginForm-Button" type="submit" aria-disabled={pending}>
      {t("pages.login.enter")}
    </Button>
  );
};

export const LoginForm: FC = () => {
  const [state, formAction] = useFormState(loginAction, initialState);
  console.log("state: ", state);

  const { t } = useTranslation("index");

  console.log(t("common.validation.email"));

  return (
    <form action={formAction}>
      <div className="LoginForm-FormFieldGroup">
        <Input
          isRequired={true}
          label={t("form.email.title") ?? "Email"}
          name={EFormFields.Email}
          type="text"
        />
        <Input
          isRequired={true}
          label={t("form.password.title") ?? "Password"}
          name={EFormFields.Password}
          type="text"
        />
      </div>
      <div className="LoginForm-Control">
        <SubmitButton />
      </div>
    </form>
  );
};
