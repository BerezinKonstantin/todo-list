import React from "react";

const Card = ({ card, toggleCardDone, deleteCard }) => {
  return (
    <li className="card-list">
      <div className="card">
        <h2 className="card__title">{card.title}</h2>
        <p className="card__text">Text here: {card.description}</p>
        <div className="card__wrap">
          <input
            type="checkbox"
            checked={card.done}
            onChange={() => toggleCardDone(card)}
          />
          <div className="card__date">{card.date}</div>
        </div>
        <div className="card__wrap">
          <button>Редактировать</button>
          <button onClick={() => deleteCard(card.id)}>Удалить</button>
        </div>
      </div>
    </li>
  );
};
export default Card;
