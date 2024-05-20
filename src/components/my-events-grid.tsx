'use client';

import { EVENT_PAGE_LIMIT } from '@/config';
import {
  EventsQueryInput,
  MY_CREATED_EVENTS,
  MY_REGISTERED_EVENTS,
  MyCreatedEventsQueryData,
  MyRegisteredEventsQueryData,
} from '@/graphql/queries';
import { AuthContext } from '@/store/auth';
import { MyEventsGridType } from '@/types/event';
import { useQuery } from '@apollo/client';
import { useContext, useState } from 'react';
import EventCard from './event-card';
import PaginationClient from './pagination-client';

type Props = {
  type: MyEventsGridType;
};

const MyEventsGrid = ({ type }: Props) => {
  const [page, setPage] = useState(1);

  const authCtx = useContext(AuthContext);

  const {
    data: registeredEvents,
    loading: registeredEventsLoading,
    error: registeredEventsError,
  } = useQuery<MyRegisteredEventsQueryData, EventsQueryInput>(
    MY_REGISTERED_EVENTS,
    {
      variables: {
        input: {
          page,
          limit: EVENT_PAGE_LIMIT,
        },
      },
      fetchPolicy: 'no-cache',
      skip: !authCtx.user || type !== MyEventsGridType.REGISTERED,
    }
  );

  const {
    data: createdEvents,
    loading: createdEventsLoading,
    error: createdEventsError,
  } = useQuery<MyCreatedEventsQueryData, EventsQueryInput>(MY_CREATED_EVENTS, {
    variables: {
      input: {
        page,
        limit: EVENT_PAGE_LIMIT,
      },
    },
    fetchPolicy: 'no-cache',
    skip: !authCtx.user || type !== MyEventsGridType.PUBLISHED,
  });

  if (registeredEventsLoading || createdEventsLoading) {
    return <div>Loading...</div>;
  }

  if (registeredEventsError || createdEventsError) {
    return (
      <div>
        Error - {registeredEventsError?.message} - {createdEventsError?.message}
      </div>
    );
  }

  const data =
    type === MyEventsGridType.REGISTERED
      ? registeredEvents?.myRegisteredEvents
      : createdEvents?.myCreatedEvents;

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <div className="grid gap-4">
      <div className="grid md:grid-cols-3 gap-4">
        {data?.events?.length === 0 && <div>No events found</div>}

        {data?.events?.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <PaginationClient
        page={page}
        setPage={setPage}
        total={data?.total}
        limit={EVENT_PAGE_LIMIT}
      />
    </div>
  );
};

export default MyEventsGrid;
