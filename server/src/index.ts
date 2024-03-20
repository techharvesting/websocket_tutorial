import express from 'express'
import { createServer } from 'http'
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
app.use(cors())
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173'
  }
})

io.on('connection', (socket) => {
  console.log('new connection established ', socket.id)
  socket.on('send_message', (data) => {
    console.log(data)

    const response = {
      message: data.message,
      userId: socket.id,
      username: data.username
    }

    io.emit('recieve_message', response)
  })
})

const port = 3001;
httpServer.listen(port, () => {
  console.log('Server is running on port ' , port)
})