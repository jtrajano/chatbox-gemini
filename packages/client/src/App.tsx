import { useEffect, useState } from 'react';
import './App.css';
import { Button } from './components/ui/button';

function App() {
  const [message, setMessage] = useState('');
  // useEffect(() => {
  //   fetch('api/hello')
  //   .then(res => res.text())
  //   .then(data => setMessage(data))
  // }, []);

  async function handleClick() {
    const response = await fetch('/api/hello');
    const data = await response.text();
    setMessage(data);
  }

  return (
    <div>
      <p className={`font-bold p-4 text-3xl`}>{message}</p>
      <Button onClick={handleClick}>Destructive</Button>
    </div>
  );
}

export default App;
