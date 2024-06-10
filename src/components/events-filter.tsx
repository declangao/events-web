'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES } from '@/config';
import { useRouter } from 'next/navigation';

type Props = {
  category?: string;
};

const EventsFilter = ({ category }: Props) => {
  const router = useRouter();

  return (
    <div className="">
      <Select
        defaultValue={category}
        onValueChange={(val) => {
          if (val === 'All') {
            router.push('/events');
            router.refresh();
            return;
          }
          router.push(`/events?category=${encodeURIComponent(val)}`);
          router.refresh();
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EventsFilter;
