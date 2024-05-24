'use client';

import EventCard from '@/components/event-card';
import PaginationClient from '@/components/pagination-client';
import { EVENT_PAGE_LIMIT } from '@/config';
import {
  SEARCH_EVENTS,
  SearchEventsQueryData,
  SearchEventsQueryInput,
} from '@/graphql/queries';
import { useSuspenseQuery } from '@apollo/client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

type Props = {};

const SearchEventsPage = ({}: Props) => {
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const q = searchParams.get('q');

  const { data } = useSuspenseQuery<
    SearchEventsQueryData,
    SearchEventsQueryInput
  >(SEARCH_EVENTS, {
    variables: {
      input: {
        query: q || '',
        page,
        limit: EVENT_PAGE_LIMIT,
      },
    },
  });

  return (
    <div className="grid gap-4 my-8">
      <div className="grid md:grid-cols-3 gap-4">
        {data?.searchEvents?.events.length === 0 && <div>No events found</div>}

        {data?.searchEvents?.events?.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <PaginationClient
        page={page}
        setPage={setPage}
        total={data?.searchEvents?.total!}
        limit={EVENT_PAGE_LIMIT}
      />
    </div>
  );
};

export default SearchEventsPage;
