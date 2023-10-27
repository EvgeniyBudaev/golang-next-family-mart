import isEmpty from "lodash/isEmpty";
import isFunction from "lodash/isFunction";
import isNil from "lodash/isNil";
import * as React from "react";
import { STYLES, DATA_TEST_ID } from "../constants";
import type { THeaderProps } from "./types";
import { TSelectValue } from "..";
import { useDefaultRef } from "../hooks/useDefaultRef";

const HeaderComponent = React.forwardRef<HTMLDivElement, THeaderProps>(
  (
    {
      disabled,
      hideArrowIcon,
      hideCloseIcon,
      inputValue,
      isDirty,
      isFocus,
      isOpen,
      isSearchable,
      label,
      loading,
      name,
      notError,
      onChange,
      onChangeDirty,
      onChangeFocus,
      onChangeInputValue,
      onClear,
      onFilterOption,
      options,
      prefixIcon,
      postfixIcon,
      required,
      resultValue,
      selectValue,
      setIsOpen,
      setSelectValue,
      theme,
      info,
      size,
      renderInputBody,
    }: THeaderProps,
    ref,
  ) => {
    const inputWrapperRef = React.useRef<HTMLDivElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const resultRef = useDefaultRef<HTMLDivElement>(ref);

    React.useEffect(() => {
      onChangeInputValue((resultValue as string) || "");
    }, [onChangeInputValue, resultValue]);

    const setRef = React.useCallback(
      (node: HTMLDivElement) => {
        inputWrapperRef.current = node;
        isFunction(resultRef) ? resultRef(node) : (resultRef.current = node);
      },
      [inputWrapperRef, resultRef],
    );

    const onClickInput: React.MouseEventHandler = React.useCallback(() => {
      onChangeFocus?.(true);
      if (!disabled && !isSearchable) {
        setIsOpen((prevState) => !prevState);
      }
      if (!disabled && isSearchable) {
        inputRef.current?.focus();
        setIsOpen(true);
      }
    }, [disabled, isSearchable, onChangeFocus, setIsOpen]);

    const getInputValue = React.useCallback(
      (value: TSelectValue) => {
        if (isNil(value)) {
          return undefined;
        }
        const searchValue = String(value);
        if (options.length) {
          const inputOption = options.find((option) => String(option.value) === searchValue);

          return inputOption?.name;
        }
      },
      [options],
    );

    const clearValue = React.useCallback<React.MouseEventHandler>(
      (event) => {
        event.stopPropagation();
        if (!disabled) {
          if (isFunction(onClear)) {
            onClear();
          }
          setSelectValue(undefined);
          onChangeDirty(false);
          onChangeInputValue("");
        }
      },
      [disabled, onChangeDirty, onChangeInputValue, onClear, setSelectValue],
    );

    const handleFilterOption = (event: React.ChangeEvent<HTMLInputElement>) => {
      !isEmpty(event.target.value) ? onChangeDirty(true) : onChangeDirty(false);
      onChangeInputValue(event.target.value);
      onFilterOption?.(event);
    };

    return (
      <div
        ref={setRef}
        className={STYLES.inputWrapper({
          isOpen,
          disabled,
          notError,
          theme,
          size,
        })}
        onClick={onClickInput}
      >
        <div className={STYLES.inputBody({ theme, size })}>
          {renderInputBody ? (
            renderInputBody({ inputValue: getInputValue(resultValue), label })
          ) : (
            <>
              {!!label && !isDirty && (
                <div
                  className={STYLES.inputLabel({ inputValue: getInputValue(resultValue), theme })}
                  data-testid={`${DATA_TEST_ID}__label`}
                >
                  {label}
                  {required && <div className={STYLES.required} />}
                </div>
              )}

              {!isSearchable && (
                <>
                  {!isNil(getInputValue(resultValue)) && (
                    <div className={STYLES.inputValue({ label, theme })}>
                      {getInputValue(resultValue)}
                    </div>
                  )}
                  <input name={name} value={(resultValue as string) || ""} hidden readOnly />
                </>
              )}

              {isSearchable && (
                <input
                  autoComplete="off"
                  className={STYLES.headerSearchInput({ theme, size })}
                  name={name}
                  onChange={handleFilterOption}
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                />
              )}
            </>
          )}
        </div>

        {!hideCloseIcon && !disabled && !isNil(getInputValue(resultValue)) && (
          <div onClick={clearValue}>Clear</div>
        )}
      </div>
    );
  },
);

HeaderComponent.displayName = "HeaderComponent";

export const Header = React.memo(HeaderComponent);
