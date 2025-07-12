import './App.css';
import { AuthContext } from './context/AuthContext';
import { AppThemeProvider } from './styles/ThemeProvider';
import MainPage from './pages/main';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <AppThemeProvider>
      <AuthContext.Provider value={null}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage />} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </AppThemeProvider>
  );
}

export default App;
