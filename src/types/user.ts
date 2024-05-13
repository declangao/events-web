import { TImage } from './image';

export type User = {
  id: string;
  email: string;
  username: string;
  about?: string;
  image?: TImage;
};
