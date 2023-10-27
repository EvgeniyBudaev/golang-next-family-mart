import * as React from "react";
import { useController, useFormContext } from "react-hook-form";
import type { TSelectProps as TSelectPropsUi } from "./SelectUi";

import { SelectUi } from "./SelectUi";

export type TSelectProps = TSelectPropsUi & {
  isNewFilter?: boolean;
  info?: string | React.ReactElement;
  name: string;
  title?: string;
  onChangeClient?: (value: any, prevValue: any) => void;
  required?: boolean;
  requiredIndicator?: boolean;
};

const SelectComponent: React.FC<TSelectProps> = ({
  isNewFilter = false,
  info,
  defaultValue,
  fullOption,
  name,
  onChangeClient,
  title = "",
  label,
  requiredIndicator,
  ...props
}) => {
  const { control, watch } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  });
  const onChange = (value: any) => {
    onChangeClient?.(value, field.value);
    field.onChange(value);
  };

  const onClear = () => {
    onChangeClient?.(null, field.value);
    field.onChange(null);
  };

  const value = watch(name);
  const hasError = !!error;
  const hasCheck = !!value && !hasError;
  const SelectJsx = (
    <SelectUi
      {...props}
      ref={field.ref}
      fullOption={fullOption}
      hasError={!!error}
      name={field.name}
      onChange={onChange}
      onClear={onClear}
      value={fullOption ? field.value?.value : field.value}
      info={info}
      label={label}
    />
  );

  return isNewFilter ? <div>{SelectJsx}</div> : SelectJsx;
};

export const Select = React.memo(SelectComponent);
