"use client";

import Image from "next/image";
import { type FC } from "react";
import { productDeleteImageAction } from "@/app/actions/adminPanel/products/deleteImage/productDeleteImageAction";
import { TProductImageListItem } from "@/app/api/adminPanel/products/list/types";
import { useTranslation } from "@/app/i18n/client";
import { useProxyUrl } from "@/app/shared/hooks";
import { Icon } from "@/app/uikit/components/icon";
import { Tooltip } from "@/app/uikit/components/tooltip";
import "./ImageList.scss";

type TProps = {
  productAlias: string;
  images?: TProductImageListItem[];
};

export const ImageList: FC<TProps> = ({ productAlias, images }) => {
  const { proxyUrl } = useProxyUrl();
  const { t } = useTranslation("index");

  return (
    <div className="ImageList">
      {(images ?? []).map((image) => (
        <div className="ImageList-Item" key={image.uuid}>
          <Image
            alt={image?.name ?? ""}
            height={76}
            priority={true}
            src={`${proxyUrl}${image?.url}`}
            width={76}
          />
          <div
            className="ImageList-IconWrapper"
            onClick={() => productDeleteImageAction(image.uuid, productAlias)}
          >
            <Tooltip message={t("common.previews.deleteImage")}>
              <Icon className="ImageList-TrashIcon" type="Trash" />
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
};
