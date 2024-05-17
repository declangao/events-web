import { TImage } from './image';
import { User } from './user';

export type Event = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  location: string;
  datetime: Date;
  images: TImage[];
  creatorId: string;
  creator?: User;
};

export enum MyEventsGridType {
  REGISTERED,
  PUBLISHED,
}
