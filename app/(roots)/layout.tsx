import type { Metadata } from "next";
import AdminLayout from "@/components/sidebar/Admin-layout";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Tvtn Erp",
  description: "Educational Management system",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>
    
    {children}
    </AdminLayout>;
}
