import EventActions from '@/components/event-actions';
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

  return (
    <article className="max-w-3xl mx-auto py-8 grid gap-4">
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
        <dl className="grid gap-2">
          <dt className="font-bold">Date</dt>
          <dd>
            {new Date(event.datetime).toLocaleDateString() +
              ' ' +
              new Date(event.datetime).toLocaleTimeString()}
          </dd>
        </dl>

        <dl className="grid gap-2">
          <dt className="font-bold">Location</dt>
          <dd>{event.location}</dd>
        </dl>

        <dl className="grid gap-2">
          <dt className="font-bold">Description</dt>
          <dd>{event.description}</dd>
        </dl>
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
    </article>
  );
};

export default EventDetailsPage;
