import React from "react";
import { Navigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import Card from "../components/Card";

const MainPage = ({
  user,
  todos,
  values,
  date,
  progress,
  fileName,
  formFileHandler,
  handlerInputChange,
  handlerDateChange,
  createCard,
  deleteCard,
  toggleCardDone,
  updateCard,
}) => {
  return user ? (
    <main className="App column_div">
      <div className="column_div">
        <form onSubmit={createCard}>
          <input
            type="text"
            name="title"
            value={values.title || ""}
            onChange={handlerInputChange}
            placeholder="Введите название задачи"
          />
          <textarea
            name="text"
            value={values.text || ""}
            onChange={handlerInputChange}
            placeholder="Добавьте описание"
          />
          <DatePicker
            className="datepicker"
            selected={date}
            onChange={handlerDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="dd.MMM.yy, hh:mm aa"
            placeholderText="Выберите дату"
          />
          <button type="submit" className="button">
            Добавить задачу
          </button>
        </form>
        <form onSubmit={formFileHandler}>
          <label className="input-file">
            <input type="file" name="file" onChange={formFileHandler} />
            <span className="input-file-btn">Прикрепить файл</span>
            <span className="input-file-text">{fileName}</span>
          </label>
          {progress > 0 && <p>Загружено на {progress}%</p>}
        </form>
      </div>
      {todos && (
        <ul>
          {todos.map((card) => (
            <Card
              card={card}
              key={card.id}
              deleteCard={deleteCard}
              toggleCardDone={toggleCardDone}
              updateCard={updateCard}
            ></Card>
          ))}
        </ul>
      )}
    </main>
  ) : (
    <Navigate to="auth" />
  );
};

export default MainPage;
