"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChevronRightIcon,
  Command,
  GalleryVerticalEnd,
  Search,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import MySidebarMenu from "@/components/sidebar-menu"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
          items:[],
        },
        {
          title: "Starred",
          url: "#",
          items: [],
        },
        {
          title: "Settings",
          url: "#",
          items: [],
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
          items: [],
        },
        {
          title: "Explorer",
          url: "#",
          icon: BookOpen,
          items: [
            {
              title: "History",
              url: "#",
              items: [
                {
                  title: "China",
                  url: "#",
                  items: [
                    {
                      title: "Beijing",
                      url: "#",
                      items: [
                        {
                          title: "ChaoYangChaoYangChaoYang",
                          url: "#",
                          items: [
                            {
                              title: "CBD",
                              url: "#",
                              items: [],
                            },
                          ],
                        },
                        {
                          title: "Haidian",
                          url: "#",
                          items: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  title: "America",
                  url: "#",
                  items: [],
                },

              ],
            },
          ],
        },
        {
          title: "Quantum",
          url: "#",
          items: [],
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
          items: [],
        },
        {
          title: "Get Started",
          url: "#",
          items: [],
        },
        {
          title: "Tutorials",
          url: "#",
          items: [],
        },
        {
          title: "Changelog",
          url: "#",
          items: [],
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
          items: [],
        },
        {
          title: "Team",
          url: "#",
          items: [],
        },
        {
          title: "Billing",
          url: "#",
          items: [],
        },
        {
          title: "Limits",
          url: "#",
          items: [],
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarInset>
          <SidebarTrigger className="ml-1.5" />
        </SidebarInset>
        <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent>
            <form className="relative">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <SidebarInput
                id="search"
                placeholder="Search the docs..."
                className="pl-8"
              />
              <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
            </form>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="w-[calc(100%-0.45rem)]">
                      {item.items?.map((subItem) => {
                        if (subItem.items && subItem.items.length > 0) {
                          return (
                            <Collapsible 
                              key={subItem.title}
                              asChild
                              className="group/collapsible-1"
                            >
                              <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuButton>
                                    <span>{subItem.title}</span>
                                  <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible-1:rotate-90" />
                                </SidebarMenuButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {subItem.items?.map((subItem2) => (
                                    <SidebarMenuSubItem key={subItem2.title}>
                                      <SidebarMenuSubButton asChild>
                                        <a href={subItem2.url}>
                                          <span>{subItem2.title}</span>
                                        </a>  
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  ))}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                              </SidebarMenuItem>
                            </Collapsible>
                          )
                        } else {
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>)
                        }
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Components</SidebarGroupLabel>
          <MySidebarMenu data={data.navMain} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
