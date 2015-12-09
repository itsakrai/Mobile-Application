angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.factory('API', ['$http', function($http) { 
  var _base = "http://ec2-52-91-28-92.compute-1.amazonaws.com:3000";
  //var _base = 'http://localhost:3000';
  var _api = { 
    login: function(user) {
      return $http.post(_base + '/api/auth/login', user);
    },
    signup: function(user) {
      return $http.post(_base + '/api/auth/signup', user);
    },
    editInfo: function(user) {
      return $http.post(_base + '/api/auth/editinfo', user);
    },
    getAlerts: function(projetid) {
      return $http.get(_base + '/api/data/getAlerts/' + projetid);
    },
    saveAlerts: function(alerts) {
      return $http.post(_base + '/api/data/saveAlerts', alerts);
    }, 
    getAllProjects: function() {
      return $http.get(_base + '/api/projects/all');
    },
    addProject: function(project) {
      return $http.post(_base + '/api/projects/add',project);
    },
    removeProject: function(project) {
      return $http.post(_base + '/api/projects/remove',project);
    },
    getCPUMetrics: function() {
      return $http.get(_base + '/api/metrics/cpuutilization');
    },
    getNetworkInMetrics: function() {
      return $http.get(_base + '/api/metrics/networkin');
    },
    getNetworkOutMetrics: function() {
      return $http.get(_base + '/api/metrics/networkout');
    }
  };
 
  return _api;
}])

.service('BlankService', [function(){

}]);

