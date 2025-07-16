import React, { useEffect, useRef } from 'react';
import './App.css';
import { AuthProvider } from './context/AuthProvider';
import { AppThemeProvider } from './styles/ThemeProvider';
import MainPage from './pages/main';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GamePage } from './pages/game';
import styled from '@emotion/styled';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { RoomProvider } from './context/RoomContext';
import { UIProvider } from './context/UIContext';
import { SocketProvider } from './context/SocketContext';
import lastNight from './assets/audio/last-night.mp3';
import smoothMoves from './assets/audio/smooth-moves.mp3';
import nightAndDay from './assets/audio/night-and-day.mp3';

const playlist = [lastNight, smoothMoves, nightAndDay];

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = React.useState(0);
  const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, [currentTrack]);

  const handleEnded = () => {
    setCurrentTrack((prevTrack) => (prevTrack + 1) % playlist.length);
  };

  console.log('Google OAuth Client ID:', clientId);

  if (!clientId || clientId === '') {
    console.error(
      'Google OAuth Client ID is not defined in environment variables.'
    );
    return <div>Error: Google OAuth Client ID is not set.</div>;
  }

  return (
    <AppThemeProvider>
      <UIProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <AuthProvider>
            <RoomProvider>
              <BrowserRouter>
                <SocketProvider>
                  <MainContainer>
                    <audio
                      ref={audioRef}
                      src={playlist[currentTrack]}
                      onEnded={handleEnded}
                      autoPlay
                    />
                    <Routes>
                      <Route path="/" element={<MainPage />} />
                      <Route path="/game" element={<GamePage />} />

                      <Route
                        path="*"
                        element={
                          <div>
                            <h1 style={{ textAlign: 'center' }}>
                              404 Not Found
                            </h1>
                            <p style={{ textAlign: 'center' }}>
                              페이지를 찾을 수 없습니다.
                            </p>
                          </div>
                        }
                      />
                    </Routes>
                  </MainContainer>
                </SocketProvider>
              </BrowserRouter>
            </RoomProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </UIProvider>
    </AppThemeProvider>
  );
}

export default App;

const MainContainer = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 0 15px;
  width: 412px;
  background: #ededed;
  overflow: hidden;
`;
