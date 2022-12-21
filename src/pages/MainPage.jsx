import React from "react";
import { Navigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import Card from "../components/Card";

const MainPage = ({
  auth,
  todos,
  values,
  dateInput,
  progress,
  setProgress,
  formFileHandler,
  handlerInputChange,
  handlerDateChange,
  createCard,
  deleteCard,
  toggleCardDone,
}) => {
  return auth.currentUser ? (
    <main className="App column_div">
      <div className="column_div">
        <form className="form" onSubmit={createCard}>
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
            selected={dateInput}
            onChange={handlerDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="dd.MMM.yy, hh:mm"
            placeholderText="Выберите дату"
          />
          <button type="submit">Добавить задачу</button>
        </form>
        <form className="form" onSubmit={formFileHandler}>
          <input type="file" onChange={() => setProgress(0)} />
          <button type="submit">Загрузить файл</button>
          {progress > 0 && <p>Загружено на {progress}%</p>}
        </form>
      </div>
      {todos && (
        <ul className="list">
          {todos.map((card, index) => (
            <Card
              card={card}
              key={index}
              deleteCard={deleteCard}
              toggleCardDone={toggleCardDone}
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
