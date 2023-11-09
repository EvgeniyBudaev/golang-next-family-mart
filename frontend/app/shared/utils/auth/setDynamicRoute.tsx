"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const SetDynamicRoute = () => {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return <></>;
};
