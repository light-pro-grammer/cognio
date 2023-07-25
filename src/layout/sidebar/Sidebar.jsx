import '../../styles.css';
import { BsHouseDoor, BsBook, BsGear, BsBoxArrowRight } from 'react-icons/bs';
import { signOutUser } from '../../api/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { TbLayoutSidebarRightExpand, TbLayoutSidebarRightCollapse } from 'react-icons/tb';

const Sidebar = ({ currentUser, className }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [decks, setDecks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [newDeckName, setNewDeckName] = useState('');
  const [renameDeckId, setRenameDeckId] = useState(null);

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

  const handleRenameDeck = async (event) => {
    event.preventDefault();
    if (renameDeckId && newDeckName) {
      const deckRef = doc(db, 'decks', renameDeckId);
      await updateDoc(deckRef, { name: newDeckName });
      setRenameDeckId(null);
      setNewDeckName('');
    }
  };

  const handleDeleteDeck = async (id) => {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      const deckRef = doc(db, 'decks', id);
      await deleteDoc(deckRef);
    }
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
    <div className="flex relative h-screen bg-white text-gray-800">
      <div
        className={`transition-all duration-200 ease-in-out flex flex-col p-5 border-r bg-white ${className} ${
          isSidebarOpen ? 'w-64' : 'w-0'
        } rounded-tr-lg rounded-br-lg`}
      >
        {isSidebarOpen && (
          <>
            {/* There will be added a Search Functionality with Ctrl + K */}

            <ul className="flex flex-col space-y-3">
              <li className="flex items-center space-x-2">
                <button className="flex items-center w-full space-x-2 px-3 py-2 mt-4 rounded transition-colors duration-200 bg-blue-500 text-white hover:bg-blue-600">
                  <BsHouseDoor size={24} className="mr-2" />
                  Home
                </button>
              </li>
              <li className="flex items-center space-x-2">
                <button className="flex items-center w-full space-x-2 px-3 py-2 rounded transition-colors duration-200 bg-blue-500 text-white hover:bg-blue-600">
                  <BsBook size={24} className="mr-2" />
                  My Decks
                </button>
              </li>
              <li className="flex items-center space-x-2">
                <button className="flex items-center w-full space-x-2 px-3 py-2 rounded transition-colors duration-200 bg-blue-500 text-white hover:bg-blue-600">
                  <BsGear size={24} className="mr-2" />
                  Settings
                </button>
              </li>
              <li className="flex items-center space-x-2">
                <button
                  className="flex items-center w-full space-x-2 px-3 py-2 rounded transition-colors duration-200 bg-red-500 text-white hover:bg-red-600"
                  onClick={signOutUser}
                >
                  <BsBoxArrowRight size={24} className="mr-2" />
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
            <div className="border py-2">
              {decks.map((deck) => (
                <div key={deck.id} className="space-y-2">
                  <div className="flex justify-between items-center space-x-2">
                    <button
                      onClick={() => handleDeckClick(deck.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-700 transition-colors duration-200 truncate flex-grow text-left"
                      style={{ maxWidth: '150px' }}
                    >
                      {deck.name}
                    </button>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setRenameDeckId(deck.id)}
                        className="p-2 bg-gray-200 text-gray-800 rounded shadow hover:bg-gray-300 transition-colors duration-200"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDeleteDeck(deck.id)}
                        className="p-2 bg-red-500 text-white rounded shadow hover:bg-red-700 transition-colors duration-200"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </div>

                  {renameDeckId === deck.id && (
                    <form onSubmit={handleRenameDeck} className="flex space-x-2">
                      <input
                        value={newDeckName}
                        onChange={(e) => setNewDeckName(e.target.value)}
                        placeholder="New deck name"
                        className="px-4 py-2 border border-gray-300 rounded shadow focus:outline-none focus:border-blue-500 transition-colors duration-200"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-700 transition-colors duration-200"
                      >
                        Submit
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <button
        className="absolute top-0 right-0 m-2 text-purple-500 hover:text-purple-700"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <TbLayoutSidebarRightExpand size={24} /> : <TbLayoutSidebarRightCollapse size={24} />}
      </button>
    </div>
  );
};

export default Sidebar;
