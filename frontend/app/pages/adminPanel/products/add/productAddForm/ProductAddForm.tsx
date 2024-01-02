"use client";

import isNil from "lodash/isNil";
import isNull from "lodash/isNull";
import { redirect } from "next/navigation";
import { useEffect, type FC, useState, useCallback } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { OnChangeValue } from "react-select";
import { productAddAction } from "@/app/actions/adminPanel/products/add/productAddAction";
import { TDictCatalogListItem } from "@/app/api/dict/catalogs";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/adminPanel/products/add/enums";
import { ERoutes } from "@/app/shared/enums";
import { FileUploader } from "@/app/shared/form/fileUploader";
import { SubmitButton } from "@/app/shared/form/submitButton";
import { useFiles } from "@/app/shared/hooks";
import { useGetDictCatalogSelectOptions } from "@/app/shared/hooks/dict";
import { TFile } from "@/app/shared/types/file";
import { createPath } from "@/app/shared/utils";
import { Input } from "@/app/uikit/components/input";
import { Select } from "@/app/uikit/components/select";
import type { isSelectMultiType, TSelectOption } from "@/app/uikit/components/select/types";
import { notify } from "@/app/uikit/components/toast/utils";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./ProductAddForm.scss";

type TProps = {
  dictCatalogList: TDictCatalogListItem[];
};

export const ProductAddForm: FC<TProps> = ({ dictCatalogList }) => {
  const { t } = useTranslation("index");
  const [files, setFiles] = useState<TFile[] | null>(null);
  const [state, formAction] = useFormState(productAddAction, {});
  const { pending } = useFormStatus();
  const { dictCatalogOptions } = useGetDictCatalogSelectOptions({ dictCatalogList });
  const [catalogOptions, setCatalogOptions] = useState<TSelectOption>();

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
        route: ERoutes.AdminProductEdit,
        params: { alias: state.data?.alias },
      });
      redirect(path);
    }
  }, [state]);

  const handleDeleteFile = (file: TFile, files: TFile[]) => {
    onDeleteFile(file, files);
  };

  const handleChangeCatalog = useCallback(
    (selectedOption: OnChangeValue<TSelectOption, isSelectMultiType>) => {
      if (isNull(selectedOption)) return;
      setCatalogOptions(selectedOption);
    },
    [],
  );

  return (
    <form action={formAction} className="Form">
      <div className="Form-FieldGroup">
        <Select
          onChange={handleChangeCatalog}
          options={dictCatalogOptions}
          placeholder={t("pages.admin.productAdd.select") ?? "Select catalogs"}
          value={catalogOptions}
        />
        <input defaultValue={catalogOptions?.value} name={EFormFields.CatalogId} type="hidden" />
      </div>
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
