import { Environment } from "@/app/environment";
import { getAccessToken } from "@/app/shared/utils/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params: { path } }: { params: { path: string[] } }) {
  const accessToken = await getAccessToken();

  return fetch(`${Environment.API_URL}/static/${path.join("/")}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
