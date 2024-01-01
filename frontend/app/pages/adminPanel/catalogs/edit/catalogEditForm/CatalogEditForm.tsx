"use client";

import isNil from "lodash/isNil";
import { useRouter } from "next/navigation";
import { useEffect, type FC, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { catalogEditAction } from "@/app/actions/adminPanel/catalogs/edit/catalogEditAction";
import { TCatalogDetail } from "@/app/api/adminPanel/catalogs/detail/types";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/adminPanel/catalogs/edit/enums";
import { ImageList } from "@/app/pages/adminPanel/catalogs/edit/imageList";
import { ERoutes } from "@/app/shared/enums";
import { FileUploader } from "@/app/shared/form/fileUploader";
import { SubmitButton } from "@/app/shared/form/submitButton";
import { useFiles } from "@/app/shared/hooks";
import { TFile } from "@/app/shared/types/file";
import { createPath } from "@/app/shared/utils";
import { Checkbox } from "@/app/uikit/components/checkbox";
import { notify } from "@/app/uikit/components/toast/utils";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import { Input } from "@/app/uikit/components/input";
import "./CatalogEditForm.scss";

type TProps = {
  catalog: TCatalogDetail;
};

export const CatalogEditForm: FC<TProps> = ({ catalog }) => {
  const router = useRouter();
  const { t } = useTranslation("index");
  const [files, setFiles] = useState<TFile[] | null>(null);
  const [isEnabled, setIsEnabled] = useState(catalog.isEnabled);
  const [state, formAction] = useFormState(catalogEditAction, {});
  const { pending } = useFormStatus();

  const handleCheckboxChange = () => {
    setIsEnabled(!isEnabled);
  };

  const { onAddFiles, onDeleteFile } = useFiles({
    fieldName: EFormFields.Image,
    files: files ?? [],
    setValue: (fieldName: string, files: TFile[]) => setFiles(files),
  });

  useEffect(() => {
    if (state?.error) {
      notify.error({ title: state?.error });
    }
    if (!isNil(state?.data) && state.success && !state?.error) {
      notify.success({ title: "Ok" });
    }
  }, [state]);

  const handleDeleteFile = (file: TFile, files: TFile[]) => {
    onDeleteFile(file, files);
  };

  const handleSubmit = (formData: FormData) => {
    const data = new FormData();
    data.append(EFormFields.Uuid, formData.get(EFormFields.Uuid));
    data.append(EFormFields.Alias, formData.get(EFormFields.Alias));
    data.append(EFormFields.Name, formData.get(EFormFields.Name));
    data.append(EFormFields.IsEnabled, isEnabled.toString());
    if (files) {
      files.forEach((file) => {
        data.append(EFormFields.Image, file);
      });
    }
    const alias = formData.get(EFormFields.Alias);
    formAction(data as FormData);
    const path = createPath({
      route: ERoutes.AdminCatalogEdit,
      params: { alias: alias as string },
    });
    router.push(path);
  };

  return (
    <form action={handleSubmit} className="CatalogEditForm-Form">
      <Input
        defaultValue={catalog.alias}
        errors={state?.errors?.alias}
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
          checked={isEnabled}
          id={EFormFields.IsEnabled}
          label={t("form.isEnabled") ?? "Enabled"}
          onChange={handleCheckboxChange}
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
