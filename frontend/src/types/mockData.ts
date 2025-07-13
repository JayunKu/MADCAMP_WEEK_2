import { GameMode, GameStatus } from './game';

export const EXAMPLE_PLAYER_INFOS = [
  {
    id: 1,
    username: '애벌레 1',
    avatarId: 0,
    isMember: true,
    totalGames: 10,
    totalWins: 5,
  },
  {
    id: 2,
    username: '애벌레 2',
    avatarId: 1,
    isMember: true,
    totalGames: 8,
    totalWins: 3,
  },
  {
    id: 3,
    username: '애벌레 3',
    avatarId: 2,
    isMember: false,
  },
  {
    id: 4,
    username: '애벌레 4',
    avatarId: 3,
    isMember: true,
    totalGames: 5,
    totalWins: 2,
  },
];

export const EXAMPLE_GAME_DATA = {
  game_mode: GameMode.BASIC,
  round_number: 1,
  game_status: GameStatus.PLAYING,
  round_answer: '커피',
  keeper_user_ids: [1, 2, 4],
  faker_user_ids: [3],
  responses: [
    {
      id: '1',
      input: '귀여운 강아지',
      file_id: '../../assets/images/larva-0.png',
    },
    {
      id: '2',
      input: '귀여운 애벌레',
      file_id: '../../assets/images/larva-1.png',
    },
    {
      id: '3',
      input: null,
      file_id: null,
    },
    {
      id: '4',
      input: null,
      file_id: null,
    },
  ],
  round_turn_player_id: 3,
};
