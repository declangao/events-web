import { Event } from '@/types/event';
import { User } from '@/types/user';
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

export type AllEventsQueryData = {
  allEvents: Event[];
};

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

export type EventByIdQueryData = {
  eventById: Event;
};

export const CHECK_REGISTRATION = gql`
  query CheckRegistration($eventId: String!) {
    checkRegistration(eventId: $eventId)
  }
`;

export type CheckRegistrationQueryData = {
  checkRegistration: boolean;
};

export const MY_PROFILE = gql`
  query MyProfile {
    myProfile {
      ...userInfo
    }
  }

  ${FRAGMENT_USER_INFO}
`;

export type MyProfileQueryData = {
  myProfile: User;
};

export const MY_REGISTERED_EVENTS = gql`
  query MyRegisteredEvents {
    myRegisteredEvents {
      ...eventInfo
    }
  }

  ${FRAGMENT_EVENT_INFO}
`;

export type MyRegisteredEventsQueryData = {
  myRegisteredEvents: Event[];
};

export const MY_CREATED_EVENTS = gql`
  query MyCreatedEvents {
    myCreatedEvents {
      ...eventInfo
    }
  }

  ${FRAGMENT_EVENT_INFO}
`;

export type MyCreatedEventsQueryData = {
  myCreatedEvents: Event[];
};
