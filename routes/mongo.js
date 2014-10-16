var mongoose = require("../mongoose");

mongoose.connect("mongodb:localhost/teamwork",function (error){
	if(error) errorHandle(error);	
});


//处理错误函数
function errorHandle(error){
	if(error) throw error;
	mongoose.connection.db.dropDatabase(function () {
	    mongoose.disconnect();
	})
};