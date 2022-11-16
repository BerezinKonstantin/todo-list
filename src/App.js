import React, { useState, useEffect } from "react";
import "./App.css";
import Card from "./components/Card/Card";
import { database } from "./firebase";
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

function App() {
  const [todos, setTodos] = useState([]);
  const [titleInput, setTitleInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [dateInput, setDateInput] = useState();
  //Create
  const createCard = async (e) => {
    e.preventDefault();
    if (textInput === "") {
      alert("Вставьте необходимое значение");
      return;
    }
    await addDoc(collection(database, "todos"), {
      description: textInput,
      title: titleInput,
      done: false,
      date: dateInput,
    });
  };
  //Read
  useEffect(() => {
    const q = query(collection(database, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });
    return () => unsubscribe();
  }, []);
  //Update
  const toggleCardDone = async (card) => {
    await updateDoc(doc(database, "todos", card.id), {
      done: !card.done,
    });
  };
  //Delete
  const deleteCard = async (id) => {
    await deleteDoc(doc(database, "todos", id));
  };

  return (
    <div className="App">
      <header>
        <h1>To Do List</h1>
        <p> Ваши задачи: {todos.length}</p>
      </header>
      <form onSubmit={createCard}>
        <input
          type="text"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
        ></input>
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Описание задачи"
        ></textarea>
        <input type="file" />
        <input
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
        />
        <button type="submit" value="Submit">
          Create
        </button>
      </form>
      <main>
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
      </main>
    </div>
  );
}

export default App;
