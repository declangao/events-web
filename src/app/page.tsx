'use client';

import { HeroParallax } from '@/components/hero-parallax';
import { ALL_EVENTS, AllEventsQueryData } from '@/graphql/queries';
import { useSuspenseQuery } from '@apollo/client';

export default function Home() {
  const { data } = useSuspenseQuery<AllEventsQueryData>(ALL_EVENTS, {
    variables: {
      input: {
        limit: 16,
      },
    },
  });

  const events = data.allEvents.events.map((event) => ({
    name: event.name,
    link: `/events/${event.id}`,
    image: event.images[0].url,
  }));

  return (
    <div className="mb-16">
      <HeroParallax events={events} />
    </div>
  );
}
