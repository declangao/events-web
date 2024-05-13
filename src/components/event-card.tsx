import { Event } from '@/types/event';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from './ui/card';

type Props = {
  event: Event;
};

const EventCard = ({ event }: Props) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <Link href={`/events/${event.id}`}>
          <Image
            src={event.images.length ? event.images[0].url : '/placeholder.png'}
            alt={event.name}
            height={250}
            width={300}
            // fill
            className="w-full h-[250px] object-cover"
          />
        </Link>
      </CardHeader>

      {/* <Separator className="" /> */}

      <CardContent>
        <h4 className="text-2xl font-semibold leading-none tracking-tight">
          {event.name}
        </h4>
        <p className="text-muted-foreground">
          {`${new Date(event.datetime).toLocaleDateString()} ${new Date(
            event.datetime
          ).toLocaleTimeString()}`}
        </p>
      </CardContent>
    </Card>
  );
};

export default EventCard;
