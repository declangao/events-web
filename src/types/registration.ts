import { Event } from './event';
import { User } from './user';

export type Registration = {
  eventId: string;
  userId: string;
  event?: Event;
  user?: User;
};
