"use client";

import type { FC } from "react";
import { experimental_useFormState as useFormState } from "react-dom";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { loginAction } from "@/app/actions/loginAction";
import "./LoginForm.scss";
import { useTranslation } from "@/app/i18n/client";

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

  return (
    <button className="LoginForm-Button" type="submit" aria-disabled={pending}>
      Submit
    </button>
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
        <label htmlFor="email">Email</label>
        <input type="text" id="email" name="email" required={true} />
        <label htmlFor="password">Password</label>
        <input type="text" id="password" name="password" required={true} />
      </div>
      <div className="LoginForm-Control">
        <SubmitButton />
      </div>
    </form>
  );
};
