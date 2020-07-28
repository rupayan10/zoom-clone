const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
	res.render('room', { roomID: req.params.room });
});

io.on('connection', (socket) => {
	socket.on('join-room', (roomID, uID) => {
		console.log(roomID, uID);
		socket.join(roomID);
		socket.to(roomID).broadcast.emit('user-connected', uID);

		socket.on('disconnect', () => {
			socket.to(roomID).broadcast.emit('user-disconnected', uID);
		});
	});
});

server.listen(7000, () => console.log('Listening to localhost:7000'));
