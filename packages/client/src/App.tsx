import { useEffect, useState} from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    fetch('api/hello')
    .then(res => res.text())
    .then(data => setMessage(data))
  }, []);

  return (
   <div>
    <p>{message}</p>
    </div>
  )
}

export default App
