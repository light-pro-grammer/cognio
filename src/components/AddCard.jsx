import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../api/firebase';
import { AiOutlinePlus } from 'react-icons/ai';
import Editor from './Editor';

function AddCard({ currentUser, deckId }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const addCard = async (event) => {
    event.preventDefault();
    setError('');
    if (!currentUser) {
      console.error('Error: not logged in');
      return;
    }
    // Use `question` and `answer` instead of `input.question` and `input.answer`
    if (!question.trim()) {
      setError('Fill in at least a question');
      return;
    }

    try {
      const cardDataWithoutId = { question, answer, rating: 1, userId: currentUser.uid, deckId };
      await addDoc(collection(db, 'cards'), cardDataWithoutId);
      setQuestion('');
      setAnswer('');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div>
      <Editor content={question} setContent={setQuestion} placeholder="Your question ..." />
      <Editor content={answer} setContent={setAnswer} placeholder="Your answer ..." />
      <button
        className="border px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700 active:bg-purple-900"
        onClick={(event) => addCard(event)}
      >
        <AiOutlinePlus className="inline mr-2" size={30} /> Add Card
      </button>
      {error && <div className="text-red-500 pt-1 text-sm text-start">{error}</div>}
    </div>
  );
}

export default AddCard;
