"use client";

import type { FC } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/app/uikit/components/button";

export const SubmitButton: FC = () => {
  const { pending } = useFormStatus();
  const { t } = useTranslation("index");

  return (
    <Button className="AttributeEditForm-Button" type="submit" aria-disabled={pending}>
      {t("common.actions.edit")}
    </Button>
  );
};
