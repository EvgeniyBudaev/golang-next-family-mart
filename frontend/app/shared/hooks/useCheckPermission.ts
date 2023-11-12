import { useCallback } from "react";
import { EPermissions } from "@/app/shared/enums";
import { usePermissions } from "@/app/shared/hooks/usePermissions";
import { checkPermission } from "@/app/shared/utils/permissions/checkPermission";

type TUseCheckPermissionReturn = (permissions: EPermissions[]) => boolean;

export const useCheckPermission = (): TUseCheckPermissionReturn => {
  const userPermissions = usePermissions();

  return useCallback(
    (permissions: EPermissions[]) => {
      return checkPermission(userPermissions, permissions);
    },
    [userPermissions],
  );
};
