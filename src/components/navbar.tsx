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
import { Calendar, CircleUser, Menu, PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import NavLink from './nav-link';
import ThemeToggle from './theme-toggle';
import { Skeleton } from './ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

const Navbar = () => {
  const [isPending, setIsPending] = useState(true);
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    setIsPending(false);
  }, [authCtx.user]);

  const handleLogout = () => {
    auth.signOut();
    // authCtx.setUser(null);
    router.push('/');
    toast.success('Logged out successfully');
  };

  return (
    <header className="fixed top-0 flex h-16 w-full items-center gap-4 border-b px-4 md:px-6 backdrop-blur-lg shadow-md z-20">
      <div className="md:container flex items-center">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 lg:gap-6 md:text-sm">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Calendar className="size-6" />
            <span className="sr-only">{appName}</span>
          </Link>
          {navLinks.map((link) => {
            if (link.authRequired && !authCtx.user) {
              return null;
            }

            return <NavLink key={link.name} {...link} />;
          })}
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
              <ThemeToggle />
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex w-full items-center gap-4 ml-4 md:ml-auto md:gap-2 lg:gap-4">
          <form
            action="/events/search"
            className="ml-auto flex-1 sm:flex-initial"
          >
            <div className="relative">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                type="search"
                name="q"
                placeholder="Search events..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-transparent hover:bg-background transition-colors duration-300"
              />
            </div>
          </form>

          <div className="hidden md:inline-block">
            <ThemeToggle />
          </div>

          {isPending && <Skeleton className="w-16 md:w-28 h-10 rounded-md" />}

          {!isPending && authCtx.user && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Link href="/events/publish">
                        <PlusCircle className="size-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Publish your event</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <CircleUser className="size-5" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{authCtx.user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push('/profile')}
                    className="cursor-pointer"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push('/events/publish')}
                    className="cursor-pointer"
                  >
                    Publish your event
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {!isPending && !authCtx.user && (
            <>
              <NavLink name="Login" href="/login" />
              <NavLink name="Register" href="/register" />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
