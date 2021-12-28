var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var Gpio = require('onoff').Gpio;

const pins = {
  led: new Gpio(17,'out'),
  lamp: new Gpio(27,'out')
}

var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/socket.io-client/dist')));


app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', (socket) => {
    //send to client (index.html) when connected
    socket.emit('updateClient', update());
    //received from client (index.html)
    socket.on('updateServer', pin => {
        togglePin(pin);
    });
});

function togglePin(pin){
    pins[pin].writeSync(1-pins[pin].readSync());
    io.sockets.emit('updateClient', update());
}

function update(){
  return {
    led:pins.led.readSync(),
    lamp:pins.lamp.readSync()
  }
}

http.listen(3000, () => {
  console.log('listening on port 3000');
});
