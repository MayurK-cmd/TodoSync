import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UpdateTodo() {
  const { title } = useParams();
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/todos/title/${title}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      reset();
      alert("Todo updated successfully");
      navigate('/todos');
    } catch (err) {
      alert("Error updating todo");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('newTitle')} placeholder="New Title" />
      <input {...register('description')} placeholder="Description" />
      <input {...register('reminder')} type="datetime-local" placeholder="Reminder" />
      <input {...register('labels')} placeholder="Labels (comma separated)" />
      <input {...register('image')} placeholder="Image URL" />
      <button type="submit">Update Todo</button>
    </form>
  );
}

export default UpdateTodo;
