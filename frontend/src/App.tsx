import './App.css';
import { AuthContext } from './context/AuthContext';
import { AppThemeProvider } from './styles/ThemeProvider';
import MainPage from './pages/main';

function App() {
  return (
    <AppThemeProvider>
      <AuthContext.Provider value={null}>
        <MainPage />
      </AuthContext.Provider>
    </AppThemeProvider>
  );
}

export default App;
