angular.module('app.controllers', [])
  
.controller('loginCtrl', function($scope, $state, API) {
	$scope.login = {};
	$scope.login.username = '';
	$scope.login.password = '';
	console.log('login controlller');
	$scope.signIn = function() {
		 API.login($scope.login).success(function(data) {
	        console.log("success");
	        localStorage.setItem('user', data.data[0].username);
	        $state.go('devops-Home.projects');	
	        $scope.login.username = '';
			$scope.login.password = '';     
	      }).error(function(data) {
	      console.log("error");
	      $scope.errMsg = 'User is not registered';
	       $state.go('login');
	    }); 
	}
})

.controller('registerCtrl', function($scope,$state, API) {
	$scope.user = {};
	$scope.cuser = {};	
		$scope.registerUser = function(valid) {
			if(valid){
				console.log($scope.user.password)
				console.log($scope.cuser.confirmPassword)
				console.log($scope.user.password===$scope.cuser.confirmPassword)
				if($scope.user.password===$scope.cuser.confirmPassword) {
					API.signup($scope.user).success(function(data) {
				      console.log("success");
				      $state.go('login');
				    }).error(function(data) {
				      console.log("error");
				      $state.go('devops-Home.logout');
				    });
				} else {
					$scope.errMsg = "Password and confirm password is not same";
				}				
			} else {
				$scope.errMsg = "Please correct the form";
			}
			
		}
	

	
	

})
   
.controller('editInfoCtrl', function($scope,$state,$location,API) {
	if(localStorage.getItem('user')==null){
		$state.go('login');
	}
	$scope.user = {};
	$scope.cuser = {};
	$scope.user.username = localStorage.getItem('user');
	
	$scope.updateUser = function(valid) {
		if(valid){
			console.log($scope.user.password)
			console.log($scope.cuser.confirmPassword)
			console.log($scope.user.password===$scope.cuser.confirmPassword)
			if($scope.user.password===$scope.cuser.confirmPassword) {
				console.log($scope.user.username);
				API.editInfo($scope.user).success(function(data) {
			      console.log("success");
			      $scope.msg = "User details Updated!!";
			      //$state.go('devops-Home.projects');
			      $location.url('/devops/projects');
			    }).error(function(data) {
			      console.log("error");	      
			      $state.go('devops-Home.logout');
			    });
			} else {
				$scope.errMsg = "Password and confirm password is not same";
				}				
			} else {
				$scope.errMsg = "Please correct the form";
			}
			
	}
})
   
.controller('projectsCtrl', function($scope,$state,$timeout, API) {
	console.log('projects controller');
	if(localStorage.getItem('user')==null){
		$state.go('login');
	}
	$scope.projects = [];
	$scope.project = {};
	$scope.errorMsg = '';
	$scope.successMsg = '';
	$scope.clearErrMsg = true;
	$scope.clearSuccMsg = true;
	API.getAllProjects().success(function(data){
		console.log(data.data);
		$scope.projects = data.data;
	})	
	$scope.addProjects = function() {
		if($scope.project.name) {
			console.log($scope.project.name);
			$scope.projects.push($scope.project);
			$scope.project.id = $scope.projects.length;		
			API.addProject($scope.project).success(function(data) {
				$scope.successMsg = 'Project "'+$scope.project.name+'" added.';
				$scope.clearErrMsg = true;
				$scope.clearSuccMsg = false;
				$timeout(function(){
					$scope.clearSuccMsg = true;

				},5000);
			}).error(function(data){
				$scope.errorMsg = 'Server Error';
				console.log("Server Error");
				$scope.clearErrMsg = false;
			});
			
		} else {
			$scope.errorMsg = 'Please enter project name to add';
			console.log("Blank Project name");
			$scope.clearErrMsg = false;
		}
		
	}
	$scope.removeProjects = function(index,sIndex){
		if($scope.projects.length>0) {
			$scope.projects.splice(index, 1);
			console.log(sIndex)
			API.removeProject('{"id":"'+sIndex+'"}').success(function(data){
				$scope.errorMsg = 'Project deleted.';
			}).error(function(data){
				$scope.errorMsg = 'Server Error.';
			});
			
		} else {
			$scope.errorMsg = 'There are no projects to remove'
		}
	   
	}
})     
.controller('logoutCtrl', function($scope, $state) {
	localStorage.removeItem('user');
	console.log('logged out');
	clearInterval(window.projAlert);
	$scope.gotoLogin = function() {
		console.log("here")
		$state.go('login',{}, {reload: true, inherit: false});
	}
})   
.controller('projectAlertsCtrl', function($scope,$state,$http,$interval,API) {
if(!localStorage.getItem('user')==null){
		$state.go('login');
	}
	$scope.status = '';
	$scope.graph = {};
	$scope.networkInGraph = {};
	$scope.networkOutGraph = {};


	window.projAlert = setInterval(getStatus, 5000);
	API.getCPUMetrics().success(function(data){
		$scope.metrics = data.data.Datapoints;
		 $scope.graph.series = ['CPUUtilization'];
		var metricData = [];
		var metricLabel = [];	
		var temp = [];
		if($scope.metrics.length>0){
			for(var i in $scope.metrics) {
				var timestamp = new Date($scope.metrics[i].Timestamp);	
				temp.push(timestamp+','+$scope.metrics[i].Maximum);
				
			}
			temp = temp.sort();
			for(var j=0;j<temp.length;j++){
				var tempArr = temp[j].split(',');
				var tempTimestamp = new Date(tempArr[0]);
				console.log(tempArr)
				metricLabel.push(tempTimestamp.getHours()+':'+tempTimestamp.getMinutes()+':'+tempTimestamp.getSeconds());
				metricData.push(tempArr[1]);
			}
			console.log(metricLabel)
			console.log(metricData)
			$scope.graph.data = [metricData];
			$scope.graph.labels = metricLabel;

		}
	}).error(function(data){
		console.log('Error while getting metric data.')
	});
	API.getNetworkInMetrics().success(function(data){
		
		$scope.networkInGraph.series = ['NetworkIn'];
		var metricData1 = [];
		var metricLabel1 = [];
		var temp = [];
		console.log(data);
		if(data.data.Datapoints.length>0){
			for(var i in data.data.Datapoints) {
				var timestamp = new Date(data.data.Datapoints[i].Timestamp);	
				temp.push(timestamp+','+data.data.Datapoints[i].Maximum/1024);
			}
			temp = temp.sort();
			for(var j=0;j<temp.length;j++){
				var tempArr = temp[j].split(',');
				var tempTimestamp = new Date(tempArr[0]);
				console.log(tempArr)
				metricLabel1.push(tempTimestamp.getHours()+':'+tempTimestamp.getMinutes()+':'+tempTimestamp.getSeconds());
				metricData1.push(tempArr[1]);
			}
			$scope.networkInGraph.data = [metricData1];
			$scope.networkInGraph.labels = metricLabel1;

		}
	}).error(function(data){
		console.log('Error while getting metric data.')
	});
	API.getNetworkOutMetrics().success(function(data){		
		$scope.networkOutGraph.series = ['NetworkOut'];
		var metricData2 = [];
		var metricLabel2 = [];
		var temp = [];
		console.log(data);
		if(data.data.Datapoints.length>0){
			for(var i in data.data.Datapoints) {
				var timestamp = new Date(data.data.Datapoints[i].Timestamp);	
				temp.push(timestamp+','+data.data.Datapoints[i].Maximum/1024);				
			}
			temp = temp.sort();
			for(var j=0;j<temp.length;j++){
				var tempArr = temp[j].split(',');
				var tempTimestamp = new Date(tempArr[0]);
				console.log(tempArr)
				metricLabel2.push(tempTimestamp.getHours()+':'+tempTimestamp.getMinutes()+':'+tempTimestamp.getSeconds());
				metricData2.push(tempArr[1]);
			}
			$scope.networkOutGraph.data = [metricData2];
			$scope.networkOutGraph.labels = metricLabel2;
		}
	}).error(function(data){
		console.log('Error while getting metric data.')
	});
	function getStatus() {
		$http.get('http://ec2-54-84-30-170.compute-1.amazonaws.com/helloPHP/').success( function(response) {
		     console.log("It is up");
		     $scope.status = 'up';
		  })
		  .error( function(response) {
		     console.log("It is down");
		     $scope.status = 'down';
		  });
	}

	
	  /*$scope.graph.data = [
	    //Awake
	    [16, 15, 20, 12, 16, 12, 8]
	  ];
	  $scope.graph.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];*/
	  //$scope.graph.series = ['CPUUtilization'];

	
})
 