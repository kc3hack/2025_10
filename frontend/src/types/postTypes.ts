import { UserTypes } from '@/types/userTypes';

export type PostTypes = {
  id: string;
  tanka: Array<string>;
  original: string;
  imageUrl: string;
  date: Date;
  user: UserTypes;
  miyabiCount: number;
  miyabiIsClicked: boolean;
  rank?: number;
};
