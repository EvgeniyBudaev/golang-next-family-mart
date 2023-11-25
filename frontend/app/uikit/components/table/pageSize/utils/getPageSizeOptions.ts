import { TSelectOption } from "@/app/uikit/components/select/types";

export const getPageSizeOptions = (numbers: number[]): TSelectOption[] =>
  numbers.map((step) => ({
    label: step.toString(),
    value: step.toString(),
  }));
