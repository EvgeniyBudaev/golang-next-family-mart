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
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from "@/app/shared/constants/pagination";
import { TSelectableList } from "@/app/api/adminPanel/selectables/list/types";

type TLoader = {
  alias: string;
};

async function loader(params: TLoader) {
  try {
    const attributeDetailResponse = await getAttributeDetail(params);
    const selectableListResponse = await getSelectableList({
      attributeId: Number(attributeDetailResponse.data.id),
      limit: DEFAULT_PAGE_LIMIT,
      page: DEFAULT_PAGE,
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
};

export default async function AttributeEditRoute(props: TProps) {
  const { params } = props;
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
    const { attributeDetail, selectableList } = await loader({ alias });
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
