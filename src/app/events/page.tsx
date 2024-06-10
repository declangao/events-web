// import EventsGrid from '@/components/events-grid';
import EventsFilter from '@/components/events-filter';
import InfiniteEventsGrid from '@/components/infinite-events-grid';

type Props = {
  searchParams?: {
    category?: string;
  };
};

const EventsPage = async ({ searchParams }: Props) => {
  // const { data } = await getApolloClient().query<AllEventsQueryData>({
  //   query: ALL_EVENTS,
  // });

  return (
    <div className="container py-8">
      <div className="flex justify-between mb-4">
        <h3 className="text-3xl font-bold">All Events</h3>
        <EventsFilter category={searchParams?.category} />
      </div>
      {/* <EventsGrid events={data.allEvents.events} /> */}
      <InfiniteEventsGrid pageSize={15} category={searchParams?.category} />
    </div>
  );
};

export default EventsPage;
export const dynamic = 'force-dynamic';
