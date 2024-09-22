import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Todos() {
  const [todos, setTodos] = useState([]);
  
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/todos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(res.data);
      } catch (err) {
        alert("Error fetching todos");
      }
    };
    fetchTodos();
  }, []);

  const markCompleted = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3000/completed', { id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.map(todo => todo._id === id ? { ...todo, completed: true } : todo));
    } catch (err) {
      alert("Error marking todo completed");
    }
  };

  return (
    <div>
      <h2>Your Todos</h2>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            {todo.title} - {todo.completed ? "Completed" : "Not completed"}
            <button onClick={() => markCompleted(todo._id)}>Mark as Completed</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
