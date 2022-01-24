import React, { useState } from "react";

function Menu() {
  const [menu, setMenu] = useState("blog");

  return (
    <div>
      <ul>
        <li onClick={() => setMenu("blog")}>Blog</li>
        <li onClick={() => setMenu("car")}>Car</li>
      </ul>
    </div>
  );
}

export default Menu;
