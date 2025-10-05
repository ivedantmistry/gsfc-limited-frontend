import {
  Home,
  Package,
  BarChart2,
  FileText,
  Users,
  AlertTriangle,
  PlusCircle,
} from "lucide-react";
export interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  permission?: string;
}
export const navItems: NavItem[] = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  {
    href: "/dashboard/alerts",
    icon: AlertTriangle,
    //
    label: "Alerts",
    permission: "alerts.view_alert",
  },
  {
    href: "/dashboard/products",
    icon: Package,
    label: "Products",
    permission: "inventory.can_view_products",
  },
  {
    href: "/dashboard/records",
    icon: FileText,
    label: "Test Records",
    permission: "inventory.can_view_test_records",
  },
  {
    href: "/dashboard/statistics",
    icon: BarChart2,
    label: "Quality Stats",
    // permission: "inventory.ad",
  },
  {
    href: "/dashboard/users",
    icon: Users,
    label: "Users",
    permission: "authentication.view_user_list",
  },
];
