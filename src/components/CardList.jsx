import { db } from '../api/firebase';
import { BsSortDownAlt } from 'react-icons/bs';
import Card from './Card';
import AddCard from './AddCard';
import { useState } from 'react';

const CardList = ({ cards, setCards, currentUser, deckId }) => {
  const [questionsVisible, setQuestionsVisible] = useState({});
  const [answersVisible, setAnswersVisible] = useState({});

  const sortCards = (event) => {
    event.preventDefault();
    const sortedCards = [...cards].sort((a, b) => a.rating - b.rating);
    setCards(sortedCards);
  };

  return (
    <div>
      <AddCard currentUser={currentUser} deckId={deckId} db={db} />
      <button
        className="px-2 mt-2 bg-orange-300 text-white rounded hover:bg-orange-600 active:bg-orange-900"
        onClick={(event) => sortCards(event)}
      >
        <BsSortDownAlt size={30} />
      </button>
      <button
        className="px-2 mt-2 bg-orange-300 text-white rounded hover:bg-orange-600 active:bg-orange-900"
        onClick={() => {
          const newVisibility = {};
          cards.forEach((card) => {
            newVisibility[card.id] = false;
          });
          setQuestionsVisible(newVisibility);
        }}
      >
        Hide All Questions
      </button>
      <button
        className="px-2 mt-2 bg-orange-300 text-white rounded hover:bg-orange-600 active:bg-orange-900"
        onClick={() => {
          const newVisibility = {};
          cards.forEach((card) => {
            newVisibility[card.id] = false;
          });
          setAnswersVisible(newVisibility);
        }}
      >
        Hide All Answers
      </button>
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          cards={cards}
          setCards={setCards}
          questionVisible={questionsVisible[card.id] !== false} // defaults to true
          setQuestionVisible={(visible) => setQuestionsVisible({ ...questionsVisible, [card.id]: visible })}
          answerVisible={answersVisible[card.id] !== false} // defaults to true
          setAnswerVisible={(visible) => setAnswersVisible({ ...answersVisible, [card.id]: visible })}
        />
      ))}
      <p className="text-gray-500 text-sm text-center">You have {cards.length} cards</p>
    </div>
  );
};

export default CardList;
