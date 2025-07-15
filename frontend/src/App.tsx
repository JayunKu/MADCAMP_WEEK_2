import './App.css';
import { AuthProvider } from './context/AuthProvider';
import { AppThemeProvider } from './styles/ThemeProvider';
import MainPage from './pages/main';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GamePage } from './pages/game';
import styled from '@emotion/styled';
import { RoundResultPage } from './pages/game/RoundResult';
import { GameResultPage } from './pages/game/GameResult';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { RoomProvider } from './context/RoomContext';
import { UIProvider } from './context/UIContext';

function App() {
  const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;

  console.log('Google OAuth Client ID:', clientId);

  if (!clientId || clientId === '') {
    console.error(
      'Google OAuth Client ID is not defined in environment variables.'
    );
    return <div>Error: Google OAuth Client ID is not set.</div>;
  }

  return (
    <AppThemeProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
          <RoomProvider>
            <UIProvider>
              <BrowserRouter>
                <MainContainer>
                  <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/game" element={<GamePage />} />
                    <Route path="/game/result" element={<GameResultPage />} />
                    <Route
                      path="/game/round_result"
                      element={<RoundResultPage />}
                    />

                    <Route
                      path="*"
                      element={
                        <div>
                          <h1 style={{ textAlign: 'center' }}>404 Not Found</h1>
                          <p style={{ textAlign: 'center' }}>
                            페이지를 찾을 수 없습니다.
                          </p>
                        </div>
                      }
                    />
                  </Routes>
                </MainContainer>
              </BrowserRouter>
            </UIProvider>
          </RoomProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
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
