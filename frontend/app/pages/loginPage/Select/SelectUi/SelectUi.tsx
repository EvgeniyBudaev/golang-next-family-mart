import debounce from "lodash/debounce";
import isFunction from "lodash/isFunction";
import * as React from "react";
import { usePopper } from "react-popper";
import { Portal } from "@headlessui/react";

import { STYLES, DATA_TEST_ID } from "./constants";
import { ESelectDropdownPosition, ESelectSize, ESelectTheme } from "./enums";
import { Header } from "./Header";
import { useSelect } from "./hooks";
import { List } from "./List";
import type { TSelectMessages, TSelectOption, TSelectProps, TSelectValue } from "./types";
import { defaultFilterFn } from "./utils";
import { useClickBody } from "./hooks/useClickBody";

const DEFAULT_MESSAGES: TSelectMessages = {
  searchPlaceholder: "Поиск",
};

const SelectComponent = React.forwardRef<HTMLDivElement, TSelectProps>(
  (
    {
      dataTestId = DATA_TEST_ID,
      defaultValue,
      disabled,
      dropdownPosition = ESelectDropdownPosition.Bottom,
      fieldError,
      fullOption = false,
      hasError,
      helperText,
      hideArrowIcon,
      hideCloseIcon,
      info,
      isSearchable = true,
      label,
      loading,
      name,
      onChange,
      onClear,
      options = [],
      postfixIcon,
      prefixIcon,
      required = false,
      renderList,
      renderInputBody,
      renderOption,
      size = ESelectSize.Large,
      theme = ESelectTheme.Primary,
      value,
      classes,
      isDisabledItemClick,
      hasFilter,
      onFilter,
      messages: messagesProp,
    },
    ref,
  ) => {
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    const [selectValue, setSelectValue] = React.useState<TSelectValue>(value || defaultValue);
    const [resultValue, setResultValue] = React.useState<TSelectValue>(
      isFunction(onChange) ? value : selectValue,
    );
    const {
      inputValue,
      isDirty,
      isFocus,
      isOpen,
      onChangeDirty,
      onChangeFocus,
      onChangeInputValue,
      optionsProp,
      setIsOpen,
      setOptionsProp,
    } = useSelect({ options });

    React.useEffect(() => {
      setSelectValue(value || defaultValue);
      setResultValue(isFunction(onChange) ? value : selectValue);
    }, [defaultValue, onChange, selectValue, value]);

    const handleClickOutside = React.useCallback(
      (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          if (label) {
            onChangeInputValue(selectValue?.toString() ?? "");
          } else {
            onChangeInputValue(selectValue?.toString() ?? "");
          }
          onChangeFocus?.(false);
        }
      },
      [label, onChangeFocus, onChangeInputValue, selectValue],
    );

    React.useEffect(() => {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [handleClickOutside]);

    const notError = !hasError && !fieldError;
    const messages: TSelectMessages = React.useMemo(
      () => ({ ...DEFAULT_MESSAGES, ...messagesProp }),
      [messagesProp],
    );

    const [referenceElement, setReferenceElement] = React.useState<HTMLDivElement | null>(null);
    const [popperElement, setPopperElement] = React.useState<any>(null);
    const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
      placement: `${dropdownPosition}-start`,
    });

    const referenceElementWidth = React.useMemo(
      () => referenceElement?.clientWidth ?? 0,
      [referenceElement?.clientWidth],
    );

    const portalRef = React.useMemo(() => ({ current: popperElement }), [popperElement]);
    useClickBody({
      isOpen,
      setIsOpen,
      wrapperRef,
      portalRef,
    });

    React.useEffect(() => {
      if (isOpen) update?.();
    }, [update, isOpen]);

    React.useEffect(() => {
      if (!isOpen && options.length !== optionsProp.length) {
        setOptionsProp(options);
      }
    }, [isOpen, options, options.length, optionsProp, setOptionsProp]);

    const handleChangeOptions = React.useCallback(
      (options: TSelectOption[]) => {
        setOptionsProp(options);
      },
      [setOptionsProp],
    );

    const handleDebounce = debounce((value: string) => {
      const filterFn = onFilter ?? defaultFilterFn;
      if (!value) {
        handleChangeOptions(options);
      } else {
        handleChangeOptions(options.filter((option) => filterFn(value, option)));
      }
    }, 150);

    const handleFilterOption = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase();
      handleDebounce(value);
    };

    return (
      <div
        ref={wrapperRef}
        data-name={name}
        className={STYLES.root({ theme })}
        data-testid={dataTestId}
      >
        <div className={STYLES.headerWrapper({ theme })}>
          <div
            className={STYLES.headerInner({ disabled, isOpen, notError, theme })}
            ref={setReferenceElement}
          >
            <Header
              disabled={disabled}
              hideArrowIcon={hideArrowIcon}
              hideCloseIcon={hideCloseIcon}
              info={info}
              inputValue={inputValue}
              isDirty={isDirty}
              isFocus={isFocus}
              isOpen={isOpen}
              isSearchable={isSearchable}
              label={label}
              loading={loading}
              name={name}
              notError={notError}
              onChange={onChange}
              onChangeDirty={onChangeDirty}
              onChangeFocus={onChangeFocus}
              onChangeInputValue={onChangeInputValue}
              onClear={onClear}
              onFilterOption={handleFilterOption}
              options={optionsProp}
              postfixIcon={postfixIcon}
              prefixIcon={prefixIcon}
              ref={ref}
              renderInputBody={renderInputBody}
              resultValue={resultValue}
              required={required}
              selectValue={selectValue}
              setIsOpen={setIsOpen}
              setSelectValue={setSelectValue}
              size={size}
              theme={theme}
            />
          </div>

          <Portal
            as="div"
            ref={setPopperElement}
            style={{
              ...styles.popper,
              zIndex: 950,
              minWidth: referenceElementWidth,
              maxWidth: referenceElementWidth,
            }}
            {...attributes.popper}
          >
            {renderList ? (
              renderList({
                dropdownPosition,
                isOpen,
                onChange,
                options,
                resultValue,
                setIsOpen,
                setSelectValue,
                theme,
              })
            ) : (
              <List
                classes={classes}
                dataTestId={dataTestId}
                dropdownPosition={dropdownPosition}
                fullOption={fullOption}
                hasFilter={hasFilter}
                isDisabledItemClick={isDisabledItemClick}
                isOpen={isOpen}
                messages={messages}
                onChange={onChange}
                onFilterOption={handleFilterOption}
                options={optionsProp}
                resultValue={resultValue}
                setIsOpen={setIsOpen}
                setSelectValue={setSelectValue}
                size={size}
                theme={theme}
                renderOption={renderOption}
              />
            )}
          </Portal>
        </div>
      </div>
    );
  },
);
SelectComponent.displayName = "SelectUi";

export const SelectUi = React.memo(SelectComponent);
