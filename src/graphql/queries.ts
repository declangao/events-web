import { gql } from '@apollo/client';
import { FRAGMENT_EVENT_INFO } from './fragments';

export const ALL_EVENTS = gql`
  query AllEvents {
    allEvents {
      ...eventInfo
    }
  }

  ${FRAGMENT_EVENT_INFO}
`;
