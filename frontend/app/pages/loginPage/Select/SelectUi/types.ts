import type React from 'react';
import type { ESelectDropdownPosition, ESelectTheme, ESelectSize } from './enums';

export type TLabelType = React.ReactNode | React.ReactNode[];

export type TSelectValue = string | number | null | undefined;

export type TSelectOption = {
  disabled?: boolean | null;
  name: string | number;
  value: TSelectValue;
  info?: string | React.ReactElement;
  hide?: boolean;
  prefixIcon?: JSX.Element;
};

export type TSelectDropdownPosition = `${ESelectDropdownPosition}`;

type TRenderListParams = {
  dropdownPosition: TSelectDropdownPosition;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectValue: React.Dispatch<React.SetStateAction<TSelectValue>>;
  theme: `${ESelectTheme}`;
  options: TSelectOption[];
  onChange?: (value: TSelectValue) => void;
  resultValue: TSelectValue;
};

export type TRenderOption = (
  option: TSelectOption,
  params: { isSelected: boolean },
) => React.ReactElement | null;

export type TRenderInputBody = (params: {
  inputValue?: string | number;
  label?: TLabelType;
}) => React.ReactElement;

export type TSelectClasses = {
  listWrapper?: string;
  itemList?: string;
};

export type TFilterOptionFn = (value: string, option: TSelectOption) => boolean;

export type TSelectMessages = {
  searchPlaceholder: string;
};

export type TSelectProps = {
  classes?: TSelectClasses;
  dataTestId?: string;
  defaultValue?: TSelectValue;
  disabled?: boolean;
  dropdownPosition?: TSelectDropdownPosition;
  fieldError?: string[] | null;
  fullOption?: boolean;
  hasError?: boolean;
  helperText?: string;
  hideArrowIcon?: boolean;
  hideCloseIcon?: boolean;
  isSearchable?: boolean;
  label?: TLabelType;
  loading?: boolean;
  name?: string;
  onChange?: (value: any) => void;
  onClear?: () => void;
  options?: TSelectOption[];
  placeholder?: string;
  prefixIcon?: JSX.Element;
  postfixIcon?: JSX.Element;
  theme?: `${ESelectTheme}`;
  value?: TSelectValue;
  info?: string | React.ReactElement;
  required?: boolean;
  renderList?: (params: TRenderListParams) => React.ReactElement;
  renderOption?: TRenderOption;
  renderInputBody?: TRenderInputBody;
  size?: `${ESelectSize}`;
  isDisabledItemClick?: boolean;
  hasFilter?: boolean;
  onFilter?: TFilterOptionFn;
  messages?: TSelectMessages;
};
