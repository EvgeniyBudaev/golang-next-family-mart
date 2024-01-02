"use client";

import isNil from "lodash/isNil";
import { useRouter } from "next/navigation";
import { useEffect, type FC, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { productEditAction } from "@/app/actions/adminPanel/products/edit/productEditAction";
import { TProductDetail } from "@/app/api/adminPanel/products/detail/types";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/adminPanel/products/edit/enums";
import { ImageList } from "@/app/pages/adminPanel/products/edit/imageList";
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
import "./ProductEditForm.scss";

type TProps = {
  product: TProductDetail;
};

export const ProductEditForm: FC<TProps> = ({ product }) => {
  const router = useRouter();
  const { t } = useTranslation("index");
  const [files, setFiles] = useState<TFile[] | null>(null);
  const [isEnabled, setIsEnabled] = useState(product.isEnabled);
  const [state, formAction] = useFormState(productEditAction, {});
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
      route: ERoutes.AdminProductEdit,
      params: { alias: alias as string },
    });
    router.push(path);
  };

  return (
    <form action={handleSubmit} className="ProductEditForm-Form">
      <Input
        defaultValue={product.alias}
        errors={state?.errors?.alias}
        isRequired={true}
        label={t("form.alias") ?? "Alias"}
        name={EFormFields.Alias}
        type="text"
      />
      <Input
        defaultValue={product.name}
        errors={state?.errors?.name}
        isRequired={true}
        label={t("form.name") ?? "Name"}
        name={EFormFields.Name}
        type="text"
      />
      <div className="ProductEditForm-FormFieldGroup">
        <Checkbox
          checked={isEnabled}
          id={EFormFields.IsEnabled}
          label={t("form.isEnabled") ?? "Enabled"}
          onChange={handleCheckboxChange}
        />
      </div>

      <div className="ProductEditForm-FormFieldGroup">
        <div className="ProductEditForm-SubTitle">
          <Typography
            value={t("common.previews.images")}
            variant={ETypographyVariant.TextB3Regular}
          />
        </div>
        <ImageList productAlias={product.alias} images={product?.images ?? []} />
      </div>

      <div className="ProductEditForm-FormFieldGroup">
        <div className="ProductEditForm-SubTitle">
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

      <input defaultValue={product.uuid} name={EFormFields.Uuid} type="hidden" />

      <div className="ProductEditForm-FormControl">
        <SubmitButton buttonText={t("common.actions.edit")} />
      </div>
    </form>
  );
};
