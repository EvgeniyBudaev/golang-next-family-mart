import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { decrypt } from "./encryption";

export const getAccessToken = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    const accessTokenDecrypted = decrypt(session.access_token);
    return accessTokenDecrypted;
  }
  return null;
};

export const getIdToken = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    const idTokenDecrypted = decrypt(session.id_token);
    return idTokenDecrypted;
  }
  return null;
};
