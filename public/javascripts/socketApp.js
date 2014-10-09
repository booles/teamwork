
var socket = null;


angular.module('socketApp', [])
	.controller('socketCtrl', ['$scope','$templateCache','$compile', function ($scope,$templateCache,$compile) {
		$scope.showed = false;

		//存储聊天信息
		$scope.chartText = [];

		$scope.userNames = "登陆";

		//接收所有在线的
		$scope.allUser = {};

		$scope.login = function (){
			$scope.userNames = this.userName;
			$scope.showed = !$scope.showed;	
			//只有当登陆的时候连接socket
			socket = io.connect('http://localhost:3000');
			//上线了，接收到发过来的用户名，包括自己
			socket.on('online', function (data) {
				$scope.allUser = data;
				$scope.$apply();
			});
			//发送用户名
			socket.emit("online",$scope.userNames);
			//接受说的话
			socket.on("say",function (data){
				$scope.chartText.unshift(data);
				$scope.$apply();
			});
		};

		$scope.isUserNames = function (userNames){
			return userNames == "登陆";	
		};
		$scope.sendText = function (){
			if(!$scope.textarea) return;
			$scope.date = new Date().getTime();
			//把时间，用户和内容发送后台
			$scope.textJson = {
				time:$scope.date,
				user:$scope.userNames,
				sayText:$scope.textarea
			};
			$scope.chartText.unshift($scope.textJson);
			$scope.textarea = "";
			//发送说的话
			socket.emit("say",$scope.textJson);
		};

		//私聊
		$scope.singletext = [];
		$scope.singleTeml = $compile($templateCache.get('chartText.html'))($scope);

		$scope.singleChart = function (userName){
			if(userName == $scope.userNames) return;	
			$scope.singUser = userName;
			angular.element(document.querySelector("body")).append($scope.singleTeml);
		};

		$scope.singleSendText  =function (){
			$scope.singleDate = new Date().getTime();
			$scope.singletext.unshift({
				time:$scope.singleDate,
				user:$scope.userNames,
				sayText:$scope.singleTextarea
			}); 
			$scope.singleTextarea = "";
		};


	}])