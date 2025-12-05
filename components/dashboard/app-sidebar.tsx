import { Building2, Calendar, Home, Settings, Users } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items for owner dashboard
const items = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "My Hotels",
    url: "/dashboard/hotels",
    icon: Building2,
  },
  {
    title: "Bookings",
    url: "/dashboard/bookings",
    icon: Calendar,
  },
];

export function AppSidebar() {
  return (
    <Sidebar
      variant="sticky"
      collapsible="icon"
      className="top-16 h-[calc(100vh-4rem)] border-r bg-background z-30"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
