"use client";

import isNil from "lodash/isNil";
import { redirect } from "next/navigation";
import { useEffect, type FC, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { catalogAddAction } from "@/app/actions/adminPanel/catalogs/add/catalogAddAction";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/adminPanel/catalogs/add/enums";
import { ERoutes } from "@/app/shared/enums";
import { FileUploader } from "@/app/shared/form/fileUploader";
import { SubmitButton } from "@/app/shared/form/submitButton";
import { useFiles } from "@/app/shared/hooks";
import { TFile } from "@/app/shared/types/file";
import { createPath } from "@/app/shared/utils";
import { Input } from "@/app/uikit/components/input";
import { notify } from "@/app/uikit/components/toast/utils";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./CatalogAddForm.scss";

export const CatalogAddForm: FC = () => {
  const { t } = useTranslation("index");
  const [files, setFiles] = useState<TFile[] | null>(null);
  const [state, formAction] = useFormState(catalogAddAction, {});
  const { pending } = useFormStatus();

  const { onAddFiles, onDeleteFile } = useFiles({
    fieldName: EFormFields.Image,
    files: files ?? [],
    setValue: (fieldName: string, files: TFile[]) => setFiles(files),
  });

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

  const handleDeleteFile = (file: TFile, files: TFile[]) => {
    onDeleteFile(file, files);
  };

  return (
    <form action={formAction} className="Form">
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

      <div className="Form-FieldGroup">
        <div className="Form-SubTitle">
          <Typography
            value={t("common.previews.addImage")}
            variant={ETypographyVariant.TextB3Regular}
          />
          <span className="Form-SubTitle__isRequired"> *</span>
        </div>
        <FileUploader
          accept={{
            "image/jpeg": [".jpeg"],
            "image/jpg": [".jpg"],
            "image/png": [".png"],
          }}
          errors={state?.errors?.image}
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

      <div className="Form-Control">
        <SubmitButton buttonText={t("common.actions.add")} />
      </div>
    </form>
  );
};
