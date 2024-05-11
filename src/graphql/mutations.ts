import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation createUser {
    createUser {
      email
      username
    }
  }
`;
