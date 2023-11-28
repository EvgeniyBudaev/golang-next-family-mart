"use client";

import { useEffect, type FC } from "react";
import { useRouter } from "next/navigation";

export const SetDynamicRoute: FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return <></>;
};
