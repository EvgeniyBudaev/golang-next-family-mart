"use client";

import clsx from "clsx";
import type { FC } from "react";
import { useDropzone } from "react-dropzone";
import type { DropzoneOptions } from "react-dropzone";
import "./Dropzone.scss";

export type TDropzoneProps = {
  className?: string;
  dataTestId?: string;
  errors?: string[];
  name: string;
} & DropzoneOptions;

export const Dropzone: FC<TDropzoneProps> = ({
  children,
  className,
  dataTestId = "uikit__dropzone",
  errors,
  name,
  onDrop,
  ...rest
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, ...rest });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        "Dropzone",
        isDragActive ? "Dropzone__isDragActive" : "",
        {
          ["Dropzone__isError"]: Boolean(errors?.length),
        },
        className,
      )}
      data-testid={dataTestId}
    >
      <input
        {...getInputProps()}
        name={name}
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          opacity: "0",
          zIndex: "100",
          cursor: "pointer",
        }}
      />
      {children}
    </div>
  );
};
