"use client";

import isNil from "lodash/isNil";
import { useEffect, type FC, useState, type ChangeEvent } from "react";
import { useFormState } from "react-dom";
import { catalogEditAction } from "@/app/actions/adminPanel/catalogs/edit/catalogEditAction";
import { TCatalogDetail } from "@/app/api/adminPanel/catalogs/detail/types";
import { useTranslation } from "@/app/i18n/client";
import { notify } from "@/app/uikit/components/toast/utils";
import { Input } from "@/app/uikit/components/input";
import { EFormFields } from "@/app/pages/adminPanel/catalogs/edit/enums";
import { SubmitButton } from "@/app/shared/form/submitButton";
import "./CatalogEditForm.scss";
import { TParams } from "@/app/shared/types/form";
import { Checkbox } from "@/app/uikit/components/checkbox";
import { TFile } from "@/app/shared/types/file";
import { useFiles } from "@/app/shared/hooks";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import { FileUploader } from "@/app/shared/form/fileUploader";
import { Icon } from "@/app/uikit/components/icon";

const initialState = {
  error: null,
  success: false,
};

type TProps = {
  catalog: TCatalogDetail;
};

export const CatalogEditForm: FC<TProps> = ({ catalog }) => {
  const { t } = useTranslation("index");
  const [defaultImage, setDefaultImage] = useState<TFile | null>(null);
  const [files, setFiles] = useState<TFile[] | null>(null);
  const [state, formAction] = useFormState(catalogEditAction, initialState);
  const idCheckbox = "enabled";
  const [filter, setFilter] = useState<TParams>({
    enabled: catalog?.isEnabled ? [idCheckbox] : [],
  });
  // const enabled: boolean = filter[EFormFields.Enabled].includes(idCheckbox);

  const { onAddFiles, onDeleteFile } = useFiles({
    fieldName: EFormFields.Image,
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
    if (!isNil(state.data) && state.success && !state?.error) {
      notify.success({ title: "Ok" });
    }
  }, [state]);

  const handleChangeEnabled = (
    event: ChangeEvent<HTMLInputElement>,
    id: string,
    nameGroup: string,
  ) => {
    const {
      target: { checked, value },
    } = event;

    if (checked) {
      setFilter({
        ...filter,
        [nameGroup]: [...filter[nameGroup], value],
      });
    } else {
      setFilter({
        ...filter,
        [nameGroup]: [...filter[nameGroup].filter((x: string) => x !== value)],
      });
    }
  };

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

  const handleSubmit = (formData: FormData) => {
    if (!isNil(defaultImage)) {
      formData.append(EFormFields.DefaultImage, defaultImage);
    }
    formAction(formData);
  };

  return (
    <form action={formAction} className="CatalogEditForm-Form">
      <Input
        defaultValue={catalog.alias}
        errors={state?.errors?.alias}
        isReadOnly={true}
        isRequired={true}
        label={t("form.alias") ?? "Alias"}
        name={EFormFields.Alias}
        type="text"
      />
      <Input
        defaultValue={catalog.name}
        errors={state?.errors?.name}
        isRequired={true}
        label={t("form.name") ?? "Name"}
        name={EFormFields.Name}
        type="text"
      />
      <div className="CatalogEditForm-FormFieldGroup">
        {/*<Checkbox*/}
        {/*  checked={filter && filter[EFormFields.Enabled].includes(idCheckbox)}*/}
        {/*  id={idCheckbox}*/}
        {/*  label={t("form.enabled") ?? "Enabled"}*/}
        {/*  name={EFormFields.Enabled}*/}
        {/*  nameGroup="enabled"*/}
        {/*  onChange={(event, id, nameGroup) => handleChangeEnabled(event, id, nameGroup)}*/}
        {/*/>*/}
      </div>

      <div className="CatalogEditForm-FormFieldGroup">
        <div className="CatalogEditForm-SubTitle">
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
          name={EFormFields.Image}
          onAddFile={handleAddFileToDefaultImage}
          onAddFiles={onAddFiles}
          onDeleteFile={handleDeleteFile}
          type="file"
        />
      </div>

      <div className="CatalogEditForm-FormFieldGroup">
        <div className="CatalogEditForm-SubTitle">
          <Typography
            value={t("common.previews.defaultImage")}
            variant={ETypographyVariant.TextB3Regular}
          />
        </div>
        <div className="Previews-Thumb-Inner CatalogEditForm-DefaultImage">
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

      <input defaultValue={catalog.uuid} name={EFormFields.Uuid} type="hidden" />

      <div className="CatalogEditForm-FormFieldGroup"></div>

      <div className="CatalogEditForm-FormControl">
        <SubmitButton buttonText={t("common.actions.edit")} />
      </div>
    </form>
  );
};
