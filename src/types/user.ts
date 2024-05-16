import { TImage } from './image';

export type User = {
  id: string;
  email: string;
  username: string;
  about?: string;
  image?: TImage;
};

export type MyProfileQueryData = {
  myProfile: User;
};

export type UpdateUserMutationData = {
  updateUser: User;
};
