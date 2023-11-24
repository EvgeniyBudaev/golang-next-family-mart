import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { EPermissions } from "@/app/shared/enums";

export async function checkPermissionsByServer(permissions: EPermissions[]): Promise<boolean> {
  const session = await getServerSession(authOptions as any);
  const userPermissions = session && session?.roles;

  if (!permissions?.length) {
    return true;
  }

  if (!userPermissions) {
    return false;
  }
  return userPermissions.some((item) => permissions.includes(item));
}
