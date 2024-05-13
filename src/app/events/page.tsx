import EventsGrid from '@/components/events-grid';

const EventsPage = () => {
  return (
    <div className="py-8">
      <h3 className="text-3xl font-bold text-center mb-4">All Events</h3>
      <EventsGrid />
    </div>
  );
};

export default EventsPage;
