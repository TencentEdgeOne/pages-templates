import React, { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a1a',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'system-ui, -apple-system'
    }}>
      <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem' }}>
        Hello from EdgeOne Pages ESR!
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#888', marginBottom: '2rem' }}>
        This is a server-side rendered React app.
      </p>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <button
          onClick={() => setCount(count - 1)}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1.2rem',
            background: '#333',
            border: 'none',
            color: '#fff',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background 0.2s',
            ':hover': { background: '#444' }
          }}
        >
          -
        </button>
        <span style={{ fontSize: '2rem', minWidth: '3rem', textAlign: 'center' }}>
          {count}
        </span>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1.2rem',
            background: '#333',
            border: 'none',
            color: '#fff',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background 0.2s',
            ':hover': { background: '#444' }
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default App;