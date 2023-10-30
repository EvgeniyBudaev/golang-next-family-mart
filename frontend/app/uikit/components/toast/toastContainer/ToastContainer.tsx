import type { FC } from "react";
import { ToastContainer as ReactToastContainer } from "react-toastify";

export const ToastContainer: FC = () => {
  return <ReactToastContainer hideProgressBar />;
};
