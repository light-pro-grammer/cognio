import { AiOutlinePlus } from 'react-icons/ai';

function AddCard() {
  const addCard = async (event) => {
    event.preventDefault();
    setError('');
    if (!currentUser) {
      console.error('Error: not logged in');
      return;
    }
    // Use `question` and `answer` instead of `input.question` and `input.answer`
    if (!question.trim() || !answer.trim()) {
      setError('Both fields must be filled');
      return;
    }

    try {
      const cardDataWithoutId = { question, answer, rating: 1, userId: currentUser.uid };
      await addDoc(collection(db, 'cards'), cardDataWithoutId);
      setQuestion('');
      setAnswer('');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };
  return (
    <div>
      <button
        className="border px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700 active:bg-purple-900"
        onClick={(event) => addCard(event)}
      >
        <AiOutlinePlus className="inline mr-2" size={30} /> Add Card
      </button>
    </div>
  );
}

export default AddCard;
