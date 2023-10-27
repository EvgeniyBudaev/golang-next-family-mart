import type * as React from 'react';
import type { ESelectTheme, ESelectSize } from '../enums';
import type { TSelectOption, TSelectValue, TRenderOption } from '../types';

export type TListBaseProps = {
  onClickItem: (event: React.MouseEvent, option: TSelectOption) => void;
  options: TSelectOption[];
  selectValue: TSelectValue;
  theme?: `${ESelectTheme}`;
  renderOption?: TRenderOption;
  size: `${ESelectSize}`;
  className?: string;
  isDisabledItemClick?: boolean;
};
