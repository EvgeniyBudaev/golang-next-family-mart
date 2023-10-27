import type { TSelectOption } from '../types';

export const defaultFilterFn = (value: string, option: TSelectOption): boolean => {
  return (
    `${option.name}`.toLowerCase().includes(value) ||
    `${option.value ?? ''}`.toLowerCase().includes(value)
  );
};
