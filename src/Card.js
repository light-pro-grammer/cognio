import { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { AiOutlineMinus } from 'react-icons/ai';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import './styles.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

const Card = ({ card, updateCard, deleteCard, changeRating }) => {
  const [editMode, setEditMode] = useState(false);
  const [input, setInput] = useState({ question: card.question, answer: card.answer });

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
        <div className="flex w-full">
          <div className="w-full flex-1 mr-4">
            <textarea
              className="textarea resize-ta w-full h-28 overflow-auto resize-none border border-gray-300 p-2 text-base rounded-md"
              value={input.question}
              onChange={(e) => setInput({ ...input, question: e.target.value })}
            />
            <button
              className="group relative w-full flex justify-center py-2 px-4 mb-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
          <div className="w-full flex-1">
            <textarea
              className="textarea resize-ta w-full h-28 overflow-auto resize-none border border-gray-300 p-2 text-base rounded-md"
              value={input.answer}
              onChange={(e) => setInput({ ...input, answer: e.target.value })}
            />
            <button
              className="group relative w-full flex justify-center py-2 px-4 mb-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-400 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={toggleEdit}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex space-x-5">
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

          <div className="w-60">
            <div className="prose">
              <ReactMarkdown>{card.question}</ReactMarkdown>
            </div>
          </div>

          <div className="flex-grow">
            <div className="prose">
              <ReactMarkdown>{card.answer}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default Card;
