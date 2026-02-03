import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState('Carregando...')

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(res => res.json())
      .then(data => setStatus(data.message))
      .catch(err => setStatus('Servidor indisponível'))
  }, [])

  return (
    <div className="App">
      <header>
        <h1>Refugio's Lanche</h1>
        <p>{status}</p>
      </header>
    </div>
  )
}

export default App
