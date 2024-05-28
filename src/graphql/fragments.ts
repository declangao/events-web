import { gql } from '@apollo/client';

export const FRAGMENT_USER_INFO = gql`
  fragment userInfo on User {
    id
    email
    username
    about
    image {
      url
      publicId
    }
    createdAt
  }
`;

export const FRAGMENT_EVENT_INFO = gql`
  fragment eventInfo on Event {
    id
    name
    description
    location
    datetime
    images {
      url
      publicId
    }
    lat
    lng
    address
    creatorId
    createdAt
  }
`;

export const FRAGMENT_EVENT_INFO_WITH_ATTENDEES = gql`
  fragment eventInfoWithAttendees on Event {
    id
    name
    description
    location
    datetime
    images {
      url
      publicId
    }
    lat
    lng
    address
    creatorId
    createdAt
    attendees {
      id
      username
      image {
        url
        publicId
      }
    }
  }
`;
