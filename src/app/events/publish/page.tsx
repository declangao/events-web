'use client';

import EventEditor from '@/components/event-editor';
import { CREATE_EVENT } from '@/graphql/mutations';
import { ALL_EVENTS } from '@/graphql/queries';
import { EventFormPayload } from '@/schemas/event-form';
import { AuthContext } from '@/store/auth';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { toast } from 'sonner';

const PostEvent = () => {
  const [isPending, setIsPending] = useState(false);

  const authCtx = useContext(AuthContext);
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
        },
      },
      context: {
        headers: {
          Authorization: authCtx.user?.token,
        },
      },
      onCompleted: () => {
        router.push('/events');
        router.refresh();
        toast.success('Event published successfully');
      },
      onError: (error) => {
        toast.error('Failed to publish event', {
          description: error.message,
        });
      },
      refetchQueries: [{ query: ALL_EVENTS }],
      // fetchPolicy: 'network-only',
    });

    setIsPending(false);
  };

  return (
    <div className="mx-auto max-w-6xl my-8">
      <EventEditor onSubmit={handleSubmit} isPending={isPending} />
    </div>
  );
};

export default PostEvent;
