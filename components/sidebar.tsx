'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/items', label: 'Items' },
  { href: '/tables', label: 'Tables' },
  { href: '/reports', label: 'Reports' },
  { href: '/settings', label: 'Settings' },
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
              {link.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
