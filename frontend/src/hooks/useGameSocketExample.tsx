import { useGameSocket } from './useGameSocket';

// 게임 페이지에서 사용하는 예시
export const ExampleUsage = () => {
  const {
    gameState,
    isConnected,
    joinRoom,
    leaveRoom,
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
    createRoom(0); // 기본 모드
  };

  const handleStartGame = () => {
    startGame();
  };

  const handleSubmitAnswer = (answer: string) => {
    submitAnswer(answer);
  };

  const handleSubmitImage = (imageId: string) => {
    submitImage(imageId);
  };

  return (
    <div>
      <h3>Socket Status: {isConnected ? 'Connected' : 'Disconnected'}</h3>
      <h3>Game Status: {gameState.gameStatus}</h3>
      <h3>Is My Turn: {gameState.isMyTurn ? 'Yes' : 'No'}</h3>
      
      {gameState.room && (
        <div>
          <h4>Room Code: {gameState.room.code}</h4>
          <h4>Players: {gameState.room.players.length}/{gameState.room.maxPlayers}</h4>
          <ul>
            {gameState.room.players.map(player => (
              <li key={player.id}>
                {player.username} {player.isHost && '(Host)'} {player.isReady && '(Ready)'}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleJoinRoom}>Join Room</button>
      <button onClick={handleCreateRoom}>Create Room</button>
      <button onClick={handleStartGame}>Start Game</button>
      <button onClick={() => handleSubmitAnswer('test answer')}>Submit Answer</button>
      <button onClick={() => handleSubmitImage('image123')}>Submit Image</button>
    </div>
  );
};
