
var socket = null;


angular.module('socketApp', [])
	.controller('socketCtrl', ['$scope','$templateCache','$compile', function ($scope,$templateCache,$compile) {
		$scope.showed = false;

		//存储聊天信息
		$scope.chartText = [];

		$scope.initUserName = "登陆";

		//接收所有在线的
		$scope.userNames = [];

		//登陆后
		$scope.login = function (){
			
			$scope.initUserName = this.userName;

			$scope.showed = true;

			//连接到socket
			socket = io.connect("http://localhost:3000/");
			//发送用户名
			socket.emit("online",{userName:$scope.initUserName});
			//接收到其他用户名
			socket.on("someone userName",function (otherUser){
				$scope.userNames = otherUser;
				$scope.$apply();	
			});
			//接收消息信息
			socket.on("receive message",function (message){
				$scope.chartText.unshift(message);
				$scope.$apply();
			});
		};

		
		$scope.sendText = function (){
			$scope.data = new Date().getTime();
			$scope.sayText = {
				userName : $scope.initUserName,
				chartText : $scope.textarea,
				time : $scope.data 
			};
			$scope.chartText.unshift($scope.sayText);
			$scope.textarea = "";
			//发送消息信息
			socket.emit("say message",$scope.sayText);
		};

		//私聊
		$scope.singletext = [];
		$scope.singleTeml = $compile($templateCache.get('chartText.html'))($scope);

		$scope.singleChart = function (userName,id){
			if(userName == $scope.userNames) return;	
			$scope.singUser = id;
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
			socket.emit("say to someone", $scope.singUser);
			socket.on("my message",function (data){
				console.log(data);	
			})
		};


		$scope.isUserNames = function (userNames){
			return userNames == "登陆";	
		};


	}])