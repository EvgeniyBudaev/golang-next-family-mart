"use client";

import type { FC } from "react";
import { experimental_useFormState as useFormState } from "react-dom";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { signupAction } from "@/app/actions/signup/signupAction";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/signupPage/enums";
import { PhoneInputMask } from "@/app/shared/form/phoneInputMask";
import { Button } from "@/app/uikit/components/button";
import { Input } from "@/app/uikit/components/input";
import { notify } from "@/app/uikit/components/toast/utils";
import "./SignupForm.scss";

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

const SubmitButton = () => {
  const { pending } = useFormStatus();
  const { t } = useTranslation("index");

  return (
    <Button className="SignupForm-Button" type="submit" aria-disabled={pending}>
      {t("pages.signup.register")}
    </Button>
  );
};

export const SignupForm: FC = () => {
  const [state, formAction] = useFormState(signupAction, initialState);
  console.log("state: ", state);
  const { t } = useTranslation("index");
  if (state?.error) {
    notify.error({ title: state?.error });
  }

  return (
    <form action={formAction}>
      <div className="SignupForm-FormFieldGroup">
        <Input
          errors={state?.errors?.userName}
          isRequired={true}
          label={t("form.userName.title") ?? "User name"}
          name={EFormFields.UserName}
          type="text"
        />
        <Input
          errors={state?.errors?.firstName}
          isRequired={true}
          label={t("form.firstName.title") ?? "First Name"}
          name={EFormFields.FirstName}
          type="text"
        />
        <Input
          errors={state?.errors?.lastName}
          isRequired={true}
          label={t("form.lastName.title") ?? "Last Name"}
          name={EFormFields.LastName}
          type="text"
        />
        <PhoneInputMask
          errors={state?.errors?.mobileNumber}
          isRequired={true}
          label={t("form.mobileNumber.title") ?? "Mobile phone"}
          name={EFormFields.MobileNumber}
        />
        <Input
          errors={state?.errors?.email}
          isRequired={true}
          label={t("form.email.title") ?? "Email"}
          name={EFormFields.Email}
          type="text"
        />
        <Input
          errors={state?.errors?.password}
          isRequired={true}
          label={t("form.password.title") ?? "Password"}
          name={EFormFields.Password}
          type="text"
        />
        <Input
          errors={state?.errors?.passwordConfirm}
          isRequired={true}
          label={t("form.passwordConfirm.title") ?? "Password confirm"}
          name={EFormFields.PasswordConfirm}
          type="text"
        />
      </div>
      <div className="SignupForm-Control">
        <SubmitButton />
      </div>
    </form>
  );
};
