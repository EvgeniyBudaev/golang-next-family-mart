import clsx from 'clsx';
import type { ESelectDropdownPosition, ESelectTheme, ESelectSize } from '../enums';
import { THEME } from './theme';
import { TLabelType } from '../types';

export const STYLES = {
  root: (args: { theme: `${ESelectTheme}` }) => clsx(THEME[args.theme].root()),

  headerWrapper: (args: { theme: `${ESelectTheme}` }) => clsx(THEME[args.theme].headerWrapper()),

  headerInner: (args: {
    theme: `${ESelectTheme}`;
    disabled?: boolean;
    isOpen?: boolean;
    notError?: boolean;
  }) =>
    clsx(
      THEME[args.theme].headerInner({
        disabled: args.disabled,
        isOpen: args.isOpen,
        notError: args.notError,
      }),
    ),

  inputWrapper: (args: {
    disabled?: boolean;
    isOpen: boolean;
    notError: boolean;
    theme: `${ESelectTheme}`;
    size: `${ESelectSize}`;
  }) =>
    clsx(
      THEME[args.theme].inputWrapper({
        disabled: args.disabled,
        isOpen: args.isOpen,
        notError: args.notError,
        size: args.size,
      }),
    ),

  inputBody: (args: { theme: `${ESelectTheme}`; size: `${ESelectSize}` }) =>
    clsx(THEME[args.theme].inputBody({ size: args.size })),

  required: 'select-primary-theme-required',

  inputLabel: (args: { inputValue: string | number | undefined; theme: `${ESelectTheme}` }) =>
    clsx(
      THEME[args.theme].inputLabel({
        inputValue: args.inputValue,
      }),
    ),

  inputValue: (args: { label?: TLabelType; theme: `${ESelectTheme}` }) =>
    clsx(THEME[args.theme].inputValue({ label: args.label })),

  postfixIconWrapper: (args: { theme: `${ESelectTheme}` }) =>
    clsx(THEME[args.theme].postfixIconWrapper()),

  headerArrowWrapper: (args: { disabled?: boolean; isOpen: boolean; theme: `${ESelectTheme}` }) =>
    clsx(
      THEME[args.theme].headerArrowWrapper({
        disabled: args.disabled,
        isOpen: args.isOpen,
      }),
    ),

  headerSearchInput: (args: { theme: `${ESelectTheme}`; size: `${ESelectSize}` }) =>
    clsx(THEME[args.theme].headerSearchInput({ size: args.size })),

  listWrapper: (args: {
    dropdownPosition?: `${ESelectDropdownPosition}`;
    theme: `${ESelectTheme}`;
  }) =>
    clsx(
      THEME[args.theme].listWrapper({
        dropdownPosition: args.dropdownPosition,
      }),
    ),

  listSearchWrapper: (args: { theme: `${ESelectTheme}` }) =>
    clsx(THEME[args.theme].listSearchWrapper()),
  listSearchInput: (args: { theme: `${ESelectTheme}`; size: `${ESelectSize}` }) =>
    clsx(THEME[args.theme].listSearchInput({ size: args.size })),
  listSearch: (args: { theme: `${ESelectTheme}`; size: `${ESelectSize}` }) =>
    clsx(
      THEME[args.theme].listSearch({
        size: args.size,
      }),
    ),

  scrollListWrapper: (args: { theme: `${ESelectTheme}` }) =>
    clsx(THEME[args.theme].scrollListWrapper()),
};
