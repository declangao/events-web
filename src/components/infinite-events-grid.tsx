'use client';

import { INFINITE_EVENT_PAGE_LIMIT } from '@/config';
import {
  ALL_EVENTS,
  AllEventsQueryData,
  EventsQueryInput,
} from '@/graphql/queries';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { useSuspenseQuery } from '@apollo/client';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import EventCard from './event-card';

type Props = {
  pageSize?: number;
};

const InfiniteEventsGrid = ({
  pageSize = INFINITE_EVENT_PAGE_LIMIT,
}: Props) => {
  const [isPending, setIsPending] = useState(false);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);

  const { isIntersecting, ref } = useIntersectionObserver();

  const latRef = useRef<number>(0);
  const lngRef = useRef<number>(0);

  const { data, error, fetchMore, refetch } = useSuspenseQuery<
    AllEventsQueryData,
    EventsQueryInput
  >(ALL_EVENTS, {
    variables: {
      input: {
        page,
        limit: pageSize,
      },
    },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          latRef.current = position.coords.latitude;
          lngRef.current = position.coords.longitude;
          refetch({
            input: {
              page,
              limit: pageSize,
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (error: GeolocationPositionError) => {
          if (error.code === error.PERMISSION_DENIED) {
            toast.warning('Geolocation permission denied', {
              description: 'Please enable geolocation for better results',
            });
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchMore = useCallback(async () => {
    if (isPending || endReached) return;

    setIsPending(true);
    const res = await fetchMore({
      variables: {
        input: {
          page: page + 1,
          limit: pageSize,
          lat: latRef.current,
          lng: lngRef.current,
        },
      },
    });

    if (Math.ceil(res.data.allEvents.total / pageSize) === page) {
      setEndReached(true);
      // toast("You've reached the end", {
      //   description: 'No more events to load',
      // });
    }

    setPage((prevPage) => prevPage + 1);
    setIsPending(false);
  }, [endReached, fetchMore, isPending, page, pageSize]);

  useEffect(() => {
    if (isIntersecting) {
      handleFetchMore();
    }
  }, [isIntersecting, handleFetchMore]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return null;
  }

  const eventsData = data?.allEvents;

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {eventsData.events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}

        {isPending && (
          <div className="flex justify-center items-center">
            <Loader2 className="size-8 animate-spin" />
          </div>
        )}
      </div>

      {endReached && (
        <div className="w-full flex items-center">
          <hr className="w-full" />
          <span className="text-muted-foreground text-nowrap mx-4">
            You&apos;ve reached the end {':('}
          </span>
          <hr className="w-full" />
        </div>
      )}
      <div ref={ref}></div>
    </div>
  );
};

export default InfiniteEventsGrid;
