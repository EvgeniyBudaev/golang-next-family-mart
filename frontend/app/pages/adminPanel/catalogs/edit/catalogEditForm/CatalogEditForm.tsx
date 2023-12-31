"use client";

import isNil from "lodash/isNil";
import { useEffect, type FC, useState, type ChangeEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { catalogEditAction } from "@/app/actions/adminPanel/catalogs/edit/catalogEditAction";
import { TCatalogDetail } from "@/app/api/adminPanel/catalogs/detail/types";
import { useTranslation } from "@/app/i18n/client";
import { ImageList } from "@/app/pages/adminPanel/catalogs/edit/imageList";
import { FileUploader } from "@/app/shared/form/fileUploader";
import { useFiles } from "@/app/shared/hooks";
import { TFile } from "@/app/shared/types/file";
import { TParams } from "@/app/shared/types/form";
import { Checkbox } from "@/app/uikit/components/checkbox";
import { notify } from "@/app/uikit/components/toast/utils";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import { Input } from "@/app/uikit/components/input";
import { EFormFields } from "@/app/pages/adminPanel/catalogs/edit/enums";
import { SubmitButton } from "@/app/shared/form/submitButton";
import "./CatalogEditForm.scss";

const initialState = {
  error: null,
  success: false,
};

type TProps = {
  catalog: TCatalogDetail;
};

export const CatalogEditForm: FC<TProps> = ({ catalog }) => {
  const { t } = useTranslation("index");
  const [files, setFiles] = useState<TFile[] | null>(null);
  const [state, formAction] = useFormState(catalogEditAction, initialState);
  const { pending } = useFormStatus();
  const idCheckbox = "isEnabled";
  const [filter, setFilter] = useState<TParams>({
    isEnabled: catalog?.isEnabled ? [idCheckbox] : [],
  });
  const enabled: boolean = filter[EFormFields.IsEnabled].includes(idCheckbox);
  console.log("filter: ", filter);

  const { onAddFiles, onDeleteFile } = useFiles({
    fieldName: EFormFields.Image,
    files: files ?? [],
    setValue: (fieldName: string, files: TFile[]) => setFiles(files),
  });

  useEffect(() => {
    console.log("files: ", files);
  }, [files]);

  useEffect(() => {
    if (state?.error) {
      notify.error({ title: state?.error });
    }
    if (!isNil(state?.data) && state.success && !state?.error) {
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
    console.log("checked: ", checked);
    console.log("value: ", value);
    console.log("nameGroup1: ", nameGroup);
    if (checked) {
      setFilter({
        ...filter,
        [nameGroup]: [...filter[nameGroup], value],
      });
    } else {
      console.log("nameGroup2: ", [...filter[nameGroup].filter((x: string) => x !== value)]);
      setFilter({
        ...filter,
        [nameGroup]: [...filter[nameGroup].filter((x: string) => x !== value)],
      });
    }
  };

  const handleDeleteFile = (file: TFile, files: TFile[]) => {
    onDeleteFile(file, files);
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
        <Checkbox
          checked={enabled}
          id={idCheckbox}
          label={t("form.isEnabled") ?? "Enabled"}
          name={EFormFields.IsEnabled}
          nameGroup="isEnabled"
          onChange={(event, id, nameGroup) => handleChangeEnabled(event, id, nameGroup)}
        />
      </div>

      <div className="CatalogEditForm-FormFieldGroup">
        <div className="CatalogEditForm-SubTitle">
          <Typography
            value={t("common.previews.images")}
            variant={ETypographyVariant.TextB3Regular}
          />
        </div>
        <ImageList catalogAlias={catalog.alias} images={catalog?.images ?? []} />
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
          isLoading={pending}
          maxFiles={1}
          maxSize={1024 * 1024}
          multiple={false}
          name={EFormFields.Image}
          onAddFiles={onAddFiles}
          onDeleteFile={handleDeleteFile}
          type="file"
        />
      </div>

      <input defaultValue={catalog.uuid} name={EFormFields.Uuid} type="hidden" />

      <div className="CatalogEditForm-FormControl">
        <SubmitButton buttonText={t("common.actions.edit")} />
      </div>
    </form>
  );
};
