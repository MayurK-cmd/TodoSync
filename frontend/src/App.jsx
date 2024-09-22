import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Todos from './components/Todos.jsx';
import CreateTodo from './components/CreateTodo.jsx';
import UpdateTodo from './components/UpdateTodo.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/create-todo" element={<CreateTodo />} />
        <Route path="/update-todo/:title" element={<UpdateTodo />} />
      </Routes>
    </Router>
  );
}

export default App;
