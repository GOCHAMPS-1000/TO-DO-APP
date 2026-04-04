import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${apiUrl}/todos`)
      .then(res => res.json())
      .then(setTodos);
  }, []);

  const addTodo = async () => {
    if (!task.trim()) return;
    const res = await fetch(`${apiUrl}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task }),
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setTask('');
  };

  return (
    <div className="app">
      <h1>Todo List</h1>
      <div className="add-todo">
        <input value={task} onChange={(e) => setTask(e.target.value)} placeholder="Add a task..." />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.task} {todo.completed && '✓'}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;