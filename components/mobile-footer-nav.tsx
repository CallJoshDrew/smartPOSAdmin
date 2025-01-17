'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, List, Table, BarChart, Settings } from 'lucide-react';

const links = [
  { href: '/dashboard', icon: LayoutDashboard },
  { href: '/items', icon: List },
  { href: '/tables', icon: Table },
  { href: '/reports', icon: BarChart },
  { href: '/settings', icon: Settings },
];

export default function MobileFooterNav() {
  const pathname = usePathname();

  return (
    <footer className="md:hidden fixed bottom-0 left-0 w-full bg-background border-t flex justify-around p-2">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link key={link.href} href={link.href}>
            <Button
              variant={pathname === link.href ? 'default' : 'ghost'}
              size="icon"
            >
              <Icon className="h-5 w-5" />
            </Button>
          </Link>
        );
      })}
    </footer>
  );
}
