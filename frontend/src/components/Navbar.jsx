import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/signup">Signup</Link>
      <br></br>
      <br></br>
      <Link to="/">Login</Link>
      <br></br>
      <br></br>
      <Link to="/todos">Todos</Link>
      <br></br>
      <br></br>
      <Link to="/create-todo">Create Todo</Link>
      <br></br>
      <br></br>
    </nav>
  );
}

export default Navbar;
