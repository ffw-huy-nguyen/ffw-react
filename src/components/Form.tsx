import React, { useState } from "react";

function Form() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleChangeUserName(e: any) {
    setUsername(e.target.value)
  }

  function handleChangePassword(e: any) {
    setPassword(e.target.value)
  }

  function handleLogin() {
    console.log(userName, password);
  }

  return (
    <div>
      <div>
        <input
          type="text"
          value={userName}
          onChange={handleChangeUserName}
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={handleChangePassword}
        />
      </div>
      <div>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Form;
