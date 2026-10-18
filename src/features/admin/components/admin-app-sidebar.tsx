"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

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
  SidebarRail,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";

import { Button } from "@/src/components/ui/button";
import { useLogout, useSession } from "@/src/features/auth/hooks/use-auth";
import { useInboxCounts } from "@/src/features/admin/whatsapp/lib/use-inbox-counts";
import {
  ADMIN_NAVIGATION,
  WHATSAPP_HREF,
  isActiveAdminRoute,
} from "@/src/features/admin/navigation/admin-navigation";

import LogoW from "../../../../public/leonice-logo-w.png";

const ADMIN_LOCATION = "Sede principal";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: user } = useSession();
  const logout = useLogout();
  const inbox = useInboxCounts();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        router.replace("/admin/login");
      },
    });
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/10 bg-[#062112]"
    >
      <SidebarHeader className="bg-[#062112] px-2 py-3">
        <div className="relative flex items-center justify-items-center justify-center gap-2">
          <div className="flex min-w-0 flex-1 justify-center">
            <div className="m-6 flex h-10 w-30 items-center justify-center">
              <Image
                src={LogoW}
                alt="Leonice Arenas"
                priority
                className="h-auto w-30 object-contain"
              />
            </div>
          </div>

          <SidebarTrigger
            className="
            size-8
            cursor-pointer
            shrink-0
            text-[#F2EBDB]/70
            hover:bg-white/10
            hover:text-[#F2EBDB]

            in-data-[collapsible=icon]:absolute
            in-data-[collapsible=icon]:left-1/2
            in-data-[collapsible=icon]:top-1/2
            in-data-[collapsible=icon]:-translate-x-1/2
            in-data-[collapsible=icon]:-translate-y-1/2
        "
          />
        </div>

        <div className="mt-2 h-px w-full bg-[#BF9250]/80" />
      </SidebarHeader>

      <SidebarContent className="bg-[#062112] px-2">
        <SidebarGroup className="px-0 py-3">
          <SidebarGroupContent>
            <nav aria-label="Secciones del panel">
              <SidebarMenu className="gap-1.5">
                {ADMIN_NAVIGATION.map((item) => {
                  const Icon = item.icon;

                  const isActive = isActiveAdminRoute(pathname, item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={isActive}
                        tooltip={item.name}
                        className="
                        relative
                        h-11
                        w-full
                        rounded-lg
                        text-[#F2EBDB]/70
                        transition-colors
                        hover:bg-white/10
                        hover:text-[#F2EBDB]
                        data-[active=true]:bg-white/10
                        data-[active=true]:text-[#F2EBDB]
                      "
                      >
                        <div className="flex w-full items-center  gap-2.5">
                          <Icon className="size-4.5 shrink-0" />

                          <span
                            className="
                            max-w-40
                            overflow-hidden
                            whitespace-nowrap
                            font-sans
                            text-sm
                            leading-none
                            opacity-100
                            transition-[max-width,opacity,transform]
                            duration-200
                            ease-out
                            in-data-[collapsible=icon]:max-w-0
                            in-data-[collapsible=icon]:-translate-x-1
                            in-data-[collapsible=icon]:opacity-0"
                          >
                            {item.name}
                          </span>
                        </div>

                        {item.href === WHATSAPP_HREF && inbox.pending > 0 && (
                          <span
                            aria-label={`${inbox.pending} conversaciones pendientes`}
                            className="absolute top-1/2 right-6 grid min-w-5 -translate-y-1/2 place-items-center rounded-full bg-red-700 px-1.5 font-sans text-[11px] font-semibold text-white tabular-nums in-data-[collapsible=icon]:top-1 in-data-[collapsible=icon]:right-0 in-data-[collapsible=icon]:min-w-4 in-data-[collapsible=icon]:translate-y-0 in-data-[collapsible=icon]:text-[9px]"
                          >
                            {inbox.pending}
                          </span>
                        )}

                        {isActive && (
                          <span
                            className="
                        absolute
                        right-2
                        top-1/2
                        size-2
                        -translate-y-1/2
                        in-data-[collapsible=icon]:hidden
                        "
                          >
                            <span className="absolute inset-0 animate-ping rounded-full bg-[#BF9250] opacity-60" />

                            <span className="absolute inset-0 rounded-full bg-[#BF9250]" />
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </nav>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-[#062112] p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="relative flex h-12 w-full items-center justify-center">
              <SidebarMenuButton
                render={<div />}
                size="lg"
                tooltip={user?.email ?? "Administrador"}
                className="
                  min-w-0
                    flex-1
                    cursor-default
                    text-[#F2EBDB]
                    hover:bg-white/10
                    hover:text-[#F2EBDB]
                    in-data-[collapsible=icon]:hidden
                "
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#BF9250] font-sans text-sm font-semibold text-[#062112]">
                  {(user?.email?.charAt(0) ?? "A").toUpperCase()}
                </div>

                <div
                  className="grid
                    min-w-0
                    flex-1
                    max-w-48
                    text-left
                    leading-tight
                    opacity-100
                    transition-[max-width,opacity,transform]
                    duration-200
                    ease-out
                    in-data-[collapsible=icon]:max-w-0
                    in-data-[collapsible=icon]:-translate-x-1
                    in-data-[collapsible=icon]:opacity-0"
                >
                  <span className="truncate font-sans text-sm font-medium">
                    {user?.email ?? "Administrador"}
                  </span>

                  <span className="truncate font-sans text-xs text-[#E0BC87]/70">
                    {ADMIN_LOCATION}
                  </span>
                </div>
              </SidebarMenuButton>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Cerrar sesión"
                disabled={logout.isPending}
                onClick={handleLogout}
                className="
                size-9
                cursor-pointer
                shrink-0
                text-[#F2EBDB]/70
                transition-[transform,background-color,color,opacity]
                duration-200
                ease-out
                hover:bg-white/10
                hover:text-[#F2EBDB]

                in-data-[collapsible=icon]:absolute
                in-data-[collapsible=icon]:left-1/2
                in-data-[collapsible=icon]:top-1/2
                in-data-[collapsible=icon]:-translate-x-1/2
                in-data-[collapsible=icon]:-translate-y-1/2
                "
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
