import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

type msg = {
  message: string;
  username: string;
  userId: string;
}

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<msg[]>([]);
  const [username, setUsername] = useState('')
  const [showNameInput, setShowNameInput] = useState(true)

  const sendMessage = () => {
    socket.emit('send_message', { message, username });
    setMessage('');
  };

  useEffect(() => {
    socket.on('recieve_message', (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: data.message , userId: data.userId, username: data.username},
      ]);
    });

    return () => {
      socket.off('recieve_message');
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>TechHarvesting Chat</h1>
      {showNameInput ? (
        <div>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='enter a name'
            style={{
              width: '300px',
              height: '30px',
            }}
          />
          <button onClick={() => setShowNameInput(false)}>send</button>
        </div>
      ) : (
        <div>
          <div
            style={{
              height: '300px',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              padding: '10px',
            }}
          >
            {messages.map((message, i) => (
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <strong>{message.username}</strong>
                <div key={i}>{message.message}</div>
              </div>
            ))}
          </div>
          <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='enter a message'
            style={{
              width: '300px',
              height: '30px',
            }}
          />
          <button onClick={sendMessage}>send</button>
        </div>
      )}
    </div>
  );
}

export default App;
