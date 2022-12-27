import React from "react";

const AuthPage = ({ handlerSignIn }) => {
  return (
    <div className="column_div">
      <button className="button " onClick={handlerSignIn}>
        Войти с помощью Google
      </button>
    </div>
  );
};

export default AuthPage;
