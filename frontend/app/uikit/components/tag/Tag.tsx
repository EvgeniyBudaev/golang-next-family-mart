import { memo } from "react";
import type { FC } from "react";
import clsx from "clsx";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./Tag.scss";

type TProps = {
  className?: string;
  dataTestId?: string;
  title: string;
};

const TagComponent: FC<TProps> = ({ className, dataTestId = "uikit__tag", title }) => {
  return (
    <div className={clsx("Tag", className)} data-testid={dataTestId}>
      <div className="Tag-Title">
        <Typography value={title} variant={ETypographyVariant.TextB4Regular} />
      </div>
    </div>
  );
};

export const Tag = memo(TagComponent);
