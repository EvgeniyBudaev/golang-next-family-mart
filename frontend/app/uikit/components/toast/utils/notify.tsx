import { toast } from "react-toastify";
import { EToast } from "@/app/uikit/components/toast/enums";
import { Toast } from "@/app/uikit/components/toast/Toast";

type TOptions = {
  description?: string;
  title?: string;
};

export const notify = {
  error: ({ title, description }: TOptions) =>
    toast.error(<Toast title={title} description={description} type={EToast.Error} />, {
      position: toast.POSITION.TOP_RIGHT,
    }),
  success: ({ title, description }: TOptions) =>
    toast.success(<Toast title={title} description={description} type={EToast.Success} />, {
      position: toast.POSITION.TOP_RIGHT,
    }),
};
