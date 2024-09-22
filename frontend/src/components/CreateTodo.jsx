import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateTodo() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("Please log in first.");
        return;
      }

      // Create the data object, handling optional fields
      const updatedData = {
        title: data.title,
        description: data.description,
        ...(data.labels && { labels: data.labels.split(',').map(label => label.trim()) }),
        ...(data.reminder && { reminder: new Date(data.reminder) }),
        ...(data.image && { image: data.image })
      };

      console.log("Token:", token);
      console.log("Data being sent:", updatedData);

      // Make the POST request to the backend
      const res = await axios.post('http://localhost:3000/todo', updatedData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Handle success
      reset();
      alert("Todo created successfully");
      navigate('/todos');
    } catch (err) {
      console.error("Axios error:", err.response);
      const errorMessage = err.response?.data?.message || "Error creating todo";
      alert(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title', { required: true })} placeholder="Title" />
      <input {...register('description', { required: true })} placeholder="Description" />
      <input {...register('reminder')} type="datetime-local" placeholder="Reminder (optional)" />
      <input {...register('labels')} placeholder="Labels (comma separated, optional)" />
      <input {...register('image')} placeholder="Image URL (optional)" />
      <button type="submit">Create Todo</button>
    </form>
  );
}

export default CreateTodo;
