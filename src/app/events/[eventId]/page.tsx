import EmbeddedMap from '@/components/embedded-map';
import EventActions from '@/components/event-actions';
import UserAvatar from '@/components/user-avatar';
import { PLACEHOLDER_IMAGE } from '@/config';
import { EVENT_BY_ID, EventByIdQueryData } from '@/graphql/queries';
import { getApolloClient } from '@/lib/apollo-client';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  params: {
    eventId: string;
  };
};

const EventDetailsPage = async ({ params: { eventId } }: Props) => {
  const { data } = await getApolloClient().query<
    EventByIdQueryData,
    { id: string }
  >({
    query: EVENT_BY_ID,
    variables: { id: eventId },
  });
  const { eventById: event } = data;

  if (!event) {
    return <div>Event not found</div>;
  }

  const attendees = event.attendees || [];

  return (
    <article className="container max-w-3xl mx-auto py-8 grid gap-4">
      <header>
        <Image
          src={event.images.length ? event.images[0].url : PLACEHOLDER_IMAGE}
          alt={event.name}
          width={800}
          height={400}
          className="object-cover mx-auto rounded-md"
        />

        <h1 className="text-2xl md:text-4xl font-bold mt-4">{event.name}</h1>
        <div className="mt-2">
          <span className="text-muted-foreground">
            {`Posted on ${new Date(event.createdAt).toLocaleDateString()} by `}
          </span>
          <Link
            href={`/users/${event.creator?.username}`}
            className="text-primary"
          >
            {`@${event.creator?.username}`}
          </Link>
        </div>
      </header>

      <EventActions eventId={eventId} creatorEmail={event.creator?.email!} />

      <div className="grid gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <dl className="grid gap-2">
            <dt className="font-bold">Date</dt>
            <dd>
              {new Date(event.datetime).toLocaleDateString() +
                ' ' +
                new Date(event.datetime).toLocaleTimeString()}
            </dd>
          </dl>

          <dl className="grid gap-2">
            <dt className="font-bold">Category</dt>
            <dd>{event.category}</dd>
          </dl>
        </div>

        <dl className="grid gap-2">
          <dt className="font-bold">Location</dt>
          <dd>
            {event.address.startsWith(event.location)
              ? event.address
              : event.location + ', ' + event.address}
          </dd>
        </dl>

        <dl className="grid gap-2">
          <dt className="font-bold">Description</dt>
          <dd>{event.description}</dd>
        </dl>
      </div>

      <div className="w-full h-[400px]">
        <EmbeddedMap lat={event.lat} lng={event.lng} />
      </div>

      {event.images
        .filter((_, idx) => idx !== 0)
        .map((image) => (
          <Image
            key={image.publicId}
            src={image.url}
            alt={event.name}
            width={800}
            height={400}
          />
        ))}

      {attendees.length > 0 && (
        <>
          <hr />
          <h3 className="text-3xl font-semibold">Registered Users</h3>
          <section className="grid grid-cols-[repeat(auto-fill,minmax(2rem,1fr))] gap-4">
            {attendees.map((attendee) => (
              <UserAvatar key={attendee.id} user={attendee} />
            ))}
          </section>
        </>
      )}
    </article>
  );
};

export default EventDetailsPage;
