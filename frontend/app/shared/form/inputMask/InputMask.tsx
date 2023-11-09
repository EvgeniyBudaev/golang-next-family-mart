"use client";

import isFunction from "lodash/isFunction";
import { memo, useCallback, useEffect, useState } from "react";
import type { ChangeEventHandler, FC } from "react";
import ReactInputMask from "react-input-mask";
import type { BeforeMaskedStateChangeStates, InputState } from "react-input-mask";
import { Input as InputUi } from "@/app/uikit/components/input";
import { IInputProps as TInputPropsUi } from "@/app/uikit/components/input/Input";

export type TInputMaskProps = TInputPropsUi & {
  alwaysShowMask?: boolean;
  beforeMaskedStateChange?: (state: BeforeMaskedStateChangeStates) => InputState;
  name: string;
  normalize?: (value: string) => string;
  mask: string | (RegExp | string)[];
  maskPlaceholder?: string;
  onChange?: (value: string) => void;
  title?: string;
};

const InputMaskComponent: FC<TInputMaskProps> = (props) => {
  const {
    alwaysShowMask,
    beforeMaskedStateChange,
    defaultValue = "",
    normalize,
    mask,
    maskPlaceholder,
    onChange,
    title,
    ...rest
  } = props;

  const [showChild, setShowChild] = useState(false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (isFunction(normalize)) {
        event.target.value = normalize(event.target.value);
      }

      if (isFunction(onChange)) {
        onChange(event.target.value);
      }
    },
    [normalize, onChange],
  );

  // Wait until after client-side hydration to show
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    // You can show some kind of placeholder UI here
    return null;
  }

  return (
    <ReactInputMask
      alwaysShowMask={alwaysShowMask}
      beforeMaskedStateChange={beforeMaskedStateChange}
      mask={mask}
      maskPlaceholder={maskPlaceholder}
      onChange={handleChange}
    >
      <InputUi {...rest} isFocused={!!defaultValue} />
    </ReactInputMask>
  );
};

export const InputMask = memo(InputMaskComponent);
