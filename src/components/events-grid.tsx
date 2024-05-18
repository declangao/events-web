import { Event } from '@/types/event';
import EventCard from './event-card';

type Props = {
  events: Event[];
};

const EventsGrid = ({ events }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventsGrid;
