import { Event } from '@/types/event';
import { User } from '@/types/user';
import { gql } from '@apollo/client';
import { FRAGMENT_EVENT_INFO, FRAGMENT_USER_INFO } from './fragments';

export const ALL_EVENTS = gql`
  query AllEvents($input: EventsQueryInput) {
    allEvents(input: $input) {
      events {
        ...eventInfo
      }
      total
    }
  }

  ${FRAGMENT_EVENT_INFO}
`;

export type AllEventsQueryData = {
  allEvents: {
    events: Event[];
    total: number;
  };
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
  query MyRegisteredEvents($input: EventsQueryInput) {
    myRegisteredEvents(input: $input) {
      events {
        ...eventInfo
      }
      total
    }
  }

  ${FRAGMENT_EVENT_INFO}
`;

export type MyRegisteredEventsQueryData = {
  myRegisteredEvents: {
    events: Event[];
    total: number;
  };
};

export const MY_CREATED_EVENTS = gql`
  query MyCreatedEvents($input: EventsQueryInput) {
    myCreatedEvents(input: $input) {
      events {
        ...eventInfo
      }
      total
    }
  }

  ${FRAGMENT_EVENT_INFO}
`;

export type MyCreatedEventsQueryData = {
  myCreatedEvents: {
    events: Event[];
    total: number;
  };
};

export type EventsQueryInput = {
  input: {
    page: number;
    limit?: number;
  };
};

export const SEARCH_EVENTS = gql`
  query SearchEvents($input: SearchEventsQueryInput!) {
    searchEvents(input: $input) {
      events {
        ...eventInfo
      }
      total
    }
  }

  ${FRAGMENT_EVENT_INFO}
`;

export type SearchEventsQueryData = {
  searchEvents: {
    events: Event[];
    total: number;
  };
};

export type SearchEventsQueryInput = {
  input: {
    query: string;
    page: number;
    limit?: number;
  };
};
