'use client';

import EventEditor from '@/components/event-editor';
import { CREATE_EVENT } from '@/graphql/mutations';
import { ALL_EVENTS, MY_CREATED_EVENTS } from '@/graphql/queries';
import { showConfetti } from '@/lib/utils';
import { EventFormPayload } from '@/schemas/event-form';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const PostEvent = () => {
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  const [createEvent] = useMutation(CREATE_EVENT);

  const handleSubmit = async (data: EventFormPayload) => {
    setIsPending(true);

    const datetime = new Date(data.date + 'T' + data.time).toISOString();

    await createEvent({
      variables: {
        input: {
          name: data.name,
          location: data.location,
          description: data.description,
          datetime: datetime,
          images: data.images,
          lat: data.lat,
          lng: data.lng,
          address: data.address,
        },
      },
      onCompleted: () => {
        router.push('/events');
        router.refresh();
        toast.success('Event published successfully');
        showConfetti();
      },
      onError: (error) => {
        toast.error('Failed to publish event', {
          description: error.message,
        });
      },
      refetchQueries: [{ query: ALL_EVENTS }, { query: MY_CREATED_EVENTS }],
    });

    setIsPending(false);
  };

  return (
    <div className="container mx-auto max-w-6xl my-8">
      <EventEditor onSubmit={handleSubmit} isPending={isPending} />
    </div>
  );
};

export default PostEvent;
