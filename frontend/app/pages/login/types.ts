import type z from "zod";
import { formSchema } from "@/app/pages/login/schemas";

export type TForm = z.infer<typeof formSchema>;
