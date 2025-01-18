'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, List, Table, BarChart, Settings, Tag } from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/items', label: 'Items', icon: List },
  { href: '/categories', label: 'Categories', icon: Tag },
  { href: '/tables', label: 'Tables', icon: Table },
  { href: '/reports', label: 'Reports', icon: BarChart },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-col w-64 border-r fixed top-0 left-0 h-full">
      <div className="p-4 mt-16">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Button
              variant={pathname === link.href ? 'default' : 'ghost'}
              className="w-full justify-start my-1"
            >
              <link.icon className="w-4 h-4 mr-2" />
              {link.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
