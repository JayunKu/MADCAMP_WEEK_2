import './App.css';
import { AuthContext } from './context/AuthContext';
import MainPage from './pages/main';

function App() {
  return (
    <AuthContext.Provider value={null}>
      <MainPage />
    </AuthContext.Provider>
  );
}

export default App;
