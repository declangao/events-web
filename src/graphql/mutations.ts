import { Event } from '@/types/event';
import { Registration } from '@/types/registration';
import { User } from '@/types/user';
import { gql } from '@apollo/client';
import { FRAGMENT_EVENT_INFO, FRAGMENT_USER_INFO } from './fragments';

export const CREATE_USER = gql`
  mutation CreateUser {
    createUser {
      email
      username
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      ...eventInfo
    }
  }

  ${FRAGMENT_EVENT_INFO}
`;

export type CreateEventMutationData = {
  createEvent: Event;
};

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: String!) {
    deleteEvent(id: $id) {
      ...eventInfo
    }
  }

  ${FRAGMENT_EVENT_INFO}
`;

export type DeleteEventMutationData = {
  eventById: Event;
};

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      ...eventInfo
    }
  }

  ${FRAGMENT_EVENT_INFO}
`;

export type UpdateEventMutationData = {
  updateEvent: Event;
};

export const REGISTER_EVENT = gql`
  mutation RegisterEvent($eventId: String!) {
    registerEvent(eventId: $eventId) {
      eventId
      userId
    }
  }
`;

export type ResisterEventMutationData = {
  registerEvent: Registration;
};

export const UNREGISTER_EVENT = gql`
  mutation UnregisterEvent($eventId: String!) {
    unregisterEvent(eventId: $eventId) {
      eventId
      userId
    }
  }
`;

export type UnresisterEventMutationData = {
  unregisterEvent: Registration;
};

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      ...userInfo
    }
  }

  ${FRAGMENT_USER_INFO}
`;

export type UpdateUserMutationData = {
  updateUser: User;
};
