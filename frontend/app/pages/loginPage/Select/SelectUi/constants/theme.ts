import clsx from 'clsx';
import isNil from 'lodash/isNil';
import { ESelectSize, ESelectDropdownPosition, ESelectTheme } from '../enums';
import { TLabelType } from '../types';

export const THEME = {
  [ESelectTheme.Grey]: {
    root: () => clsx(''),
    headerWrapper: () => clsx(''),
    headerInner: () => clsx(''),
    headerSearchInput: () => clsx(''),
    inputWrapper: () => clsx(''),
    inputBody: () => clsx(''),
    inputLabel: () => clsx(''),
    inputValue: () => clsx(''),
    listWrapper: () => clsx(''),
    postfixIconWrapper: () => clsx(),
    headerArrowWrapper: () => clsx(),
    scrollListWrapper: () => clsx(''),
    listSearchWrapper: () => clsx(''),
    listSearch: () => clsx(''),
    listSearchInput: () => clsx(''),
  },

  [ESelectTheme.Notch]: {
    root: () => clsx('select-notch-theme-root'),
    headerWrapper: () => clsx('select-primary-theme-header-wrapper'),
    headerInner: (args: { disabled?: boolean; isOpen?: boolean; notError?: boolean }) =>
      clsx('select-primary-theme-header-inner', {
        'border-grey': !args.isOpen && args.notError,
        'border-primary bg-primary rounded-lg notch-btr': args.isOpen && args.notError,
        'border-accent1': !args.notError,
        'bg-grey rounded-lg notch': !args.disabled,
        'bg-grey': args.disabled,
      }),
    inputWrapper: (args: {
      disabled?: boolean;
      isOpen: boolean;
      notError: boolean;
      size: `${ESelectSize}`;
    }) =>
      clsx('select-notch-theme-input-wrapper', {
        [`select-input-wrapper-${args.size}`]: args.size,
        'border-grey': !args.isOpen && args.notError,
        'border-primary': args.isOpen && args.notError,
        'border-accent1': !args.notError,
        'bg-grey cursor-pointer notch': !args.disabled,
        'bg-grey cursor-not-allowed': args.disabled,
      }),
    inputBody: (args: { size: `${ESelectSize}` }) =>
      clsx('select-primary-theme-input-body', {
        [`select-input-body-${args.size}`]: args.size,
      }),
    inputLabel: (args: { inputValue: string | number | undefined }) =>
      clsx('select-primary-theme-input-label', {
        'top-1/2 -translate-y-1/2': isNil(args.inputValue),
        'top-1.5 text-[10px]': !isNil(args.inputValue),
      }),
    inputValue: (args: { label?: TLabelType }) =>
      clsx('select-primary-theme-input-value', {
        'mt-4': !isNil(args.label),
      }),
    postfixIconWrapper: () => clsx('select-primary-theme-postfix-icon-wrapper'),
    headerArrowWrapper: (args: { disabled?: boolean; isOpen: boolean }) =>
      clsx('select-primary-theme-header-arrow-wrapper', {
        'rotate-180': args.isOpen,
        'cursor-pointer': !args.disabled,
      }),
    headerSearchInput: (args: { size: `${ESelectSize}` }) =>
      clsx(
        'font-gilroy placeholder:text-grey-dark flex-1 border-0 p-0 focus:ring-0 text-base font-medium select-primary-theme-input-value bg-transparent text-dark',
        {
          'text-xs': args.size === ESelectSize.Small,
          'text-base': args.size === ESelectSize.Large,
        },
      ),
    listWrapper: (args: { dropdownPosition?: `${ESelectDropdownPosition}` }) =>
      clsx('select-primary-theme-list-wrapper text-dark', {
        'mt-2': args.dropdownPosition === ESelectDropdownPosition.Bottom,
        'mb-2': args.dropdownPosition === ESelectDropdownPosition.Top,
      }),
    listSearchWrapper: () => clsx('bg-light w-full p-2'),
    listSearch: (args: { size: `${ESelectSize}` }) =>
      clsx('bg-light border-grey flex w-full items-center gap-x-2 border rounded-lg', {
        'p-2': args.size === ESelectSize.Small || args.size === ESelectSize.Large,
      }),
    listSearchInput: (args: { size: `${ESelectSize}` }) =>
      clsx('font-gilroy placeholder:text-grey-dark flex-1 border-0 p-0 focus:ring-0', {
        'text-xs': args.size === ESelectSize.Small,
        'text-base': args.size === ESelectSize.Large,
      }),
    scrollListWrapper: () => clsx('select-primary-theme-scroll-list-wrapper'),
  },

  [ESelectTheme.Primary]: {
    root: () => clsx('select-primary-theme-root'),
    headerWrapper: () => clsx('select-primary-theme-header-wrapper'),
    headerInner: () => clsx(''),
    inputWrapper: (args: {
      disabled?: boolean;
      isOpen: boolean;
      notError: boolean;
      size: `${ESelectSize}`;
    }) =>
      clsx('select-primary-theme-input-wrapper', {
        'select-input-wrapper-small': args.size === ESelectSize.Small,
        'select-input-wrapper-large': args.size === ESelectSize.Large,
        'border-grey': !args.isOpen && args.notError,
        'border-primary': args.isOpen && args.notError,
        'border-accent1': !args.notError,
        'bg-light cursor-pointer': !args.disabled,
        'bg-grey cursor-not-allowed': args.disabled,
      }),
    inputBody: (args: { size: `${ESelectSize}` }) =>
      clsx('select-primary-theme-input-body', {
        'select-input-body-small': args.size === ESelectSize.Small,
        'select-input-body-large': args.size === ESelectSize.Large,
      }),
    inputLabel: (args: { inputValue: string | number | undefined }) =>
      clsx('select-primary-theme-input-label', {
        'top-1/2 -translate-y-1/2': isNil(args.inputValue),
        'top-1.5 text-[10px]': !isNil(args.inputValue),
      }),
    inputValue: (args: { label?: TLabelType }) =>
      clsx('select-primary-theme-input-value', {
        'mt-4': !isNil(args.label),
      }),
    postfixIconWrapper: () => clsx('select-primary-theme-postfix-icon-wrapper'),
    headerArrowWrapper: (args: { disabled?: boolean; isOpen: boolean }) =>
      clsx('select-primary-theme-header-arrow-wrapper', {
        'rotate-180': args.isOpen,
        'cursor-pointer': !args.disabled,
      }),
    headerSearchInput: (args: { size: `${ESelectSize}` }) =>
      clsx(
        'font-gilroy placeholder:text-grey-dark flex-1 border-0 p-0 focus:ring-0 text-base font-medium select-primary-theme-input-value bg-transparent text-dark',
        {
          'text-xs': args.size === ESelectSize.Small,
          'text-base': args.size === ESelectSize.Large,
        },
      ),
    listWrapper: (args: { dropdownPosition?: `${ESelectDropdownPosition}` }) =>
      clsx('select-primary-theme-list-wrapper text-dark', {
        'mt-2': args.dropdownPosition === ESelectDropdownPosition.Bottom,
        'mb-2': args.dropdownPosition === ESelectDropdownPosition.Top,
      }),
    listSearchWrapper: () => clsx('bg-light w-full p-2'),
    listSearch: (args: { size: `${ESelectSize}` }) =>
      clsx('bg-light border-grey flex w-full items-center gap-x-2 border rounded-lg', {
        'p-2': args.size === ESelectSize.Small || args.size === ESelectSize.Large,
      }),
    listSearchInput: (args: { size: `${ESelectSize}` }) =>
      clsx('font-gilroy placeholder:text-grey-dark flex-1 border-0 p-0 focus:ring-0 text-xs', {
        'text-xs': args.size === ESelectSize.Small,
        'text-base': args.size === ESelectSize.Large,
      }),
    scrollListWrapper: () => clsx('select-primary-theme-scroll-list-wrapper'),
  },
};
