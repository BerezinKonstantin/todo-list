// TO DO Роутинг: Сделать страницу для авторизации, затем перенаправлять на страницу с карточками.
// Возможно поднять контекст для хранения авторизации

import React, { useState, useEffect } from "react";
import "./App.css";
import Card from "./components/Card/Card";
import { db, storage } from "./firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  query,
  collection,
  onSnapshot,
  getDocs,
  where,
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
  const [user, setUser] = useState();
  const auth = getAuth();
  //const user = auth.currentUser
  const handlerSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
        setUser(user);
        console.log(user);
        console.log(user.uid);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log(errorCode, errorMessage);
      });
  };
  /**
   * Обработчик даты. Принимает выбраную дату и форматирует ее к установленному виду
   * @param {timestamp} date дата в любом формате
   */
  const handlerDateChange = (date) => {
    setDateInput(date);
    const formatedDate = dayjs(date).format("D.MMM.YY HH:mm");
    setFormatedDate(formatedDate);
  };
  /**
   * Обработчик загрузки файла. При отправке формы находит файл и вызывает функцию его загрузки
   * @param {*} e событие отправки формы
   */
  const formFileHandler = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    uploadFiles(file);
  };
  /**
   * Функция загрузки переданного файла в хранилище firestore
   * @param {*} file загружаемый файл
   * @returns прекращает работу функции, если файл отсутствует
   */
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
          setFileUrl(downloadURL);
        });
      }
    );
  };
  /**
   * Функция добавления карточки в базу данных firebase. Создает карточку с переданными в форме данными
   * @param {*} e событие отправки формы
   * @returns прекращает работу функции, если не заполнены все необходимые
   */
  const createCard = async (e) => {
    e.preventDefault();
    if (textInput === "") {
      alert("Вставьте все необходимые значения");
      return;
    }
    await addDoc(collection(db, "todos"), {
      description: textInput,
      title: titleInput,
      done: false,
      date: formatedDate,
      fileUrl: fileUrl,
      uid: user.uid,
    });
  };
  /**
   * Функция получения массива карточек из базы данных firebase.
   */
  const handlerPull = async () => {
    const q = query(
      collection(db, "todos"),
      where("uid", "==", auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    let todosArr = [];
    querySnapshot.forEach((doc) => {
      todosArr.push({ ...doc.data(), id: doc.id });
    });
    setTodos(todosArr);
  };

  //useEffect(() => {
  //  const q = query(collection(db, "todos"), where("author", "==", user.uid));;
  //  const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //    let todosArr = [];
  //    querySnapshot.forEach((doc) => {
  //      todosArr.push({ ...doc.data(), id: doc.id });
  //    });
  //    setTodos(todosArr);
  //  });
  //  return () => unsubscribe();
  //}, []);
  /**
   * Функция редактирования карточки. Изменяет статус заавершенности карточки на противоположный
   * @param {object} card обьект карточки
   */
  const toggleCardDone = async (card) => {
    await updateDoc(doc(db, "todos", card.id), {
      done: !card.done,
    });
  };
  /**
   * Функция удаления карточки по переданному идентификатору
   * @param {string} id идентификатор карточки
   */
  const deleteCard = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  return (
    <>
      <header className="header">
        <h1>TO DO List</h1>
        <p> Количество задач: {todos.length} </p>
        {auth && <p>Привет, {auth.currentUser.displayName}</p>}
      </header>
      <main className="App column_div">
        <div className="column_div">
          <form className="form" onSubmit={createCard}>
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Заголовок"
            ></input>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Описание задачи"
            ></textarea>
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
            {progress > 0 && <p>Uploading done {progress}%</p>}
          </form>
        </div>
        <button onClick={handlerSignIn}>Войти через Google</button>
        <button onClick={handlerPull}>Pull</button>
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
    </>
  );
}

export default App;
