import { Event } from './event';
import { User } from './user';

export type Registration = {
  eventId: string;
  userId: string;
  event?: Event;
  user?: User;
};

export type ResisterEventMutationData = {
  registerEvent: Registration;
};

export type UnresisterEventMutationData = {
  unregisterEvent: Registration;
};

export type CheckRegistrationQueryData = {
  checkRegistration: boolean;
};
