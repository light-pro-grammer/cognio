import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../api/firebase';
import CardList from './CardList';

const Deck = ({ currentUser }) => {
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState(null);
  const { deckId } = useParams();

  useEffect(() => {
    let unsubscribeFirestore = () => {};

    // Fetch deck data
    const fetchDeck = async () => {
      const deckRef = doc(db, 'decks', deckId);
      const deckDoc = await getDoc(deckRef);
      setDeck(deckDoc.data());
    };
    fetchDeck();

    // Fetch cards data
    if (currentUser) {
      const q = query(collection(db, 'cards'), where('deckId', '==', deckId));
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

    return () => unsubscribeFirestore();
  }, [currentUser, deckId]);

  return (
    <div>
      {deck && <h1 className="text-3xl font-bold text-center text-gray-900 pb-8">{deck.name}</h1>}
      <CardList cards={cards} setCards={setCards} currentUser={currentUser} deckId={deckId} />
    </div>
  );
};

export default Deck;
