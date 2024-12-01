"use client";

import { BarChart, BriefcaseBusiness, Home, Settings } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Markets", url: "/markets", icon: BarChart },
  { title: "Portfolio", url: "/portfolio", icon: BriefcaseBusiness },
  { title: "Configuration", url: "/config", icon: Settings },
];

export default function AppSidebar() {
  const { data: session } = useSession();

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
        {!session ? (
          <div
            onClick={() => signIn("google")}
            className="flex min-h-[55px] items-center justify-center w-full gap-1 py-2 rounded-md border-2 shadow-sm cursor-pointer hover:bg-white"
          >
            <FcGoogle size={26} />
            <p className="font-semibold text-sm">Continue with Google</p>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex min-h-[55px] items-center gap-2 cursor-pointer w-full py-2 px-3 rounded-md border-2 shadow-sm hover:bg-white">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage
                    src={session.user.image}
                    alt={session.user.name}
                  />
                  <AvatarFallback>{session.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{session.user.name}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="rounded-lg min-w-[200px]"
              align="start"
              sideOffset={8}
              side="top"
            >
              <DropdownMenuLabel>
                <p className="text-xs text-gray-500 truncate py-1">
                  {session.user.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-start gap-1 py-1">
                    <FiLogOut className="text-gray-500" />
                    <span className="text-xs text-gray-500 font-semibold">
                      Log out
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
