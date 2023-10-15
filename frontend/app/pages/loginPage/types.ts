import type z from "zod";
import { formSchema } from "@/app/pages/loginPage/schemas";

export type TForm = z.infer<typeof formSchema>;
