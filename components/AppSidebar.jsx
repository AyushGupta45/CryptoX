"use client";

import {
  BarChart,
  BriefcaseBusiness,
  Home,
  Settings,
  Copyright,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Markets", url: "/markets", icon: BarChart },
  { title: "Portfolio", url: "/portfolio", icon: BriefcaseBusiness },
  { title: "Configuration", url: "/config", icon: Settings },
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-4 border-b gap-0">
        <Link href="/">
          <p className="text-3xl text-center font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            CryptoX
          </p>

          <p className="text-xs font-semibold">THE FUTURE OF FINANCE</p>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="py-6" asChild>
                    <Link href={item.url}>
                      <item.icon className="mr-1 sidebar-icons" />
                      <span className="text-base">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="text-sm font-medium flex flex-row items-center justify-center gap-1">
          <span><Copyright size={18}/> </span>
          <span>2024 CryptoX</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
