import './App.css';
import { AuthContext } from './context/AuthContext';
import { AppThemeProvider } from './styles/ThemeProvider';
import MainPage from './pages/main';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GamePage } from './pages/game';
import styled from '@emotion/styled';

function App() {
  return (
    <AppThemeProvider>
      <AuthContext.Provider value={null}>
        <BrowserRouter>
          <MainContainer>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/game" element={<GamePage />} />
            </Routes>
          </MainContainer>
        </BrowserRouter>
      </AuthContext.Provider>
    </AppThemeProvider>
  );
}

export default App;

const MainContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 0 15px;
  width: 412px;
  background: #ededed;
  box-sizing: border-box;
`;
