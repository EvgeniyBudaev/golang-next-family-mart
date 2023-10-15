import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Layout } from "@/app/components/layout";

export const metadata: Metadata = {
  title: "FamilyMart",
  description: "FamilyMart online store",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
