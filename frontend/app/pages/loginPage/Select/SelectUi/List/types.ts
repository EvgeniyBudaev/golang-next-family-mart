import type * as React from 'react';
import type { ESelectTheme, ESelectSize } from '../enums';
import type {
  TSelectDropdownPosition,
  TSelectOption,
  TSelectValue,
  TRenderOption,
  TSelectClasses,
  TSelectMessages,
} from '../types';

export type TListProps = {
  dropdownPosition: TSelectDropdownPosition;
  isOpen: boolean;
  fullOption: boolean;
  onChange?: (value: any) => void;
  onFilterOption?: React.ChangeEventHandler<HTMLInputElement>;
  options: TSelectOption[];
  resultValue: TSelectValue;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectValue: React.Dispatch<React.SetStateAction<TSelectValue>>;
  theme: `${ESelectTheme}`;
  renderOption?: TRenderOption;
  size: `${ESelectSize}`;
  classes?: TSelectClasses;
  isDisabledItemClick?: boolean;
  hasFilter?: boolean;
  messages: TSelectMessages;
  dataTestId?: string;
};
