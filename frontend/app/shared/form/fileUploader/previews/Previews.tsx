"use client";

import clsx from "clsx";
import isNil from "lodash/isNil";
import type { FC } from "react";
import { useTranslation } from "@/app/i18n/client";
import { TFile } from "@/app/shared/types/file";
import { Icon } from "@/app/uikit/components/icon";
import { Tooltip } from "@/app/uikit/components/tooltip";
import "./Previews.scss";

type TProps = {
  className?: string;
  files?: TFile[];
  onDeleteFile: (file: TFile) => void;
  onLoad: (file: TFile) => void;
};

export const Previews: FC<TProps> = ({ className, files, onDeleteFile, onLoad }) => {
  const { t } = useTranslation("index");
  // console.log("files: ", files);
  const renderThumbs =
    !isNil(files) &&
    files.map((file) => (
      <div className="Previews-Thumb" key={file?.name || "" + file?.lastModified}>
        <div className="Previews-Thumb-Inner">
          {!isNil(file.preview) && (
            <img
              alt={file.name}
              className="Previews-Thumb-Image"
              src={file.preview}
              // Revoke data uri after image is loaded
              // onLoad={() => onLoad(file)}
            />
          )}
        </div>
        <div className="Previews-File">
          <div className="Previews-File-Inner">
            <div className="Previews-File-IconWrapper">
              <Icon className="Previews-File-ImageIcon" type="Image" />
            </div>
            <div className="Previews-File-Name">{file.name}</div>
          </div>

          <div className="Previews-File-IconWrapper">
            <Tooltip message={t("common.previews.deleteImage")}>
              <Icon
                className="Previews-File-TrashIcon"
                onClick={() => onDeleteFile(file)}
                type="Trash"
              />
            </Tooltip>
          </div>
        </div>
      </div>
    ));

  return <aside className={clsx("Previews", className)}>{renderThumbs}</aside>;
};
