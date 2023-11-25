import { z } from "zod";
import { EFormFields } from "@/app/shared/components/search/searchingPanel/enums";

export const formSchema = z.object({
  [EFormFields.Search]: z.string().trim(),
});
