// TO DO Роутинг: Сделать страницу для авторизации, затем перенаправлять на страницу с карточками.
// Возможно поднять контекст для хранения авторизации

import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import AuthPage from "./pages/AuthPage";
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

import "react-datepicker/dist/react-datepicker.css";
const dayjs = require("dayjs");

const App = () => {
  const [todos, setTodos] = useState([]);
  const [values, setValues] = useState({});
  //const [titleInput, setTitleInput] = useState("");
  //const [textInput, setTextInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [formatedDate, setFormatedDate] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [progress, setProgress] = useState(0);
  //const [user, setUser] = useState();
  const auth = getAuth();
  let user;
  let navigate = useNavigate();
  const handlerSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        //const token = credential.accessToken;
        const user = result.user;
        //setUser(user);
        console.log(user);
        console.log(user.uid);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
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
  const handlerInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    setValues({ ...values, [name]: value });
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
    if (values.text === "") {
      alert("Необходимо добавить описание задачи");
      return;
    }
    await addDoc(collection(db, "todos"), {
      description: values.title,
      title: values.text,
      done: false,
      date: formatedDate,
      fileUrl: fileUrl,
      uid: user.uid,
    });
  };
  useEffect(() => {
    console.log(auth);
    if (auth.currentUser) {
      const q = query(
        collection(db, "todos"),
        where("uid", "==", auth.currentUser.uid)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let todosArr = [];
        querySnapshot.forEach((doc) => {
          todosArr.push({ ...doc.data(), id: doc.id });
        });
        setTodos(todosArr);
      });
      return () => unsubscribe();
    }
  }, [auth.currentUser]);
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
      <Header todos={todos} auth={auth} />
      <Routes>
        <Route
          path="auth"
          element={<AuthPage handlerSignIn={handlerSignIn} />}
        />
        <Route
          path="/*"
          element={
            <MainPage
              auth={auth}
              todos={todos}
              values={values}
              dateInput={dateInput}
              progress={progress}
              setProgress={setProgress}
              formFileHandler={formFileHandler}
              handlerInputChange={handlerInputChange}
              handlerDateChange={handlerDateChange}
              createCard={createCard}
              deleteCard={deleteCard}
              toggleCardDone={toggleCardDone}
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;
