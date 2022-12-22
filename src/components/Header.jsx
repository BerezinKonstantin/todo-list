import React from "react";

const Header = ({ todos, user }) => {
  return (
    <header className="header">
      <h1>To Do List</h1>
      {user && <p>Привет, {user.displayName}</p>}
      {todos ? (
        <p>Количество ваших задач: {todos.length}</p>
      ) : (
        <p>У вас пока нет задач</p>
      )}
    </header>
  );
};

export default Header;
