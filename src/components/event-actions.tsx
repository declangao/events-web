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
import {
  DELETE_EVENT,
  REGISTER_EVENT,
  ResisterEventMutationData,
  UNREGISTER_EVENT,
  UnresisterEventMutationData,
} from '@/graphql/mutations';
import {
  ALL_EVENTS,
  CHECK_REGISTRATION,
  CheckRegistrationQueryData,
  MY_REGISTERED_EVENTS,
} from '@/graphql/queries';
import { AuthContext } from '@/store/auth';
import { Event } from '@/types/event';
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

  const { data: checkRegistrationData } = useQuery<
    CheckRegistrationQueryData,
    { eventId: string }
  >(CHECK_REGISTRATION, {
    variables: { eventId },
    skip: !authCtx.user || authCtx.user.email === creatorEmail,
  });

  const handleDelete = () => {
    deleteEvent({
      variables: {
        id: eventId,
      },
      refetchQueries: [{ query: ALL_EVENTS }],
      onCompleted: () => {
        toast.success('Event deleted successfully');
        router.push('/events');
        router.refresh();
      },
      onError: (error) => {
        toast.error('Failed to delete event', { description: error.message });
      },
    });
  };

  const [registerEvent] = useMutation<
    ResisterEventMutationData,
    { eventId: string }
  >(REGISTER_EVENT);

  const [unregisterEvent] = useMutation<
    UnresisterEventMutationData,
    { eventId: string }
  >(UNREGISTER_EVENT);

  const handleRegister = () => {
    registerEvent({
      variables: {
        eventId,
      },
      refetchQueries: [
        { query: CHECK_REGISTRATION, variables: { eventId } },
        { query: MY_REGISTERED_EVENTS },
      ],
      onCompleted: () => {
        toast.success('You have successfully registered for this event');
        router.refresh();
      },
      onError: (error) => {
        toast.error('Failed to register for this event', {
          description: error.message,
        });
      },
    });
  };

  const handleUnregister = () => {
    unregisterEvent({
      variables: {
        eventId,
      },
      refetchQueries: [
        { query: CHECK_REGISTRATION, variables: { eventId } },
        { query: MY_REGISTERED_EVENTS },
      ],
      onCompleted: () => {
        toast.success('You have successfully unregistered for this event');
        router.refresh();
      },
      onError: (error) => {
        toast.error('Failed to unregister for this event', {
          description: error.message,
        });
      },
    });
  };

  if (!authCtx.user) {
    return null;
  }

  if (authCtx.user && authCtx.user.email !== creatorEmail) {
    const isRegistered = checkRegistrationData?.checkRegistration;

    if (!isRegistered) {
      return (
        <Button onClick={handleRegister} className="w-fit">
          Register
        </Button>
      );
    } else {
      return (
        <Button
          onClick={handleUnregister}
          variant="destructive"
          className="w-fit"
        >
          Unregister
        </Button>
      );
    }
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
