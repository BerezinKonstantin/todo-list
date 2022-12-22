import React, { useState } from "react";

import DatePicker from "react-datepicker";
const dayjs = require("dayjs");

const Card = ({ card, toggleCardDone, deleteCard, updateCard }) => {
  const [isCardEdit, setIsCardEdit] = useState(false);
  const [editedTitleInput, setEditedTitleInput] = useState(card.title);
  const [editedTextInput, setEditedTextInput] = useState(card.description);
  const [editedDateInput, setEditedDateInput] = useState(
    card.date ? new Date(card.date.seconds * 1000) : ""
  );
  const [editedFormatedDate, setEditedFormatedDate] = useState(
    card.formatedDate
  );
  const now = dayjs();
  const isLate = dayjs(card.formatedDate).isBefore(now);
  /**
   * Обработчик значения поля ввода заголовка карточки
   * @param {*} e событие изменения поля ввода
   */
  const handlerEditedTitleInput = (e) => {
    setEditedTitleInput(e.target.value);
  };
  /**
   * Обработчик значения поля ввода описания карточки
   * @param {*} e событие изменения поля ввода
   */
  const handlerEditedTextInput = (e) => {
    setEditedTextInput(e.target.value);
  };
  /**
   * Обработчик даты. Принимает выбраную дату и форматирует ее к установленному виду
   * @param {timestamp} date дата в любом формате
   */
  const handlerEditedCardDate = (date) => {
    setEditedDateInput(date);
    const formatedEditDate = dayjs(date).format("D.MMM.YY HH:mm");
    setEditedFormatedDate(formatedEditDate);
  };
  const handlerEditCard = () => {
    setIsCardEdit(true);
    setEditedTitleInput(card.title);
    setEditedTextInput(card.description);
  };
  /**
   * Функция редактирование карточки. Обновляет карточку в базе данных с новыми переданными значениями
   * @param {*} e событие отправки формы
   */
  const submitEditCard = (e) => {
    e.preventDefault();
    updateCard(
      editedTitleInput,
      editedTextInput,
      editedDateInput,
      editedFormatedDate,
      card.id
    );
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
            <p>{card.formatedDate}</p>
          </div>
          {card.fileUrl && (
            <a href={card.fileUrl} target="_blank" rel="noreferrer">
              Файл
            </a>
          )}
          <div className="row_div">
            <button onClick={handlerEditCard}>Редактировать</button>
            <button onClick={() => deleteCard(card)}>Удалить</button>
          </div>
        </li>
      )) ||
        (isCardEdit && (
          <li className="card">
            <form className="form" onSubmit={submitEditCard}>
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
                  dateFormat="dd.MMM.yy, hh:mm aa"
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
