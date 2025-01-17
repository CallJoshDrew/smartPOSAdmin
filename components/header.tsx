'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { setTheme, theme } = useTheme();
  const router = useRouter();

  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-10 bg-background border-b px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4 w-full">
        <h1 className="text-xl font-bold text-left w-full md:w-auto">
          SmartPOS
        </h1>
      </div>
      <div className="flex items-center space-x-2 absolute right-4 md:static md:w-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="mr-10 md:mr-0">
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative w-8 h-8 rounded-full border overflow-hidden"
              style={{
                borderColor: isDark ? 'hsl(var(--border))' : 'hsl(var(--border))',
              }}
            >
              <div
                style={{
                  backgroundImage: 'url("https://i.imgur.com/OKv779J.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '100%',
                  height: '100%',
                }}
              >
                <span className="sr-only">User Profile</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem>
              <span className="text-xs text-gray-500">user@example.com</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/')}>
              <span className="text-xs text-gray-500">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
