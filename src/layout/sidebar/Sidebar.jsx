import '../../styles.css';
import { BsHouseDoor, BsBook, BsGear, BsBoxArrowRight } from 'react-icons/bs';
import { signOutUser } from '../../api/firebase';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ currentUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [decks, setDecks] = useState([]);

  const handleNewDeck = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'decks'), {
        name: deckName,
        userId: currentUser.uid,
        id: Math.random().toString(36).substr(2, 10), // generate a random id
      });
      setDeckName(''); // clear the input field
      setShowForm(false); // hide the form
    } catch (e) {
      console.error('Error adding deck: ', e);
    }
  };

  const navigate = useNavigate();

  const handleDeckClick = (id) => {
    navigate(`/deck/${id}`);
  };

  useEffect(() => {
    let unsubscribeFirestore = () => {};

    // Add listener for Firestore updates if a user is logged in
    if (currentUser) {
      const q = query(collection(db, 'decks'), where('userId', '==', currentUser.uid));
      unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        let decks = [];
        snapshot.forEach((doc) => {
          decks.push({ ...doc.data(), id: doc.id });
        });
        setDecks(decks);
      });
    }

    // Cleanup: unsubscribe from Firestore updates when user logs out or component unmounts
    return () => unsubscribeFirestore();
  }, [currentUser]); // Dependency on currentUser so this effect runs whenever currentUser changes

  return (
    <div className="flex flex-col w-60 p-5 border-r flex-grow bg-gray-100">
      {/* There will be added a Search Functionality with Ctrl + K */}

      <ul className="flex flex-col space-y-3">
        <li className="flex items-center space-x-2">
          <BsHouseDoor size={24} />
          <button className="text-gray-600 hover:text-gray-800">Home</button>
        </li>
        <li className="flex items-center space-x-2">
          <BsBook size={24} />
          <button className="text-gray-600 hover:text-gray-800">My Decks</button>
        </li>
        <li className="flex items-center space-x-2">
          <BsGear size={24} />
          <button className="text-gray-600 hover:text-gray-800">Settings</button>
        </li>
        <li className="flex items-center space-x-2">
          <BsBoxArrowRight size={24} />
          <button className="text-gray-600 hover:text-gray-800" onClick={signOutUser}>
            Log Out
          </button>
        </li>
      </ul>

      <button
        className="border mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700 active:bg-purple-900"
        onClick={() => setShowForm(!showForm)}
      >
        Create Deck
      </button>
      {showForm && (
        <form onSubmit={handleNewDeck}>
          <input
            className="border-2 mt-2 px-4 py-2"
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="Deck Name"
          />
          <button
            className="border mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700 active:bg-purple-900"
            type="submit"
          >
            Submit
          </button>
        </form>
      )}
      {decks.map((deck) => (
        <button key={deck.id} onClick={() => handleDeckClick(deck.id)}>
          {deck.name}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
