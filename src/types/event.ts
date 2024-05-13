import { TImage } from './image';

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
};

export type AllEventsQueryData = {
  allEvents: Event[];
};

export type EventByIdQueryData = {
  eventById: Event;
};
