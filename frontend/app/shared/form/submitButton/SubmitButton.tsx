"use client";

import type { FC, MouseEvent } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/app/uikit/components/button";

type TProps = {
  buttonText?: string;
  className?: string;
  onClick?: (event: MouseEvent) => void;
};

export const SubmitButton: FC<TProps> = ({ buttonText = "", className, onClick }) => {
  const { pending } = useFormStatus();

  return (
    <Button aria-disabled={pending} className={className} onClick={onClick} type="submit">
      {buttonText}
    </Button>
  );
};
