'use client';

import EventEditor from '@/components/event-editor';
import { UPDATE_EVENT } from '@/graphql/mutations';
import { ALL_EVENTS, EVENT_BY_ID } from '@/graphql/queries';
import { EventFormPayload } from '@/schemas/event-form';
import { EventByIdQueryData, UpdateEventMutationData } from '@/types/event';
import { useMutation, useQuery } from '@apollo/client';
import { omitDeep } from '@apollo/client/utilities';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  params: {
    eventId: string;
  };
};

const EditEventPage = ({ params: { eventId } }: Props) => {
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  const [updateEvent] = useMutation<UpdateEventMutationData>(UPDATE_EVENT);

  const { data, loading, error } = useQuery<EventByIdQueryData, { id: string }>(
    EVENT_BY_ID,
    {
      variables: { id: eventId },
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { eventById: fetchedEvent } = data!;
  if (!fetchedEvent) return <div>Event not found</div>;

  const handleSubmit = async (data: EventFormPayload) => {
    console.log(data);
    setIsPending(true);

    const datetime = new Date(data.date + 'T' + data.time).toISOString();

    await updateEvent({
      variables: {
        input: {
          id: eventId,
          name: data.name,
          location: data.location,
          description: data.description,
          images: data.images.map((image) => omitDeep(image, '__typename')),
          datetime,
        },
      },
      onCompleted: () => {
        router.push(`/events/${eventId}`);
        router.refresh();
        toast.success('Event updated successfully');
      },
      onError: (error) => {
        toast.error('Failed to update event', {
          description: error.message,
        });
      },
      refetchQueries: [
        { query: ALL_EVENTS },
        { query: EVENT_BY_ID, variables: { id: eventId } },
      ],
    });
  };

  return (
    <div className="mx-auto max-w-6xl my-8">
      <EventEditor
        initData={fetchedEvent}
        isPending={isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditEventPage;
