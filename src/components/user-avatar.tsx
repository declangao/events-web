import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/user';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

type Props = {
  user: User;
};

const UserAvatar = ({ user }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/users/${user.username}`}>
            <Avatar className="size-8 relative">
              <AvatarImage src={user.image?.url} alt="avatar" />
              <AvatarFallback className="text-5xl">
                {user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        </TooltipTrigger>
        <TooltipContent>{user.username}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserAvatar;
