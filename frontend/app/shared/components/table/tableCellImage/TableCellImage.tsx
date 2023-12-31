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
  const url = src ? `/${src}` : "http://127.0.0.1:8080/backend/static/uploads/catalog/image/mirrors.jpg";

  return (
    <>
      {!isNil(src) ? (
        <Image
          alt={alt ?? ""}
          className="TableCellImage"
          height={76}
          src={url}
          // https://github.com/vercel/next.js/discussions/18825
          unoptimized={process.env.NODE_ENV !== "production"}
          width={76}
          // src={`${proxyUrl}${src}`}
        />
      ) : (
        <Icon type="NoImage" />
      )}
    </>
  );
};
