import { GameStructure } from '@/ServerActions/types';

export interface Message {
  type: string;
}

export interface UpdateMessage extends Message {
  type: 'update';
  game: GameStructure;
}
