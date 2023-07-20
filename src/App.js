import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './layout/sidebar/Sidebar';
import Home from './layout/homepage/Home';
import Login from './components/Login';
import Register from './components/Register';
import { auth } from './api/firebase';
import Deck from './components/Deck';
import './styles.css';

const style = {
  bg: `flex flex-col items-center justify-start min-h-screen min-w-screen p-4 font-sans bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
  container: `bg-slate-100 w-full m-auto rounded-md shadow-xl p-4`,
  list: `w-full`,
  count: `text-center p-2 text-lg`,
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Cleanup: unsubscribe from auth state changes when component unmounts
    return () => unsubscribeAuth();
  }, []); // Empty dependency array to only run this effect on mount and unmount

  return (
    <Router>
      <div className="flex items-center justify-center min-h-screen min-w-screen p-4 font-sans bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]">
        {currentUser ? (
          <div className="flex flex-row flex-grow">
            <Sidebar currentUser={currentUser} />
            <div className={style.container}>
              <Routes>
                <Route path="/" element={<Home />} /> {/* You need to create a Home component */}
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

export default App;
