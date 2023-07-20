function dsfsdrf() {
  return (
    <div className="flex flex-row flex-grow">
      <div className={style.container}>
        {/* <h1 className="text-3xl font-bold text-center text-gray-800 p-2">Deck Heading</h1> */}
        {/* <div>
          <Editor content={question} setContent={setQuestion} placeholder="Your question ..." />
          <Editor content={answer} setContent={setAnswer} placeholder="Your answer ..." />
          <div className={style.formBtns}>
            <button
              className="border px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700 active:bg-purple-900"
              onClick={(event) => addCard(event)}
            >
              <AiOutlinePlus className="inline mr-2" size={30} /> Add Card
            </button>
          </div>
        </div> */}
        {/* {error && <div className="text-red-500 pt-1 text-sm text-start">{error}</div>}
        <p className={style.count}>You have {cards.length} cards</p> */}
        <button
          className="px-2 bg-orange-300 text-white rounded hover:bg-orange-600 active:bg-orange-900"
          onClick={(event) => sortCards(event)}
        >
          <BsSortDownAlt size={30} />
        </button>
      </div>
    </div>
  );
}

export default dsfsdrf;

// const updateCard = async (id, question, answer, rating, userId) => {
//   // Update card in Firestore
//   try {
//     const cardRef = doc(db, 'cards', id);
//     await updateDoc(cardRef, { question, answer, rating, userId });

//     // Update local state
//     setCards((cards) => cards.map((card) => (card.id === id ? { id, question, answer, rating, userId } : card)));
//   } catch (e) {
//     console.error('Error updating document: ', e);
//   }
// };

// const deleteCard = async (id) => {
//   // Delete card from Firestore
//   try {
//     const cardRef = doc(db, 'cards', id);
//     await deleteDoc(cardRef);

//     // Update local state
//     setCards((cards) => cards.filter((card) => card.id !== id));
//   } catch (e) {
//     console.error('Error deleting document: ', e);
//   }
// };

// const changeRating = async (id, delta) => {
//   // calculate the new rating
//   const newRating = cards.find((card) => card.id === id).rating + delta;

//   // ensure rating is between 1 and 5
//   const boundedRating = Math.min(5, Math.max(1, newRating));

//   // Update card rating in Firestore
//   try {
//     const cardRef = doc(db, 'cards', id);
//     await updateDoc(cardRef, { rating: boundedRating });

//     // Update local state
//     setCards((cards) => {
//       // create a new array with the updated card
//       return cards.map((card) => (card.id === id ? { ...card, rating: boundedRating } : card));
//     });
//   } catch (e) {
//     console.error('Error updating document: ', e);
//   }
// };
