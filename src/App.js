import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './layout/sidebar/Sidebar';
import Home from './layout/homepage/Home';
import Login from './components/Login';
import Register from './components/Register';
import Deck from './components/Deck';
import './styles.css';
import { AuthProvider, useAuth } from './AuthContext';
import { useState } from 'react';

const AppContent = () => {
  const { currentUser } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <Router>
      <div className="relative flex items-start justify-center min-h-screen min-w-screen p-4 font-sans bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]">
        {currentUser ? (
          <div className="flex flex-row flex-grow min-h-screen">
            <div
              className={`flex flex-col flex-grow bg-white ${
                sidebarVisible ? 'translate-x-0' : '-translate-x-full'
              } transition-all duration-2000 ease-in-out`}
            >
              <Sidebar currentUser={currentUser} />
            </div>
            <button
              className="self-start mt-4 text-white hover:text-gray-800"
              onClick={() => setSidebarVisible(!sidebarVisible)}
            ></button>
            <div className="flex-grow bg-slate-100 w-full m-auto rounded-md shadow-xl p-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/deck/:deckId" element={<Deck currentUser={currentUser} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="*" element={<Navigate to="/login" />} /> */}
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
