import React, { useState } from 'react'
import BlogList from './BlogList'
import CarList from './CarList'

function Menu() {
  const [menu, setMenu] = useState('blog');

  let Component;
  switch (menu) {
    case 'blog':
      Component = BlogList;
      break;
    case 'car':
      Component = CarList;
      break;
    default:
      Component = BlogList;
  }
  return (
    <div>
      <ul>
        <li onClick={() => setMenu('blog')}>Blog</li>
        <li onClick={() => setMenu('car')}>Car</li>
      </ul>
      <Component />
    </div>
  )
}

export default Menu
