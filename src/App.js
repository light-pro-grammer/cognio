import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './layout/sidebar/Sidebar';
import Home from './layout/homepage/Home';
import Login from './components/Login';
import Register from './components/Register';
import Deck from './components/Deck';
import './styles.css';
import { AuthProvider, useAuth } from './AuthContext';

const AppContent = () => {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className="flex items-center justify-center min-h-screen min-w-screen p-4 font-sans bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]">
        {currentUser ? (
          <div className="flex flex-row flex-grow">
            <Sidebar currentUser={currentUser} />
            <div className="bg-slate-100 w-full m-auto rounded-md shadow-xl p-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/deck/:deckId" element={<Deck currentUser={currentUser} />} />
              </Routes>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
