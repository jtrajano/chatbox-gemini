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
    <p className={`font-bold p-4 text-3xl`}>{message}</p>
    </div>
  )
}

export default App
