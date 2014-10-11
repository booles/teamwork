
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
			socket = io.connect("10.144.33.1:3000/");
			//接受自己的id
			socket.on("online",function (data){
				$scope.mySelfId = data.mySelfId;
			})
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
			//登陆后就绑定单人聊天，如果有人跟你单聊，立马弹出单聊框
			socket.on("say to someone",function (otherWithId,data,start){
				/*
					如果有人跟自己单聊，此时要自动建一个对话框
				*/
				if(start == "start"){
					angular.element(document.querySelector("body")).append($scope.singleTeml);
					$scope.singUser = otherWithId;  //将$scope.singUser设置为和你单聊人的id
					$scope.withUserName = data.userName;
					$scope.singletextArray.unshift(data);
					$scope.$apply();
				};
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
		$scope.singletextArray = [];
		$scope.singleTeml = $compile($templateCache.get('chartText.html'))($scope);

		$scope.singleChart = function (withUserName,id){
			if(withUserName == $scope.initUserName ) return;
			$scope.withUserName =  withUserName;	
			$scope.singUser = id;
			angular.element(document.querySelector("body")).append($scope.singleTeml);
			socket.emit("say to someone", $scope.mySelfId, $scope.singUser,$scope.singletext);
			
		};

		$scope.singleSendText  =function (){
			$scope.singleDate = new Date().getTime();
			$scope.singletext = {
				userName : $scope.initUserName,
				chartText : $scope.singleTextarea,
				time : $scope.singleDate 
			}; 
			$scope.singletextArray.unshift($scope.singletext);
			$scope.singleTextarea = "";
			/*
				发送对话内容，分为两种情况：
				1：要和默认单聊，那么将会发送：
					自己的id，发送方的id，对话内容，开始标识
			*/
			socket.emit("say to someone", $scope.mySelfId, $scope.singUser,$scope.singletext,"start");

		};

		$scope.isUserNames = function (userNames){
			return userNames == "登陆";	
		};


	}])