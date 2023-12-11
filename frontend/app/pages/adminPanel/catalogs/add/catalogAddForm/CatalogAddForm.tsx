"use client";

import isNil from "lodash/isNil";
import { redirect } from "next/navigation";
import { useEffect, type FC, useState } from "react";
import { experimental_useFormState as useFormState } from "react-dom";
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

declare module "react-dom" {
  function experimental_useFormState<State>(
    action: (state: State) => Promise<State>,
    initialState: State,
    permalink?: string,
  ): [state: State, dispatch: () => void];
  function experimental_useFormState<State, Payload>(
    action: (state: State, payload: Payload) => Promise<State>,
    initialState: State,
    permalink?: string,
  ): [state: State, dispatch: (payload: Payload) => void];
}

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
    fieldName: EFormFields.Image,
    files: files ?? [],
    setValue: (fieldName: string, files: TFile[]) => setFiles(files),
  });

  useEffect(() => {
    console.log("files: ", files);
  }, [files]);

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
    if (!isNil(state.data) && state.success && !state?.error) {
      const path = createPath({
        route: ERoutes.AdminCatalogEdit,
        params: { alias: state.data?.alias },
      });
      redirect(path);
    }
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

  const handleLoadImage = (file: TFile) => {
    return file?.preview ? URL.revokeObjectURL(file.preview) : file;
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
            "image/png": [".png"],
          }}
          files={files ?? []}
          Input={<input hidden name={EFormFields.Files} type="file" />}
          // isLoading={fetcherFilesLoading}
          maxFiles={1}
          maxSize={1024 * 1024}
          multiple={false}
          onAddFile={handleAddFileToDefaultImage}
          onAddFiles={onAddFiles}
          onDeleteFile={handleDeleteFile}
        />
      </div>

      <div className="CatalogAddForm-FormFieldGroup">
        <div className="CatalogAddForm-SubTitle">
          <Typography
            value={t("common.previews.defaultImage")}
            variant={ETypographyVariant.TextB3Regular}
          />
        </div>
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
