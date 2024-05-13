import { gql } from '@apollo/client';
import { FRAGMENT_EVENT_INFO, FRAGMENT_USER_INFO } from './fragments';

export const ALL_EVENTS = gql`
  query AllEvents {
    allEvents {
      ...eventInfo
    }
  }

  ${FRAGMENT_EVENT_INFO}
`;

export const EVENT_BY_ID = gql`
  query EventById($id: String!) {
    eventById(id: $id) {
      ...eventInfo
      creator {
        ...userInfo
      }
    }
  }

  ${FRAGMENT_EVENT_INFO}
  ${FRAGMENT_USER_INFO}
`;
