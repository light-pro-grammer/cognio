import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../api/firebase';
import Card from './Card';

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
      {deck && <h1>{deck.name}</h1>}
      {/* You can then display your cards here using the Card component */}
      {cards.map((card) => (
        <Card key={card.id} card={card} /* other props */ />
      ))}
    </div>
  );
};

export default Deck;

// return (
//   <Router>
//     <div className="flex items-center justify-center min-h-screen min-w-screen p-4 font-sans bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]">
//       {currentUser ? (
//         <div className="flex flex-row flex-grow">
//           <Sidebar currentUser={currentUser} />
//           <div className={style.container}>
//             <h1 className="text-3xl font-bold text-center text-gray-800 p-2">Deck Heading</h1>
//             <div>
//               <Editor content={question} setContent={setQuestion} placeholder="Your question ..." />
//               <Editor content={answer} setContent={setAnswer} placeholder="Your answer ..." />

//               <div className={style.formBtns}>
//                 <button
//                   className="border px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700 active:bg-purple-900"
//                   onClick={(event) => addCard(event)}
//                 >
//                   <AiOutlinePlus className="inline mr-2" size={30} /> Add Card
//                 </button>
//               </div>
//             </div>
//             {error && <div className="text-red-500 pt-1 text-sm text-start">{error}</div>}
//             <p className={style.count}>You have {cards.length} cards</p>
//             <button
//               className="px-2 bg-orange-300 text-white rounded hover:bg-orange-600 active:bg-orange-900"
//               onClick={(event) => sortCards(event)}
//             >
//               <BsSortDownAlt size={30} />
//             </button>
//             <ul className={style.list}>
//               {cards.map((card) => (
//                 <Card
//                   key={card.id}
//                   card={card}
//                   updateCard={updateCard}
//                   deleteCard={deleteCard}
//                   changeRating={changeRating}
//                 />
//               ))}
//             </ul>
//           </div>
//         </div>
//       ) : (
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/deck/:deckId" element={<Deck currentUser={currentUser} />} />
//         </Routes>
//       )}
//     </div>
//   </Router>
// );
