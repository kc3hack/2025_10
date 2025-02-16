import { UserTypes } from '@/types/userTypes';
import { TankaTypes } from '@/types/tankaTypes';

export type PostTypes = {
  id: string;
  tanka: TankaTypes;
  original: string;
  imageUrl: string;
  date: Date;
  user: UserTypes;
  miyabi: number;
};
