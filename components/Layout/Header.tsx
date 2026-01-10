'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { name: 'Interview', href: '/interview' },
    { name: 'Problems', href: '/problems' },
    { name: 'Pricing', href: '/pricing' },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav
        className="
          flex items-center justify-between
          w-full max-w-5xl h-16 px-6 rounded-2xl
          bg-glass
          backdrop-blur-xl backdrop-saturate-150
          border border-white/20 dark:border-white/10
          shadow-lg shadow-black/10
          transition-all duration-300
        "
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <h1
            className="
              text-xl font-bold tracking-tight
              bg-linear-to-r from-foreground to-foreground/70
              bg-clip-text text-transparent
            "
          >
            𝕬𝖌𝖊𝖓𝖙 𝕴𝖓𝖙𝖊𝖗𝖛𝖎𝖊𝖜
          </h1>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-colors',
                  'hover:text-primary',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="
              rounded-xl
              hover:bg-white/40 dark:hover:bg-white/10
              transition-all
            "
          >
            <div className="relative w-5 h-5">
              {!mounted ? null : (
                <>
                  <Sun
                    className={cn(
                      'absolute inset-0 transition-all duration-500',
                      theme === 'dark'
                        ? 'rotate-90 scale-0 opacity-0'
                        : 'rotate-0 scale-100 opacity-100'
                    )}
                  />
                  <Moon
                    className={cn(
                      'absolute inset-0 transition-all duration-500',
                      theme === 'dark'
                        ? 'rotate-0 scale-100 opacity-100'
                        : '-rotate-90 scale-0 opacity-0'
                    )}
                  />
                </>
              )}
            </div>
            <span className="sr-only">Toggle theme</span>
          </Button>

          <div className="h-6 w-px bg-white/30 dark:bg-white/10" />

          {/* Login/User */}
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-3 hover:opacity-80 transition-all group"
            >
              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary/80 transition-colors">
                Hello,
              </span>
              <span className="text-sm font-medium text-primary group-hover:underline underline-offset-4">
                {user.fullName || 'User'}
              </span>
            </Link>
          ) : (
            <Button
              asChild
              className="
              rounded-xl px-6
              bg-primary text-primary-foreground
              hover:opacity-90
              shadow-md shadow-primary/20
              active:scale-95
              transition-all
            "
            >
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
}
