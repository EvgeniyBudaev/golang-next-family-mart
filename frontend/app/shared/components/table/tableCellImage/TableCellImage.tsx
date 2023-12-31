"use client";

import isNil from "lodash/isNil";
import Image from "next/image";
import type { FC } from "react";
import { useProxyUrl } from "@/app/shared/hooks";
import { Icon } from "@/app/uikit/components/icon";
import "./TableCellImage.scss";

type TProps = {
  alt?: string;
  src?: string | null;
};

export const TableCellImage: FC<TProps> = ({ alt, src }) => {
  const { proxyUrl } = useProxyUrl();

  return (
    <>
      {!isNil(src) ? (
        <Image
          alt={alt ?? ""}
          className="TableCellImage"
          height={76}
          priority={true}
          src={`${proxyUrl}${src}`}
          width={76}
        />
      ) : (
        <Icon type="NoImage" />
      )}
    </>
  );
};
