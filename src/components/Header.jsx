import React from "react";

const Header = ({ todos, auth }) => {
  return (
    <header className="header">
      <h1>TO DO List</h1>
      {todos ? (
        <p>Количество ваших задач: {todos.length}</p>
      ) : (
        <p>У вас пока нет задач</p>
      )}
      {auth.currentUser && <p>Привет, {auth.currentUser.displayName}</p>}
    </header>
  );
};

export default Header;
