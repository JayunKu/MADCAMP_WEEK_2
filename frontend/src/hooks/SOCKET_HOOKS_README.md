# Socket.IO 훅 사용 가이드

## 개요
이 프로젝트는 Socket.IO를 편리하게 사용하기 위한 두 가지 커스텀 훅을 제공합니다:

1. `useSocket` - 기본 Socket.IO 연결 관리
2. `useGameSocket` - 게임 관련 Socket.IO 이벤트 처리

## 설치된 패키지
- `socket.io-client` - Socket.IO 클라이언트 라이브러리

## 환경 변수 설정
`.env` 파일에 다음 환경 변수를 설정하세요:

```
REACT_APP_SERVER_URL=http://localhost:3001
REACT_APP_GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id_here
```

## 1. useSocket 훅

### 기본 사용법
```typescript
import { useSocket } from './hooks/useSocket';

const MyComponent = () => {
  const { socket, isConnected, emit, on, off } = useSocket();

  useEffect(() => {
    // 이벤트 리스너 등록
    on('message', (data) => {
      console.log('Message received:', data);
    });

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      off('message');
    };
  }, [on, off]);

  const sendMessage = () => {
    emit('message', { text: 'Hello Server!' });
  };

  return (
    <div>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};
```

### 옵션
```typescript
const { socket, isConnected } = useSocket({
  url: 'http://localhost:3001',
  options: {
    transports: ['websocket'],
  },
  autoConnect: true, // 기본값: true
});
```

## 2. useGameSocket 훅

### 기본 사용법
```typescript
import { useGameSocket } from './hooks/useGameSocket';

const GameComponent = () => {
  const {
    gameState,
    isConnected,
    joinRoom,
    createRoom,
    startGame,
    submitAnswer,
    submitImage,
    updatePlayerReady,
    updatePlayerInfo,
  } = useGameSocket();

  const handleJoinRoom = () => {
    joinRoom('ROOM123');
  };

  const handleCreateRoom = () => {
    createRoom(0); // 0: 기본 모드, 1: 페이커 모드
  };

  return (
    <div>
      <h3>Connection: {isConnected ? 'Connected' : 'Disconnected'}</h3>
      <h3>Game Status: {gameState.gameStatus}</h3>
      <h3>My Turn: {gameState.isMyTurn ? 'Yes' : 'No'}</h3>
      
      {gameState.room && (
        <div>
          <h4>Room: {gameState.room.code}</h4>
          <h4>Players: {gameState.room.players.length}/{gameState.room.maxPlayers}</h4>
        </div>
      )}

      <button onClick={handleJoinRoom}>Join Room</button>
      <button onClick={handleCreateRoom}>Create Room</button>
      <button onClick={startGame}>Start Game</button>
    </div>
  );
};
```

## 3. 게임 상태 관리

### GameState 구조
```typescript
interface GameState {
  room: GameRoom | null;
  currentPlayer: GamePlayer | null;
  isMyTurn: boolean;
  gameStatus: 'waiting' | 'playing' | 'finished';
}
```

### GameRoom 구조
```typescript
interface GameRoom {
  id: string;
  code: string;
  players: GamePlayer[];
  maxPlayers: number;
  gameMode: number;
  status: 'waiting' | 'playing' | 'finished';
  currentRound?: number;
  currentTurn?: number;
  hostId: string;
}
```

### GamePlayer 구조
```typescript
interface GamePlayer {
  id: string;
  username: string;
  avatarId: number;
  isReady: boolean;
  isHost: boolean;
  isMember: boolean;
  totalGames?: number;
  totalWins?: number;
}
```

## 4. 주요 함수들

### 방 관련
- `joinRoom(roomCode: string)` - 방 참여
- `leaveRoom()` - 방 나가기
- `createRoom(gameMode: number)` - 방 생성
- `startGame()` - 게임 시작

### 게임 관련
- `submitAnswer(answer: string)` - 답변 제출
- `submitImage(imageId: string)` - 이미지 제출

### 플레이어 관련
- `updatePlayerReady(isReady: boolean)` - 준비 상태 업데이트
- `updatePlayerInfo(username: string, avatarId: number)` - 플레이어 정보 업데이트

## 5. 소켓 이벤트 목록

### 클라이언트 → 서버
- `join_room` - 방 참여
- `leave_room` - 방 나가기
- `create_room` - 방 생성
- `start_game` - 게임 시작
- `submit_answer` - 답변 제출
- `submit_image` - 이미지 제출
- `update_player_ready` - 준비 상태 업데이트
- `update_player_info` - 플레이어 정보 업데이트

### 서버 → 클라이언트
- `room_joined` - 방 참여 성공
- `room_updated` - 방 정보 업데이트
- `player_joined` - 플레이어 참여
- `player_left` - 플레이어 나감
- `player_updated` - 플레이어 정보 업데이트
- `game_started` - 게임 시작됨
- `turn_changed` - 턴 변경
- `game_finished` - 게임 종료
- `error` - 에러 발생

## 6. 인증 연동

이 훅들은 `AuthContext`와 연동되어 있으며, 로그인된 사용자 정보를 자동으로 사용합니다.

```typescript
// AuthContext의 user 정보가 자동으로 소켓 이벤트에 포함됩니다
const { user } = useAuth();
// user.id, user.name, user.totalGames, user.totalWins 등이 자동으로 전송됩니다
```

## 7. 에러 처리

소켓 연결 에러와 게임 로직 에러는 콘솔에 자동으로 로그됩니다. 필요에 따라 에러 처리 로직을 추가할 수 있습니다.

## 8. 사용 예시

실제 사용 예시는 다음 파일들을 참조하세요:
- `src/hooks/useGameSocketExample.tsx` - 기본 사용법
- `src/examples/SocketUsageExamples.tsx` - 게임 페이지와 메인 페이지 통합 예시
