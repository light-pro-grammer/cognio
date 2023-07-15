import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { AiOutlineMinus } from 'react-icons/ai';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './styles.css';

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

  return (
    <li className="border border-black p-4 my-2 w-full rounded flex justify-between bg-slate-200">
      {editMode ? (
        <div className="flex flex-col">
          <textarea
            className="p-1"
            value={input.question}
            onChange={(e) => setInput({ ...input, question: e.target.value })}
          />
          <textarea
            className="p-1"
            value={input.answer}
            onChange={(e) => setInput({ ...input, answer: e.target.value })}
          />
          <button className="p-1" onClick={handleSubmit}>
            Submit
          </button>
          <button className="p-1" onClick={toggleEdit}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex space-x-5">
          <div className="flex flex-col space-y-2 border-r border-black w-24">
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

          <div className="w-60 border-r border-black">
            <div className="prose">
              <ReactMarkdown
                renderers={{
                  code: ({ language, value }) => {
                    return <SyntaxHighlighter style={solarizedlight} language={language} children={value} />;
                  },
                }}
              >
                {card.question}
              </ReactMarkdown>
            </div>
          </div>

          <div className="flex-grow">
            <div className="prose">
              <ReactMarkdown
                renderers={{
                  code: ({ language, value }) => {
                    return <SyntaxHighlighter style={solarizedlight} language={language} children={value} />;
                  },
                }}
              >
                {card.answer}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default Card;
