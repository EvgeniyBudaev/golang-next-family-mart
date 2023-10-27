import clsx from 'clsx';
import type { ESelectTheme, ESelectSize } from '../../../enums';
import { THEMES } from './themes';

export const STYLES = {
  root: (args: { theme: `${ESelectTheme}` }) => clsx(THEMES[args.theme].root()),
  emptyList: (args: { theme: `${ESelectTheme}` }) => clsx(THEMES[args.theme].emptyList()),
  itemList: (args: {
    disabled?: boolean | null;
    isSelected: boolean;
    theme: `${ESelectTheme}`;
    size: `${ESelectSize}`;
  }) =>
    clsx(
      THEMES[args.theme].itemList({
        disabled: args.disabled,
        isSelected: args.isSelected,
        size: args.size,
      }),
    ),
  itemWrapperList: (args: { theme: `${ESelectTheme}` }) =>
    clsx(THEMES[args.theme].itemWrapperList()),
};
