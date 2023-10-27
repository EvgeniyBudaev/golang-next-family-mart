import clsx from 'clsx';
import { ESelectSize, ESelectTheme } from '../../../enums';

const getItemListSizeCls = (size: `${ESelectSize}`) => ({
  'select-list-item-large': size === ESelectSize.Large,
  'select-list-item-small': size === ESelectSize.Small,
});

export const THEMES = {
  [ESelectTheme.Primary]: {
    root: () => clsx('select-primary-theme-list-root'),
    emptyList: () => clsx('select-primary-theme-list-empty-list'),
    itemList: (args: { disabled?: boolean | null; isSelected: boolean; size: `${ESelectSize}` }) =>
      clsx('select-primary-theme-list-item flex', {
        ...getItemListSizeCls(args.size),
        'hover:bg-primary/[.08] cursor-pointer': !args.disabled && !args.isSelected,
        'bg-primary text-white cursor-text': args.isSelected,
        'text-grey-dark cursor-not-allowed': args.disabled,
      }),
    itemWrapperList: () => clsx('select-primary-theme-list-item-wrapper'),
  },

  [ESelectTheme.Notch]: {
    root: () => clsx('select-primary-theme-list-root'),
    emptyList: () => clsx('select-primary-theme-list-empty-list'),
    itemList: (args: { disabled?: boolean | null; isSelected: boolean; size: `${ESelectSize}` }) =>
      clsx('select-primary-theme-list-item flex', {
        ...getItemListSizeCls(args.size),
        'hover:bg-primary/[.08] cursor-pointer': !args.disabled && !args.isSelected,
        'bg-primary text-white cursor-text': args.isSelected,
        'text-grey-dark cursor-not-allowed': args.disabled,
      }),
    itemWrapperList: () => clsx('select-primary-theme-list-item-wrapper'),
  },

  [ESelectTheme.Grey]: {
    root: () => clsx('select-primary-theme-list-root'),
    emptyList: () => clsx('select-primary-theme-list-empty-list'),
    itemList: (args: { disabled?: boolean | null; isSelected: boolean; size: `${ESelectSize}` }) =>
      clsx('select-primary-theme-list-item', {
        ...getItemListSizeCls(args.size),
        'bg-primary text-white cursor-text': args.isSelected,
        'hover:bg-primary/[.08] cursor-pointer': !args.disabled,
        'cursor-not-allowed': args.disabled,
      }),
    itemWrapperList: () => clsx('select-primary-theme-list-item-wrapper'),
  },
};
