'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { appName, navLinks } from '@/config';
import { auth } from '@/lib/firebase';
import { AuthContext } from '@/store/auth';
import { Calendar, CircleUser, Menu, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { toast } from 'sonner';
import NavLink from './nav-link';
import ThemeToggle from './theme-toggle';

const Navbar = () => {
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    auth.signOut();
    authCtx.setUser(null);
    router.push('/');
    toast.success('Logged out successfully');
  };

  return (
    <header className="fixed top-0 flex h-16 w-full items-center gap-4 border-b px-4 md:px-6 backdrop-blur-lg shadow-md">
      <div className="container flex items-center">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 lg:gap-6 md:text-sm">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Calendar className="size-6" />
            <span className="sr-only">{appName}</span>
          </Link>
          {navLinks.map((link) => (
            <NavLink key={link.name} {...link} />
          ))}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="size-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Calendar className="size-6" />
                <span className="sr-only">{appName}</span>
              </Link>
              {navLinks.map((link) => (
                <NavLink key={link.name} {...link} />
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>

          <ThemeToggle />

          {!authCtx.user && (
            <>
              <NavLink name="Login" href="/login" />
              <NavLink name="Register" href="/register" />
            </>
          )}

          {authCtx.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="size-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{authCtx.user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
