'use client';

import {
  MY_CREATED_EVENTS,
  MY_REGISTERED_EVENTS,
  MyCreatedEventsQueryData,
  MyRegisteredEventsQueryData,
} from '@/graphql/queries';
import { AuthContext } from '@/store/auth';
import { MyEventsGridType } from '@/types/event';
import { useQuery } from '@apollo/client';
import { useContext } from 'react';
import EventCard from './event-card';

type Props = {
  type: MyEventsGridType;
};

const MyEventsGrid = ({ type }: Props) => {
  const authCtx = useContext(AuthContext);

  const {
    data: registeredEvents,
    loading: registeredEventsLoading,
    error: registeredEventsError,
  } = useQuery<MyRegisteredEventsQueryData>(MY_REGISTERED_EVENTS, {
    skip: !authCtx.user || type !== MyEventsGridType.REGISTERED,
  });

  const {
    data: createdEvents,
    loading: createdEventsLoading,
    error: createdEventsError,
  } = useQuery<MyCreatedEventsQueryData>(MY_CREATED_EVENTS, {
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

  const events =
    type === MyEventsGridType.REGISTERED
      ? registeredEvents?.myRegisteredEvents
      : createdEvents?.myCreatedEvents;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {events?.length === 0 && <div>No events found</div>}

      {events?.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default MyEventsGrid;
