// 게임 페이지에서 Socket.IO 훅 사용 예시

import { useGameSocket } from '../hooks/useGameSocket';

// 기존 GamePage 컴포넌트에 추가할 수 있는 코드
export const GamePageWithSocket = () => {
  const {
    gameState,
    isConnected,
    submitAnswer,
    submitImage,
  } = useGameSocket();

  // 답변 제출 핸들러
  const handleSubmitAnswer = (answer: string) => {
    if (gameState.isMyTurn && isConnected) {
      submitAnswer(answer);
    }
  };

  // 이미지 제출 핸들러
  const handleSubmitImage = (imageId: string) => {
    if (gameState.isMyTurn && isConnected) {
      submitImage(imageId);
    }
  };

  return (
    <div>
      {/* 연결 상태 표시 */}
      <div style={{ color: isConnected ? 'green' : 'red' }}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>

      {/* 게임 상태 표시 */}
      <div>
        Game Status: {gameState.gameStatus}
      </div>

      {/* 현재 턴 표시 */}
      <div>
        {gameState.isMyTurn ? 'Your Turn' : 'Waiting for other player...'}
      </div>

      {/* 방 정보 표시 */}
      {gameState.room && (
        <div>
          <h3>Room: {gameState.room.code}</h3>
          <div>Players: {gameState.room.players.length}/{gameState.room.maxPlayers}</div>
          <div>Round: {gameState.room.currentRound}</div>
        </div>
      )}

      {/* 플레이어 목록 */}
      {gameState.room && (
        <div>
          <h4>Players:</h4>
          {gameState.room.players.map((player: any) => (
            <div key={player.id}>
              {player.username} 
              {player.isHost && ' (Host)'}
              {player.isReady && ' (Ready)'}
            </div>
          ))}
        </div>
      )}

      {/* 게임 액션 버튼들 */}
      <button 
        onClick={() => handleSubmitAnswer('test answer')}
        disabled={!gameState.isMyTurn || !isConnected}
      >
        Submit Answer
      </button>
      
      <button 
        onClick={() => handleSubmitImage('image123')}
        disabled={!gameState.isMyTurn || !isConnected}
      >
        Submit Image
      </button>
    </div>
  );
};

// 메인 페이지에서 방 생성/참여 예시
export const MainPageWithSocket = () => {
  const {
    gameState,
    isConnected,
    joinRoom,
    createRoom,
    updatePlayerInfo,
  } = useGameSocket();

  const handleJoinRoom = (roomCode: string) => {
    if (isConnected) {
      joinRoom(roomCode);
    }
  };

  const handleCreateRoom = (gameMode: number) => {
    if (isConnected) {
      createRoom(gameMode);
    }
  };

  const handleUpdateProfile = (username: string, avatarId: number) => {
    if (isConnected) {
      updatePlayerInfo(username, avatarId);
    }
  };

  return (
    <div>
      <button onClick={() => handleCreateRoom(0)}>Create Room (Basic Mode)</button>
      <button onClick={() => handleCreateRoom(1)}>Create Room (Faker Mode)</button>
      <button onClick={() => handleJoinRoom('ROOM123')}>Join Room</button>
      <button onClick={() => handleUpdateProfile('NewName', 1)}>Update Profile</button>
    </div>
  );
};
