'use client';

import { ALL_EVENTS } from '@/graphql/queries';
import { AllEventsQueryData } from '@/types/event';
import { useQuery } from '@apollo/client';
import EventCard from './event-card';

type Props = {};

const EventsGrid = (props: Props) => {
  const { data, loading, error } = useQuery<AllEventsQueryData>(ALL_EVENTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  if (!data) return <p>No data</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.allEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventsGrid;
