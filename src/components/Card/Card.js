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
        <li className="card">
          <h2 className={"card__title" + (isLate ? " card__title_late" : "")}>
            {card.title}
          </h2>
          <p className="card__text">Text here: {card.description}</p>
          <div className="card__wrap">
            <input
              type="checkbox"
              checked={card.done}
              onChange={() => toggleCardDone(card)}
            />
            <div
              className="card__date"
              onClick={() => {
                console.log(dayjs(card.date));
                console.log(now);
              }}
            >
              {card.date}
            </div>
          </div>
          {card.fileUrl && <a href={card.fileUrl}>Файл</a>}
          <div className="card__wrap">
            <button onClick={handleEditCard}>Редактировать</button>
            <button onClick={() => deleteCard(card.id)}>Удалить</button>
          </div>
        </li>
      )) ||
        (isCardEdit && (
          <li className="card">
            <form onSubmit={handlerEditCard}>
              <input
                onChange={handlerEditedTitleInput}
                value={editedTitleInput}
                type="text"
                className="card__title-input"
              />
              <input
                onChange={handlerEditedTextInput}
                value={editedTextInput}
                type="text"
                className="card__text-input"
              />
              <div className="card__wrap">
                <input
                  type="checkbox"
                  checked={card.done}
                  onChange={() => toggleCardDone(card)}
                />
                <DatePicker
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
