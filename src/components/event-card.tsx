import { Event } from '@/types/event';
import Link from 'next/link';
import ImageSlider from './image-slider';
import { Card, CardContent, CardHeader } from './ui/card';

import 'swiper/css';

type Props = {
  event: Event;
};

const EventCard = ({ event }: Props) => {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="">
          <ImageSlider images={event.images.map((image) => image.url)} />
        </CardHeader>

        <CardContent className="grid gap-2">
          <h4 className="text-2xl font-semibold leading-none tracking-tight">
            {event.name}
          </h4>
          <p className="text-muted-foreground italic">
            {`${new Date(event.datetime).toLocaleDateString()} ${new Date(
              event.datetime
            ).toLocaleTimeString()}`}
          </p>
          <p className="">{event.location}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventCard;