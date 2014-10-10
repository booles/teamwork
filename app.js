
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , ejs = require('ejs');
var partials = require('express-partials');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views/ejs');
app.set('view engine', "ejs");
app.use(partials()); 
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/login', user.login);

var server = http.createServer(app);
var io = require('socket.io').listen(server);

var users = {};

var usersData = {};
io.use(function(socket, next) {
    //handshake ok
    //usersData[socket.id] = ourUserData;
    //console.log(socket.id);
    next();
});

io.sockets.on('connection', function (socket) {
    //console.log(io.sockets.server.eio.clients);
    /*socket.emit("socket",socket);*/  //当试图发送socket时会出现 RangeError: Maximum call stack size exceeded
    socket.on("online",function (data){
        users[socket.id] = data;        //保存用户名
        io.sockets.emit('online', users);   //发给所有人用户名 包括自己
    });
    //说的话发给所有人，不包括自己
    socket.on("say",function (data){
        socket.join(data.user);
        socket.broadcast.emit('say', data);
    });
    socket.on("say to someone",function (id){
        console.log(id);
        for(var i in users){
           if(i == id){
                socket.broadcast.to(id).emit('my message', "msg"); 
           }
        }
        //   
    })
    //掉线
    socket.on('disconnect', function() {
        if(users[socket.id]){
            delete users[socket.id];
            io.sockets.emit('online', users);
        };
    });
});


server.listen(app.get('port'), "10.144.33.1",function(){
  console.log('Express server listening on port ' + app.get('port'));
});
