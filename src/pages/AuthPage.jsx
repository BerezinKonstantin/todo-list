import React from "react";

const AuthPage = ({ handlerSignIn }) => {
  return (
    <div>
      <button onClick={handlerSignIn}>Войти с помощью Google</button>
    </div>
  );
};

export default AuthPage;
