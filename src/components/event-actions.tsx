'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DELETE_EVENT } from '@/graphql/mutations';
import { ALL_EVENTS } from '@/graphql/queries';
import { AuthContext } from '@/store/auth';
import { AllEventsQueryData, Event } from '@/types/event';
import { useMutation, useQuery } from '@apollo/client';
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';

type Props = {
  eventId: string;
  creatorEmail: string;
};

const EventActions = ({ eventId, creatorEmail }: Props) => {
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  const [deleteEvent, { loading, error }] = useMutation<Event, { id: string }>(
    DELETE_EVENT
  );
  const query = useQuery<AllEventsQueryData>(ALL_EVENTS);

  const handleDelete = () => {
    deleteEvent({
      variables: {
        id: eventId,
      },
      context: {
        headers: {
          Authorization: authCtx.user?.token,
        },
      },
      refetchQueries: [{ query: ALL_EVENTS }],
      onCompleted: async () => {
        const { data } = await query.refetch();
        query.updateQuery(() => data);

        toast.success('Event deleted successfully');
        router.push('/events');
        router.refresh();
      },
      onError: (error) => {
        toast.error('Failed to delete event', { description: error.message });
      },
      // update: (cache) => {
      //   const { allEvents } = cache.readQuery<AllEventsQueryData>({
      //     query: ALL_EVENTS,
      //   })!;

      //   cache.writeQuery({
      //     query: ALL_EVENTS,
      //     data: {
      //       allEvents: allEvents.filter((event) => event.id !== eventId),
      //     },
      //   });
      // },
    });
  };

  if (!authCtx.user) {
    return null;
  }

  if (authCtx.user && authCtx.user.email !== creatorEmail) {
    return <Button>Join/Leave</Button>;
  }

  return (
    <div className="flex mt-4 gap-4">
      <Button onClick={() => router.push(`/events/${eventId}/edit`)}>
        <Edit className="size-5 mr-2" />
        Edit
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <Trash2 className="size-5 mr-2" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Your event will be deleted
              permanently from our system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventActions;
