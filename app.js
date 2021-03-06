/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , ejs = require('ejs')
  , mongoose = require("mongoose");
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

//进入聊天室
app.get('/chart-room', user.chartRoom);

//测试mysql

app.get('/mysql',user.mysql);

//测试mongodb

app.get('/mongodb',user.mongodb);

//请求地址

app.get('/register',function (req,res){
    exa(req.query,res);
    
});


app.get("/mongodb/mongo_test",user.mongo_test)

var server = http.createServer(app);
var io = require('socket.io').listen(server);

var userInfo = {};
    userInfo.allUserName = {},
    userInfo.message = [];
    

io.sockets.on('connection', function (socket) {
    //console.log(socket.request.headers.cookie );
    socket.emit("online", {mySelfId:socket.id,startMessage:userInfo.message});
    //接收用户名
    socket.on("online",function (data){
        userInfo.allUserName[socket.id] = data.userName;
        //向所有用户发送用户名包括自己
       io.sockets.emit("someone userName",{allUserName:userInfo.allUserName});
    });
    //接收信息
    socket.on("say message",function (data){
        //发送给其他用户信息
        userInfo.message.unshift(data);
        socket.broadcast.emit("receive message",data)    
    });

    //发送给某人

    socket.on("say to someone",function (mySelfId,id,masg,start){
      socket.broadcast.to(id).emit("say to someone",mySelfId,masg,start)    
    });


    //下线删除
    socket.on("disconnect",function (){
        if(userInfo.allUserName[socket.id]) delete userInfo.allUserName[socket.id];
        io.sockets.emit("someone userName",{allUserName:userInfo.allUserName,disconnectId:socket.id});
    });
});




/*var db = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS')

mongoose.connect("mongodb://127.0.0.1/teamwork",function (error){
    console.log(error+"111");    
});*/

mongoose.connect('mongodb://localhost/teamwork',function(err){
   if(err) throw err;
   console.log("成功！");
});


var schema = mongoose.Schema;

var chartSchema = schema({
    userName:{type:String},
    password:{type:Number,min:0,max:100}
});

chartSchema.methods.attack = function (){
   //console.log(this);    
};

var chartModule = mongoose.model("chartSchema2",chartSchema);

function exa(query,res){
    /*chartModule.remove(function (error,person){
            if (error) return done(error); 
            console.log(person);
    });*/
    var isRepeat = true;

    chartModule.find(function (error,doc){
        if (error) return done(error);  

        for(var i=0;i<doc.length;i++){
            if(doc[i].userName == query.userName){
                res.send({type:1,message:"重复"});
                isRepeat = false;
                break;
            }  
        };

        if(true){
            chartModule.create({userName:query.userName,password:query.password},function (error,link){
               if (error) return done(error);  
               link.attack();
               res.send({type:0,message:"插入成功"});
            });
        };


    });

    


};


function done (err) {
  if (err) console.error(err);
  mongoose.connection.db.dropDatabase(function () {
    mongoose.disconnect();
  })
}


server.listen(app.get('port'),function(){
  console.log('Express server listening on port ' + app.get('port'));
});
