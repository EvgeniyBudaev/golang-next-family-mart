"use client";

import isNil from "lodash/isNil";
import { redirect } from "next/navigation";
import { useEffect, type FC, useState, FormEvent } from "react";
import { useFormState } from "react-dom";
import { catalogAddAction } from "@/app/actions/adminPanel/catalogs/add/catalogAddAction";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/adminPanel/catalogs/add/enums";
import { ERoutes } from "@/app/shared/enums";
import { FileUploader } from "@/app/shared/form/fileUploader";
import { SubmitButton } from "@/app/shared/form/submitButton";
import { useFiles } from "@/app/shared/hooks";
import { TFile } from "@/app/shared/types/file";
import { createPath } from "@/app/shared/utils";
import { Icon } from "@/app/uikit/components/icon";
import { Input } from "@/app/uikit/components/input";
import { notify } from "@/app/uikit/components/toast/utils";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./CatalogAddForm.scss";

const initialState = {
  error: null,
  success: false,
};

export const CatalogAddForm: FC = () => {
  const { t } = useTranslation("index");
  const [defaultImage, setDefaultImage] = useState<TFile | null>(null);
  const [files, setFiles] = useState<TFile[] | null>(null);
  const [state, formAction] = useFormState(catalogAddAction, initialState);

  const { onAddFiles, onDeleteFile } = useFiles({
    fieldName: EFormFields.Files,
    files: files ?? [],
    setValue: (fieldName: string, files: TFile[]) => setFiles(files),
  });

  useEffect(() => {
    console.log("defaultImage: ", defaultImage);
    console.log("files: ", files);
  }, [files, defaultImage]);

  useEffect(() => {
    if (!isNil(defaultImage) && !isNil(defaultImage.preview)) {
      if (typeof defaultImage.preview === "string") {
        URL.revokeObjectURL(defaultImage.preview);
      }
    }
  }, [defaultImage]);

  useEffect(() => {
    if (state?.error) {
      notify.error({ title: state?.error });
    }
    // if (!isNil(state.data) && state.success && !state?.error) {
    //   const path = createPath({
    //     route: ERoutes.AdminCatalogEdit,
    //     params: { alias: state.data?.alias },
    //   });
    //   redirect(path);
    // }
  }, [state]);

  const handleAddFileToDefaultImage = (file: TFile) => {
    setDefaultImage(file);
  };

  const handleDeleteFile = (file: TFile, files: TFile[]) => {
    onDeleteFile(file, files);
    if (file.name === defaultImage?.name) {
      setDefaultImage(null);
    }
  };

  const handleLoadImage = (file: TFile | null) => {
    return file?.preview ? URL.revokeObjectURL(file.preview) : file;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formAction(state, {
      // ...omit(state, ['defaultImage']),
      defaultImage,
    });
  };

  return (
    <form action={formAction} className="CatalogAddForm-Form">
      <Input
        errors={state?.errors?.alias}
        isRequired={true}
        label={t("form.alias") ?? "Alias"}
        name={EFormFields.Alias}
        type="text"
      />
      <Input
        errors={state?.errors?.name}
        isRequired={true}
        label={t("form.name") ?? "Name"}
        name={EFormFields.Name}
        type="text"
      />

      <div className="CatalogAddForm-FormFieldGroup">
        <div className="CatalogAddForm-SubTitle">
          <Typography
            value={t("common.previews.addImage")}
            variant={ETypographyVariant.TextB3Regular}
          />
        </div>
        <FileUploader
          accept={{
            "image/jpeg": [".jpeg"],
            "image/jpg": [".jpg"],
            "image/png": [".png"],
          }}
          files={files ?? []}
          // isLoading={fetcherFilesLoading}
          maxFiles={1}
          maxSize={1024 * 1024}
          multiple={false}
          name={EFormFields.Files}
          onAddFile={handleAddFileToDefaultImage}
          onAddFiles={onAddFiles}
          onDeleteFile={handleDeleteFile}
          type="file"
        />
      </div>

      <div className="CatalogAddForm-FormFieldGroup">
        <div className="CatalogAddForm-SubTitle">
          <Typography
            value={t("common.previews.defaultImage")}
            variant={ETypographyVariant.TextB3Regular}
          />
        </div>
        <input hidden={true} name={EFormFields.DefaultImage} type="file" />
        <div className="Previews-Thumb-Inner CatalogAddForm-DefaultImage">
          {!isNil(defaultImage) && !isNil(defaultImage.preview) && (
            <img
              alt={defaultImage.name}
              className="Previews-Thumb-Image"
              src={defaultImage.preview}
              onLoad={() => handleLoadImage(defaultImage)}
            />
          )}
        </div>
        <div className="Previews-File">
          <div className="Previews-File-Inner">
            <div className="Previews-File-IconWrapper">
              <Icon className="Previews-File-ImageIcon" type="Image" />
            </div>
            <div className="Previews-File-Name">{defaultImage?.name}</div>
          </div>
        </div>
      </div>

      <div className="CatalogAddForm-FormControl">
        <SubmitButton buttonText={t("common.actions.add")} />
      </div>
    </form>
  );
};
