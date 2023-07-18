import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsSortDownAlt } from 'react-icons/bs';
import Sidebar from './Sidebar';
import Card from './Card';
import Login from './Login';
import Register from './Register';
import { auth, db } from './firebase';
import TextAreaWithImageDropzone from './TextAreaWithImageDropzone';

const style = {
  bg: `flex flex-col items-center justify-start min-h-screen min-w-screen p-4 font-sans bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
  container: `bg-slate-100 w-full m-auto rounded-md shadow-xl p-4`,
  button: `border p-4 ml-2 bg-purple-500 text-white rounded hover:bg-purple-700 active:bg-purple-900`,
  list: `w-full`,
  count: `text-center p-2 text-lg`,
  errorMessage: `text-red-500 p-2 text-sm text-center`,
};

const App = () => {
  const [cards, setCards] = useState([]);
  const [input, setInput] = useState({ question: '', answer: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');

  const sortCards = (event) => {
    event.preventDefault();
    const sortedCards = [...cards].sort((a, b) => a.rating - b.rating);
    setCards(sortedCards);
  };

  const addCard = async (event) => {
    event.preventDefault();
    setError(''); // Reset the error state when the form is submitted
    if (!currentUser) {
      console.error('Error: not logged in');
      return;
    }
    if (!input.question.trim() || !input.answer.trim()) {
      setError('Both fields must be filled'); // Set the error state if fields are empty
      return;
    }

    // Add new card to Firestore
    try {
      const cardDataWithoutId = { ...input, rating: 1, userId: currentUser.uid };
      await addDoc(collection(db, 'cards'), cardDataWithoutId);
      setInput({ question: '', answer: '' });
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
            {/* <Sidebar /> */}
            <div className={style.container}>
              <h1 className="text-3xl font-bold text-center text-gray-800 p-2">Deck Heading</h1>
              <form className="flex justify-between">
                <TextAreaWithImageDropzone
                  value={input.question}
                  onChange={(value) => setInput({ ...input, question: value })}
                  placeholder="Question"
                />
                <TextAreaWithImageDropzone
                  value={input.answer}
                  onChange={(value) => setInput({ ...input, answer: value })}
                  placeholder="Answer"
                />

                <div className={style.formBtns}>
                  <button className={style.button} onClick={(event) => addCard(event)}>
                    <AiOutlinePlus size={30} />
                  </button>
                  <button className={style.button} onClick={(event) => sortCards(event)}>
                    <BsSortDownAlt size={30} />
                  </button>
                </div>
              </form>
              {error && <div className={style.errorMessage}>{error}</div>}
              <p className={style.count}>You have {cards.length} cards</p>
              <ul className={style.list}>
                {cards.map((card) => (
                  <Card
                    key={card.id}
                    card={card}
                    updateCard={updateCard}
                    deleteCard={deleteCard}
                    changeRating={changeRating}
                  />
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
