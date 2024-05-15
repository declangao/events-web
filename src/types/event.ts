import { TImage } from './image';
import { User } from './user';

export type Event = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  location: string;
  datetime: Date;
  images: TImage[];
  creatorId: string;
  creator?: User;
};

export type AllEventsQueryData = {
  allEvents: Event[];
};

export type EventByIdQueryData = {
  eventById: Event;
};

export type CreateEventMutationData = {
  createEvent: Event;
};

export type DeleteEventMutationData = {
  eventById: Event;
};

export type UpdateEventMutationData = {
  updateEvent: Event;
};
