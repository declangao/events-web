import { gql } from '@apollo/client';
import { FRAGMENT_EVENT_INFO } from './fragments';

export const CREATE_USER = gql`
  mutation createUser {
    createUser {
      email
      username
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation ($input: CreateEventInput!) {
    createEvent(input: $input) {
      ...eventInfo
    }
  }

  ${FRAGMENT_EVENT_INFO}
`;
