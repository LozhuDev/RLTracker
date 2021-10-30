var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const chalk = require('chalk');
const axios = require('axios').default;

//const db = require('rethinkdb');

var port = 80;
var allowTraffic = false;

//GENERAL HTML
app.get('/', (req, res) => {res.sendFile(__dirname + '/CLIENT/HTML/index.html');});
app.get('/stats', (req, res) => {res.sendFile(__dirname + '/CLIENT/HTML/stats.html');});

//PUBLIC LISTENER
app.use(express.static('CLIENT'));
app.get('*', (req, res) => {res.sendFile(__dirname + '/CLIENT/HTML/404.html', 404);});

io.on('connection', (socket) => {
    if(allowTraffic == true){
        
        socket.on('request', (data) => {
            const instance = axios.create({
                timeout: 1000,
                headers: {'X-Custom-Header': 'foobar'}
              });


              instance.get(`https://api.tracker.gg/api/v2/rocket-league/standard/profile/${data.platform}/${data.user}`).then((res) => {
                  setTimeout(() => {
                    socket.emit('userInfo', {data: res.data.data});
                  }, 1000);
              }).catch((err) => {
                  if(err.response != undefined){
                    if(err.response.status == 404){
                        setTimeout(() => {
                            socket.emit('userInfo', {data: 'notFound'});
                        }, 1000);
                    }
                  }
              })
        })

    }
});

//SERVER START
server.listen(port, () => {
    console.log(chalk.grey('[' + chalk.cyan('START') + ']Successfully connected on port: ' + chalk.cyan(port)));
    /*db.connect({ 
        host: 'localhost', 
        port: '28015', 
        db: 'Rift'}
    , function(err, conn) {
        global.conn = conn;
        if(err)console.log(chalk.red(err));
        console.log(chalk.grey('[' + chalk.yellow('DATA') + ']Logged in to Database: ' + chalk.yellow(conn.db) + ' Address: ' + chalk.yellow(conn.host + ':' + conn.port)));
        allowTraffic = true;
    });*/
    allowTraffic = true;
});