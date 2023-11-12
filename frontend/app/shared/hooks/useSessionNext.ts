import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { EPermissions } from "@/app/shared/enums";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    access_token: string;
    error?: string | null;
    expires: string;
    id_token: string;
    roles: EPermissions[];
    user: {
      name: string;
      email: string;
    };
  }
}

type TUseSessionNextResponse = {
  data: Session | null | undefined;
  status: "authenticated" | "unauthenticated" | "loading";
  update: any;
};

export const useSessionNext = (): TUseSessionNextResponse => {
  const session = useSession();
  return session;
};
