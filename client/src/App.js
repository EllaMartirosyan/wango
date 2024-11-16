import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [backendData, setBackendData] = useState([{}]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/login`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`); // Handle HTTP errors
        }
        return response.json();
      })
      .then(data => {
        setBackendData(data);
      })
      .catch(err => {
        setError(err.message); // Capture any errors
      });
  }, []);

  return (
    <div>
      {error ? ( // Display error message if there is an error
        <p>Error: {error}</p>
      ) : (
        (typeof backendData.data === 'undefined') ? (
          <p>Loading...</p>
        ) : (
          backendData.data.map((item, i) => (
            <p key={i}>{item}</p>
          ))
        )
      )}
    </div>
  );
}

export default App;