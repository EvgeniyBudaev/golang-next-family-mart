type TGetTooltipOffsetParams = {
  placement?: string;
  referenceElement?: HTMLDivElement | null;
};

type TGetTooltipOffset = (props: TGetTooltipOffsetParams) => [number, number];

export const getTooltipOffset: TGetTooltipOffset = ({ placement, referenceElement }) => {
  if (placement === "bottom" || placement === "top") {
    return [0, 0];
  } else {
    return [0, 0];
  }
};
