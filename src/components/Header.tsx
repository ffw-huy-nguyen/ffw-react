import React from "react";

const Header = (props: { name: string }) => {
  return (
    <header>
      <h1>Header {props.name}</h1>
    </header>
  );
};

export default Header;
