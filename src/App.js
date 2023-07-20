import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';
// import { BsSortDownAlt } from 'react-icons/bs';
import Sidebar from './layout/sidebar/Sidebar';
// import Card from './Card';
import Home from './layout/homepage/Home';
import Login from './components/Login';
import Register from './components/Register';
import { auth, db } from './api/firebase';
// import Editor from './Editor';
import Deck from './components/Deck';

const style = {
  bg: `flex flex-col items-center justify-start min-h-screen min-w-screen p-4 font-sans bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
  container: `bg-slate-100 w-full m-auto rounded-md shadow-xl p-4`,
  list: `w-full`,
  count: `text-center p-2 text-lg`,
};

const App = () => {
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');

  const sortCards = (event) => {
    event.preventDefault();
    const sortedCards = [...cards].sort((a, b) => a.rating - b.rating);
    setCards(sortedCards);
  };

  const addCard = async (event) => {
    event.preventDefault();
    setError('');
    if (!currentUser) {
      console.error('Error: not logged in');
      return;
    }
    // Use `question` and `answer` instead of `input.question` and `input.answer`
    if (!question.trim() || !answer.trim()) {
      setError('Both fields must be filled');
      return;
    }

    try {
      const cardDataWithoutId = { question, answer, rating: 1, userId: currentUser.uid };
      await addDoc(collection(db, 'cards'), cardDataWithoutId);
      setQuestion('');
      setAnswer('');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };
  const updateCard = async (id, question, answer, rating, userId) => {
    // Update card in Firestore
    try {
      const cardRef = doc(db, 'cards', id);
      await updateDoc(cardRef, { question, answer, rating, userId });

      // Update local state
      setCards((cards) => cards.map((card) => (card.id === id ? { id, question, answer, rating, userId } : card)));
    } catch (e) {
      console.error('Error updating document: ', e);
    }
  };

  const deleteCard = async (id) => {
    // Delete card from Firestore
    try {
      const cardRef = doc(db, 'cards', id);
      await deleteDoc(cardRef);

      // Update local state
      setCards((cards) => cards.filter((card) => card.id !== id));
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  const changeRating = async (id, delta) => {
    // calculate the new rating
    const newRating = cards.find((card) => card.id === id).rating + delta;

    // ensure rating is between 1 and 5
    const boundedRating = Math.min(5, Math.max(1, newRating));

    // Update card rating in Firestore
    try {
      const cardRef = doc(db, 'cards', id);
      await updateDoc(cardRef, { rating: boundedRating });

      // Update local state
      setCards((cards) => {
        // create a new array with the updated card
        return cards.map((card) => (card.id === id ? { ...card, rating: boundedRating } : card));
      });
    } catch (e) {
      console.error('Error updating document: ', e);
    }
  };

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Cleanup: unsubscribe from auth state changes when component unmounts
    return () => unsubscribeAuth();
  }, []); // Empty dependency array to only run this effect on mount and unmount

  useEffect(() => {
    let unsubscribeFirestore = () => {};

    // Add listener for Firestore updates if a user is logged in
    if (currentUser) {
      const q = query(collection(db, 'cards'));
      unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        let cards = [];
        snapshot.forEach((doc) => {
          if (doc.data().userId === currentUser.uid) {
            cards.push({ ...doc.data(), id: doc.id });
          }
        });
        setCards(cards);
      });
    }

    // Cleanup: unsubscribe from Firestore updates when user logs out or component unmounts
    return () => unsubscribeFirestore();
  }, [currentUser]); // Dependency on currentUser so this effect runs whenever currentUser changes

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
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
