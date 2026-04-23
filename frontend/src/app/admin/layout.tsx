'use client';
import {
  BarChart,
  ChevronLeft,
  Home,
  Package,
  PackagePlus,
  Receipt,
  Settings,
  ShoppingBag,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('scentalux_user_role');
    if (userRole !== 'admin') {
      router.replace('/');
    } else {
      setIsAdmin(true);
    }
  }, [router]);

  if (!isAdmin) {
    return null; // Or a loading spinner
  }
  
  return (
    <SidebarProvider>
      <Sidebar side="left">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h2 className="font-headline text-lg group-data-[collapsible=icon]:hidden">
              Admin
            </h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/admin/estadisticas'}
                tooltip="Estadísticas"
              >
                <Link href="/admin/estadisticas">
                  <BarChart />
                  <span>Estadísticas</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/admin/evidencias'}
                tooltip="Evidencias"
              >
                <Link href="/admin/evidencias">
                  <Receipt />
                  <span>Evidencias</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/admin/perfumes'}
                tooltip="Perfumes"
              >
                <Link href="/admin/perfumes">
                  <PackagePlus />
                  <span>Perfumes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/admin/inventario'}
                tooltip="Inventario"
              >
                <Link href="/admin/inventario">
                  <Package />
                  <span>Inventario</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Volver al inicio">
                    <Link href="/">
                      <Home />
                      <span>Volver al inicio</span>
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
