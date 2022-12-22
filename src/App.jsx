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
  const [date, setDate] = useState("");
  const [formatedDate, setFormatedDate] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState();
  const auth = getAuth();
  //let user;
  const navigate = useNavigate();
  const handlerSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        //const credential = GoogleAuthProvider.credentialFromResult(result);
        //const token = credential.accessToken;
        //user = result.user;
        setUser(result.user);
        //console.log(result.user);
        //console.log(user.uid);
        navigate("/");
        //return user;
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
    setDate(date);
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
      description: values.text,
      title: values.title,
      done: false,
      date: date,
      formatedDate: formatedDate,
      fileUrl: fileUrl,
      uid: user.uid,
    });
  };
  useEffect(() => {
    //console.log(auth);
    if (user) {
      const q = query(collection(db, "todos"), where("uid", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let todosArr = [];
        querySnapshot.forEach((doc) => {
          todosArr.push({ ...doc.data(), id: doc.id });
        });
        setTodos(todosArr);
      });
      return () => unsubscribe();
    }
  }, [user]);
  /**
   * Функция редактирования карточки. Изменяет статус заавершенности карточки на противоположный
   * @param {object} card обьект карточки
   */
  const toggleCardDone = async (card) => {
    await updateDoc(doc(db, "todos", card.id), {
      done: !card.done,
    });
  };
  const updateCard = async (title, description, date, formatedDate, id) => {
    console.log(title, description, date, formatedDate, id);
    await updateDoc(doc(db, "todos", id), {
      title: title,
      description: description,
      date: date,
      formatedDate: formatedDate,
    });
  };
  /**
   * Функция удаления карточки по переданному идентификатору
   * @param {string} id идентификатор карточки
   */
  const deleteCard = async (card) => {
    await deleteDoc(doc(db, "todos", card.id));
  };

  return (
    <>
      <Header todos={todos} user={user} />
      <Routes>
        <Route
          path="auth"
          element={<AuthPage handlerSignIn={handlerSignIn} />}
        />
        <Route
          path="/*"
          element={
            <MainPage
              user={user}
              todos={todos}
              values={values}
              date={date}
              progress={progress}
              setProgress={setProgress}
              formFileHandler={formFileHandler}
              handlerInputChange={handlerInputChange}
              handlerDateChange={handlerDateChange}
              createCard={createCard}
              deleteCard={deleteCard}
              toggleCardDone={toggleCardDone}
              updateCard={updateCard}
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;
