import React from "react";

const dayjs = require("dayjs");

const Card = ({ card, toggleCardDone, deleteCard }) => {
  const now = dayjs();
  const isLate = dayjs(card.date).isBefore(now);
  return (
    <li className="card-list">
      <div className="card">
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
          <button>Редактировать</button>
          <button onClick={() => deleteCard(card.id)}>Удалить</button>
        </div>
      </div>
    </li>
  );
};
export default Card;
