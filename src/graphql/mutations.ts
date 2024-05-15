import { gql } from '@apollo/client';
import { FRAGMENT_EVENT_INFO } from './fragments';

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

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: String!) {
    deleteEvent(id: $id) {
      ...eventInfo
    }
  }

  ${FRAGMENT_EVENT_INFO}
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      ...eventInfo
    }
  }

  ${FRAGMENT_EVENT_INFO}
`;

export const REGISTER_EVENT = gql`
  mutation RegisterEvent($eventId: String!) {
    registerEvent(eventId: $eventId) {
      eventId
      userId
    }
  }
`;

export const UNREGISTER_EVENT = gql`
  mutation UnregisterEvent($eventId: String!) {
    unregisterEvent(eventId: $eventId) {
      eventId
      userId
    }
  }
`;
