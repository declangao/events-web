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
