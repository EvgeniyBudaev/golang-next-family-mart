"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

export const SessionProviderWrapper = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
