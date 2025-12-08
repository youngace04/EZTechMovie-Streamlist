// components/StreamList.js
import { useState } from 'react';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import useLocalStorage from '../hooks/useLocalStorage';
import './StreamList.css';

function StreamList() {
  const [item, setItem] = useState('');
  const [list, setList] = useLocalStorage('streamlist.items', []);
  const [events, setEvents] = useLocalStorage('streamlist.events', []);
  const [editIndex, setEditIndex] = useState(null);

  const logEvent = (type, payload) => {
    const entry = { type, payload, ts: new Date().toISOString() };
    setEvents(prev => [...prev, entry]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = item.trim();
    if (!name) return;

    if (editIndex !== null) {
      const updated = [...list];
      const before = updated[editIndex]?.name;
      updated[editIndex] = { ...updated[editIndex], name };
      setList(updated);
      logEvent('update', { before, after: name });
      setEditIndex(null);
    } else {
      setList(prev => [...prev, { name, completed: false }]);
      logEvent('add', { name });
    }
    setItem('');
  };

  const handleDelete = (index) => {
    const removed = list[index]?.name;
    setList(list.filter((_, i) => i !== index));
    logEvent('delete', { name: removed });
  };

  const handleEdit = (index) => {
    setItem(list[index].name);
    setEditIndex(index);
  };

  const handleComplete = (index) => {
    const updated = [...list];
    updated[index].completed = !updated[index].completed;
    setList(updated);
    logEvent('toggle-complete', { name: updated[index].name, completed: updated[index].completed });
  };

  return (
    <div className="streamlist-container">
      <h1>Your StreamList</h1>

      <form onSubmit={handleSubmit} className="streamlist-form">
        <input
          type="text"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="Add a movie or show"
        />
        <button type="submit">{editIndex !== null ? 'Update' : 'Add'}</button>
      </form>

      <ul className="streamlist-items">
        {list.map((movie, index) => (
          <li key={index} className={movie.completed ? 'completed' : ''}>
            <span>{movie.name}</span>
            <div className="actions">
              <button onClick={() => handleEdit(index)} title="Edit"><FaEdit /></button>
              <button onClick={() => handleDelete(index)} title="Delete"><FaTrash /></button>
              <button onClick={() => handleComplete(index)} title="Complete"><FaCheck /></button>
            </div>
          </li>
        ))}
      </ul>

      {/* Optional: show recent events to verify persistence */}
      <details className="events-panel">
        <summary>Recent activity (Local Storage)</summary>
        <ul className="events-list">
          {events.slice(-10).reverse().map((ev, i) => (
            <li key={i}>
              <code>{ev.ts}</code> — <strong>{ev.type}</strong> — {JSON.stringify(ev.payload)}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

export default StreamList;
