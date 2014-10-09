
var socket = io.connect('10.144.33.1:3000');


angular.module('socketApp', [])
.controller('socketCtrl', ['$scope', function ($scope) {
	$scope.showed = false;

	//存储聊天信息
	$scope.chartText = [];

	$scope.userNames = "登陆";

	//接收所有在线的
	$scope.allUser = {};

	$scope.login = function (){
		$scope.userNames = this.userName;
		$scope.showed = !$scope.showed;	
		socket.emit("online",$scope.userNames);
	};

	$scope.isUserNames = function (userNames){
		return userNames == "登陆";	
	};
	$scope.sendText = function (){
		if(!$scope.textarea) return;
		$scope.date = new Date().getTime();
		$scope.textJson = {
			time:$scope.date,
			user:"$scope.userNames",
			sayText:$scope.textarea
		};
		$scope.chartText.unshift($scope.textJson);
		$scope.textarea = "";
		socket.emit("say",$scope.textJson);
	};

	socket.on("say",function (data){
		$scope.chartText.unshift(data);
		$scope.$apply();
	})


	socket.on('online', function (data) {
		$scope.allUser = data;
		$scope.$apply();
	});
}])