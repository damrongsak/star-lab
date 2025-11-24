import { ReactNode } from "react";
import LayoutShell from "@/app/components/LayoutShell";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return <LayoutShell>{children}</LayoutShell>;
};

export default AdminLayout;
