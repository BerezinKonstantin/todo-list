import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AttachFileIcon from "@mui/icons-material/AttachFile";
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
          <Checkbox
            checked={card.done}
            onChange={() => toggleCardDone(card)}
            color="default"
          />
          <div className="card_column">
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <p>{card.formatedDate}</p>
          </div>
          {card.fileUrl && (
            <a href={card.fileUrl} target="_blank" rel="noreferrer">
              <Tooltip title="Прикрепленный файл" placement="right">
                <IconButton className="card_button">
                  <AttachFileIcon />
                </IconButton>
              </Tooltip>
            </a>
          )}
          <div className="column_div">
            <Tooltip title="Редактировать" placement="right">
              <IconButton onClick={handlerEditCard} className="card_button">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Удалить" placement="right">
              <IconButton
                onClick={() => deleteCard(card)}
                className="card_button"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        </li>
      )) ||
        (isCardEdit && (
          <li className="card card_edit">
            <form className="form_edit" onSubmit={submitEditCard}>
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
                <Checkbox
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
                  placeholderText="Выберите дату"
                />
                <button type="submit" className="button card_button">
                  Сохранить
                </button>
              </div>
            </form>
          </li>
        ))}
    </>
  );
};
export default Card;
