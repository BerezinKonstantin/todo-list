import React, { useState, useEffect } from "react";
import "./App.css";
import Card from "./components/Card/Card";
import { database } from "./firebase";
import { storage } from "./firebase";
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const dayjs = require("dayjs");

function App() {
  const [todos, setTodos] = useState([]);
  const [titleInput, setTitleInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [formatedDate, setFormatedDate] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const handlerDataChange = (date) => {
    setDateInput(date);
    const formatedDate = dayjs(date).format("D.MMM.YY HH:mm");
    setFormatedDate(formatedDate);
  };
  const formFileHandler = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    uploadFiles(file);
  };
  const uploadFiles = (file) => {
    if (!file) {
      setFileUrl("");
      return;
    }
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setFileUrl(downloadURL);
        });
      }
    );
  };
  //Create
  const createCard = async (e) => {
    e.preventDefault();
    if (textInput === "") {
      alert("Вставьте все необходимые значения");
      return;
    }
    await addDoc(collection(database, "todos"), {
      description: textInput,
      title: titleInput,
      done: false,
      date: formatedDate,
      fileUrl: fileUrl,
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
        <DatePicker
          selected={dateInput}
          onChange={handlerDataChange}
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="dd.MMM.yy, hh:mm"
          placeholderText="Click to select a date"
        />
        <button type="submit">Create</button>
      </form>
      <form onSubmit={formFileHandler}>
        <input type="file" className="input" onChange={() => setProgress(0)} />
        <button type="submit">Загрузить файл</button>
        {progress > 0 && <p>Uploading done {progress}%</p>}
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
