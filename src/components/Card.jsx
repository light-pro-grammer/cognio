import { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { AiOutlineMinus } from 'react-icons/ai';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../api/firebase';
import '../styles.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import Editor from './Editor.jsx';

const Card = ({ card, cards, setCards, questionVisible, setQuestionVisible, answerVisible, setAnswerVisible }) => {
  const [editMode, setEditMode] = useState(false);
  const [input, setInput] = useState({ question: card.question, answer: card.answer });

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

  const toggleEdit = () => {
    setEditMode(!editMode);
    setInput({ question: card.question, answer: card.answer });
  };

  const handleSubmit = () => {
    updateCard(card.id, input.question, input.answer, card.rating, card.userId);
    setEditMode(false);
  };

  useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
  }, []);

  return (
    <li className="border border-black p-4 my-2 w-full rounded flex justify-between bg-slate-200">
      {editMode ? (
        <div className="flex w-full flex-col">
          <div className="w-full flex-1 mr-4">
            <Editor
              content={input.question}
              setContent={(value) => setInput({ ...input, question: value })}
              placeholder="Your question ..."
            />
            <Editor
              content={input.answer}
              setContent={(value) => setInput({ ...input, answer: value })}
              placeholder="Your answer ..."
            />
            <button
              className="group relative w-full flex justify-center py-2 px-4 mb-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
          <div className="w-full flex-1">
            <button
              className="group relative w-full flex justify-center py-2 px-4 mb-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-400 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={toggleEdit}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex space-x-8">
          <div className="flex flex-col space-y-2 w-24">
            <div className="flex space-x-2">
              <button
                className="p-1 bg-green-500 text-white rounded hover:bg-green-700 active:bg-green-900"
                onClick={() => changeRating(card.id, -1)}
              >
                <AiOutlineMinus />
              </button>
              <p className="px-1 text-center text-lg font-bold">{card.rating}</p>
              <button
                className="p-1 bg-green-500 text-white rounded hover:bg-green-700 active:bg-green-900"
                onClick={() => changeRating(card.id, 1)}
              >
                <AiOutlinePlus />
              </button>
            </div>
            <div className="flex justify-between ml-3 mr-6">
              <button className="p-1" onClick={toggleEdit}>
                <FaEdit />
              </button>
              <button className="p-1" onClick={() => deleteCard(card.id)}>
                <FaRegTrashAlt />
              </button>
            </div>
          </div>

          <div className={`w-96 ${questionVisible ? '' : 'opacity-0'}`} onClick={() => setQuestionVisible(true)}>
            <div className="prose" dangerouslySetInnerHTML={{ __html: card.question }}></div>
          </div>
          <div className={`w-max ${answerVisible ? '' : 'opacity-0'}`} onClick={() => setAnswerVisible(true)}>
            <div className="prose" dangerouslySetInnerHTML={{ __html: card.answer }}></div>
          </div>
        </div>
      )}
    </li>
  );
};

export default Card;
