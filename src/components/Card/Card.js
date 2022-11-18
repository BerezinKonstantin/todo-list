import React, { useState } from "react";
import { database } from "../../firebase";
import { updateDoc, doc } from "firebase/firestore";
import DatePicker from "react-datepicker";
const dayjs = require("dayjs");

const Card = ({ card, toggleCardDone, deleteCard }) => {
  const [isCardEdit, setIsCardEdit] = useState(false);
  const [editedTitleInput, setEditedTitleInput] = useState(card.title);
  const [editedTextInput, setEditedTextInput] = useState(card.description);
  const [editedDateInput, setEditedDateInput] = useState("");
  const [editedFormatedDate, setEditedFormatedDate] = useState("");

  const now = dayjs();
  const isLate = dayjs(card.date).isBefore(now);
  const handleEditCard = () => {
    setIsCardEdit(true);
  };
  //Обработчики данных редактируемой карточки
  const handlerEditedTitleInput = (e) => {
    setEditedTitleInput(e.target.value);
  };
  const handlerEditedTextInput = (e) => {
    setEditedTextInput(e.target.value);
  };
  const handlerEditedCardDate = (date) => {
    setEditedDateInput(date);
    const formatedEditDate = dayjs(date).format("D.MMM.YY HH:mm");
    setEditedFormatedDate(formatedEditDate);
  };
  const handlerEditCard = async (e) => {
    e.preventDefault();
    await updateDoc(doc(database, "todos", card.id), {
      title: editedTitleInput,
      description: editedTextInput,
      date: editedFormatedDate,
    });
    setIsCardEdit(false);
  };

  return (
    <>
      {(!isCardEdit && (
        <li className={"card" + (card.done ? " done" : isLate ? " late" : "")}>
          <h2>{card.title}</h2>
          <p>{card.description}</p>
          <div className="row_div">
            <input
              type="checkbox"
              checked={card.done}
              onChange={() => toggleCardDone(card)}
            />
            <p>{card.date}</p>
          </div>
          {card.fileUrl && <a href={card.fileUrl}>Файл</a>}
          <div className="row_div">
            <button onClick={handleEditCard}>Редактировать</button>
            <button onClick={() => deleteCard(card.id)}>Удалить</button>
          </div>
        </li>
      )) ||
        (isCardEdit && (
          <li className="card">
            <form className="form" onSubmit={handlerEditCard}>
              <input
                onChange={handlerEditedTitleInput}
                value={editedTitleInput}
                type="text"
              />
              <input
                onChange={handlerEditedTextInput}
                value={editedTextInput}
                type="text"
              />
              <div className="row_div">
                <input
                  type="checkbox"
                  checked={card.done}
                  onChange={() => toggleCardDone(card)}
                />
                <DatePicker
                  className="datepicker"
                  selected={editedDateInput}
                  onChange={handlerEditedCardDate}
                  showTimeSelect
                  timeFormat="HH:mm"
                  dateFormat="dd.MMM.yy, hh:mm"
                  placeholderText="Click to select a date"
                />
              </div>
              <button type="submit">Сохранить</button>
            </form>
          </li>
        ))}
    </>
  );
};
export default Card;
