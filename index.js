const app = require('http').createServer(handler);
const io = require('socket.io').listen(app);
const fs = require('fs');

app.listen(3000, function () {
  console.log('Listening on port ' + 3000);
});


function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    });
}


io.sockets.on('connection', function (socket) {
  socket.broadcast.emit('newUser', "у нас новый пользователь!");

  let userName = 'Пользователь';
  socket.on('setUserName', (data) => {
    userName = data;
  });

  socket.on('message', function (text, cb) {
    console.log(userName + " : " + text);
    text = userName + " : " + text;
    socket.broadcast.emit('message', text);
    cb("Ответ получен");
  });

});