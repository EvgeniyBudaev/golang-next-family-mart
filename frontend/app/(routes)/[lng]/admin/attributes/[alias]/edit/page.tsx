import { redirect } from "next/navigation";
import { getAttributeDetail } from "@/app/api/adminPanel/attributes/detail/domain";
import { useTranslation } from "@/app/i18n";
import { AttributeEditPage } from "@/app/pages/adminPanel/attributes/edit";
import { EPermissions, ERoutes } from "@/app/shared/enums";
import { checkPermissionsByServer } from "@/app/shared/utils/permissions";
import { createPath, getResponseError } from "@/app/shared/utils";
import { ErrorBoundary } from "@/app/shared/components/errorBoundary";
import { TCommonResponseError } from "@/app/shared/types/error";
import { TAttributeDetail } from "@/app/api/adminPanel/attributes/detail/types";
import { getSelectableList } from "@/app/api/adminPanel/selectables/list/domain";
import { TSelectableList } from "@/app/api/adminPanel/selectables/list/types";
import { TSearchParams } from "@/app/api/common";
import { mapParamsToDto } from "@/app/api/common/utils";

type TLoader = {
  alias: string;
  searchParams: TSearchParams;
};

async function loader(params: TLoader) {
  const { alias, searchParams } = params;
  const paramsToDto = mapParamsToDto(searchParams);

  try {
    const attributeDetailResponse = await getAttributeDetail({ alias });
    const selectableListResponse = await getSelectableList({
      attributeId: Number(attributeDetailResponse.data.id),
      ...paramsToDto,
    });
    const attributeDetail = attributeDetailResponse.data as TAttributeDetail;
    const selectableList = selectableListResponse.data as TSelectableList;
    return { attributeDetail, selectableList };
  } catch (error) {
    const errorResponse = error as Response;
    const responseData: TCommonResponseError = await errorResponse.json();
    console.log("responseData: ", responseData);
    const { message: formError, fieldErrors, success } = getResponseError(responseData) ?? {};
    throw new Error("errorBoundary.common.unexpectedError");
  }
}

type TProps = {
  params: { lng: string };
  searchParams: TSearchParams;
};

export default async function AttributeEditRoute(props: TProps) {
  const { params, searchParams } = props;
  const { alias, lng } = params;

  const [{ t }, isPermissions] = await Promise.all([
    useTranslation(lng, "index"),
    checkPermissionsByServer([EPermissions.Admin]),
  ]);

  if (!isPermissions) {
    redirect(
      createPath({
        route: ERoutes.PermissionDenied,
      }),
    );
  }

  try {
    const { attributeDetail, selectableList } = await loader({ alias, searchParams });
    return (
      <AttributeEditPage
        attribute={attributeDetail}
        i18n={{ lng, t }}
        selectableList={selectableList}
      />
    );
  } catch (error) {
    return <ErrorBoundary i18n={{ lng, t }} message={t(error.message)} />;
  }
}
