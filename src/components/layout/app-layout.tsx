
'use client';
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { MainHeader } from './main-header';
import { SidebarNav } from './sidebar-nav';
import { Newspaper, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                <Newspaper className="size-6" />
            </Button>
            <h1 className="text-2xl font-headline text-foreground">LatestNews9.com</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/admin" className="w-full">
                <SidebarMenuButton isActive={pathname.startsWith('/admin')} tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
            <MainHeader />
            <main className="flex-1 p-4 md:p-6 bg-background">
                {children}
            </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
