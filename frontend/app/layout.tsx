import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {Layout} from "@/app/components/layout";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FamilyMart',
  description: 'FamilyMart online store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Layout>
        {children}
      </Layout>
      </body>
    </html>
  )
}
