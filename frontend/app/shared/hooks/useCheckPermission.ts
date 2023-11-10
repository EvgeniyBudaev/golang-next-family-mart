import { useCallback } from "react";
import { EPermissions } from "@/app/shared/enums";
import { checkPermission } from "@/app/shared/utils/permissions/checkPermission";
import { APP_BASE_PERMISSIONS } from "@/app/shared/constants/permissions";

export type TUseCheckPermissionReturn = (permissions: EPermissions[]) => boolean;

export const useCheckPermission = (): TUseCheckPermissionReturn => {
  const userPermissions = APP_BASE_PERMISSIONS;

  return useCallback(
    (permissions: EPermissions[]) => {
      return checkPermission(userPermissions, permissions);
    },
    [userPermissions],
  );
};
