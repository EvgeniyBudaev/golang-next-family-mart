// import { revalidatePath } from "next/cache";
import { z } from "zod";
import { login } from "@/app/shared/api/auth";

export async function loginAction(prevState: any, formData: FormData) {
  const schema = z.object({
    email: z.string(),
    password: z.string(),
  });
  const data = schema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  try {
    const loginResponse = await login(data);
    if (!loginResponse.success) {
      return { message: "Not ok" };
    }
    // revalidatePath("/login");
    console.log("loginResponse.data: ", loginResponse.data);
    return { message: "Login successfully data: ", data: loginResponse.data };
  } catch (e) {
    return { message: "login failed" };
  }
}
