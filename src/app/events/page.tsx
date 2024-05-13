import EventsGrid from '@/components/events-grid';
import { ALL_EVENTS } from '@/graphql/queries';
import { getApolloClient } from '@/lib/apollo-client';
import { AllEventsQueryData } from '@/types/event';

const EventsPage = async () => {
  const { data } = await getApolloClient().query<AllEventsQueryData>({
    query: ALL_EVENTS,
  });

  return (
    <div className="py-8">
      <h3 className="text-3xl font-bold text-center mb-4">All Events</h3>
      <EventsGrid events={data.allEvents} />
    </div>
  );
};

export default EventsPage;
