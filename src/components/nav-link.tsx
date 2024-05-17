'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  name: string;
  href: string;
};

const NavLink = ({ name, href }: Props) => {
  const path = usePathname();

  return (
    <Link
      href={href}
      className={cn('transition-colors hover:text-foreground text-nowrap', {
        'text-foreground': path === href,
        'text-muted-foreground': path !== href,
      })}
    >
      {name}
    </Link>
  );
};

export default NavLink;
