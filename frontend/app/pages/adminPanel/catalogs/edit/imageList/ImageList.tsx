"use client";

import Image from "next/image";
import { useState, type FC } from "react";
import { catalogDeleteImageAction } from "@/app/actions/adminPanel/catalogs/deleteImage/catalogDeleteImageAction";
import { TCatalogImageListItem } from "@/app/api/adminPanel/catalogs/list/types";
import { useTranslation } from "@/app/i18n/client";
import { useProxyUrl } from "@/app/shared/hooks";
import { Icon } from "@/app/uikit/components/icon";
import { Tooltip } from "@/app/uikit/components/tooltip";
import "./ImageList.scss";

type TProps = {
  catalogAlias: string;
  images?: TCatalogImageListItem[];
};

export const ImageList: FC<TProps> = ({ catalogAlias, images }) => {
  const { proxyUrl } = useProxyUrl();
  const { t } = useTranslation("index");
  const [isFormSubmitting, setFormSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!isFormSubmitting) {
      setFormSubmitting((prev) => !prev);
    }
  };

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
            onClick={() => catalogDeleteImageAction(image.uuid, catalogAlias)}
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
