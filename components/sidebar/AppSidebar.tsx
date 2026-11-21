// components/sidebar/AppSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";

import {
  ChevronRight,
  LayoutDashboard,
  Settings,
  Headset,
  ChevronsUpDown,
  School,
  Plus,
  BadgeCheck,
  CreditCard,
  Bell,
  LogOut
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import "../sidebar/css/Sidebar.css";
import { items, itemMaster, user, teams } from "./SidebarData";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function AppSidebar() {
  const [activeTeam, setActiveTeam] = useState(teams[0]);
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleToggle = (itemTitle: string) => {
    setActiveItem((prev) => (prev === itemTitle ? null : itemTitle));
  };

  const isActiveRoute = (url: string) => {
    // If pathname is null, return false
    if (pathname === null) return false;

    // Exact match or starts with the url (for nested routes)
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  const renderMenuItems = (menuItems: typeof items | typeof itemMaster) => {
    return menuItems.map((item) => {
      const isActive = item.subItems?.some((subItem) => isActiveRoute(subItem.url));
      const isOpen = activeItem === item.title || isActive;

      return (
        <Collapsible
          key={item.title}
          open={isOpen}
          onOpenChange={(open) => {
            if (open) {
              setActiveItem(item.title);
            } else {
              setActiveItem(null);
            }
          }}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                onClick={() => handleToggle(item.title)}
                className="hover:bg-custom-pink-300 hover:text-white text-lg"
              >
                {item.icon && <item.icon className="h-8 w-8" />}
                <span>{item.title}</span>
                <ChevronRight
                  className={`ml-auto transition-transform duration-200 ${isOpen ? 'rotate-90' : ''
                    }`}
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            {item.subItems && (
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.subItems.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        className={`hover:bg-custom-pink-300 hover:text-white ${isActiveRoute(subItem.url) ? 'bg-custom-red-600 text-white' : ''
                          }`}
                      >
                        <Link href={subItem.url}>
                          <span className="text-lg">{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            )}
          </SidebarMenuItem>
        </Collapsible>
      );
    });
  };

  return (
    <Sidebar variant="sidebar">
      {/* Header Section */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center bg-red-600 text-white rounded-lg">
                    <School className="size-6 bg-red-600 p-1  " />
                  </div>
                  <div className="grid flex-1 text-left text-lg leading-tight">
                    <span className="truncate font-semibold text-red-600">
                      {activeTeam.name}
                    </span>
                    <span className="truncate text-sm">
                      {activeTeam.plan}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto text-red-600" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Teams
                </DropdownMenuLabel>
                {teams.map((team, index) => (
                  <DropdownMenuItem
                    key={team.name}
                    onClick={() => setActiveTeam(team)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <team.logo className="size-4 shrink-0" />
                    </div>
                    {team.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Add team
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="sidebar">
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-custom-red-600 text-lg font-semibold">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`hover:bg-custom-pink-300 hover:text-white text-lg ${isActiveRoute('/dashboard') ? 'bg-custom-red-600 text-white' : ''
                    }`}
                >
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Process Sidebar */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-custom-red-600 text-lg font-semibold">
            Process
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(items)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Master Sidebar */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-custom-red-600 text-lg font-semibold">
            Master
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(itemMaster)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-custom-red-600 text-lg font-semibold">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`hover:bg-custom-pink-300 hover:text-white text-lg ${isActiveRoute('/settings') ? 'bg-custom-red-600 text-white' : ''
                    }`}
                >
                  <Link href="/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center bg-red-600 text-white rounded-lg">
                    <Headset className="bg-red-600 text-white size-6 p-1" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-red-600">
                      {user.name}
                    </span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-red-600" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="rounded-lg">
                        T
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}