import { useSessionNext } from "@/app/shared/hooks/useSessionNext";

export const usePermissions = () => {
  const session = useSessionNext();
  return session.data?.roles ?? [];
};
