import { useState } from 'react';

function StreamList() {
  const [item, setItem] = useState('');
  const [list, setList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (item.trim() === '') return;
    setList([...list, item]);
    setItem('');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Your StreamList</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="Add a movie or show"
        />
        <button type="submit">Add</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {list.map((movie, index) => (
          <li key={index} style={{ margin: '10px 0', fontSize: '18px' }}>
            🎬 {movie}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StreamList;
