import { Event } from '@/types/event';
import Link from 'next/link';
import ImageSlider from './image-slider';
import { Card, CardContent, CardHeader } from './ui/card';

import { formateDatetime } from '@/lib/utils';
import 'swiper/css';

type Props = {
  event: Event;
};

const EventCard = ({ event }: Props) => {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="hover:shadow-lg hover:shadow-primary/30 transition-shadow duration-300 h-full">
        <CardHeader className="">
          <ImageSlider images={event.images.map((image) => image.url)} />
        </CardHeader>

        <CardContent className="grid gap-2">
          <h4 className="text-2xl font-semibold leading-none tracking-tight line-clamp-2">
            {event.name}
          </h4>
          <p className="text-muted-foreground italic">
            {/* {`${new Date(event.datetime).toLocaleDateString()} ${new Date(
              event.datetime
            ).toLocaleTimeString()}`} */}
            {formateDatetime(new Date(event.datetime))}
          </p>
          <p className="truncate">{event.location}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventCard;
