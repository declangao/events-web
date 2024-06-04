// import EventsGrid from '@/components/events-grid';
import InfiniteEventsGrid from '@/components/infinite-events-grid';

const EventsPage = async () => {
  // const { data } = await getApolloClient().query<AllEventsQueryData>({
  //   query: ALL_EVENTS,
  // });

  return (
    <div className="container py-8">
      <h3 className="text-3xl font-bold text-center mb-4">All Events</h3>
      {/* <EventsGrid events={data.allEvents.events} /> */}
      <InfiniteEventsGrid pageSize={15} />
    </div>
  );
};

export default EventsPage;
export const dynamic = 'force-dynamic';
