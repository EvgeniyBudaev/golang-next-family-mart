// import { revalidatePath } from "next/cache";
import { z } from "zod";

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
    console.log("post login data: ", data);
    // revalidatePath("/login");
    return { message: "Login successfully" };
  } catch (e) {
    return { message: "login failed" };
  }
}
