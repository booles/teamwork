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

var userInfo = {};
    userInfo.allUserName = {};
    

io.sockets.on('connection', function (socket) {

    //接收用户名
    socket.on("online",function (data){
        userInfo.allUserName[socket.id] = data.userName;
        //向所有用户发送用户名包括自己
       io.sockets.emit("someone userName",userInfo.allUserName);
    });
    //接收信息
    socket.on("say message",function (data){
        //发送给其他用户信息
        socket.broadcast.emit("receive message",data)    
    });

    //下线删除
    socket.on("disconnect",function (){
        if(userInfo.allUserName[socket.id]) delete userInfo.allUserName[socket.id];
        io.sockets.emit("someone userName",userInfo.allUserName);
    });


});


server.listen(app.get('port'),function(){
  console.log('Express server listening on port ' + app.get('port'));
});
