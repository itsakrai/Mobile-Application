angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider       
    .state('page', {
      url: '/welcome',
      templateUrl: 'templates/welcome.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
    .state('logout', {
      url: '/logout',     
      templateUrl: 'templates/logout.html',
      controller: 'logoutCtrl'      
    })
    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'registerCtrl'
    })
    .state('devops-Home', {
      url: '/devops',
      abstract:true,
      templateUrl: 'templates/devops-Home.html'
    })  
    .state('devops-Home.editInfo', {
      url: '/editinfo',
      views: {
        'tab2': {
          templateUrl: 'templates/editInfo.html',
          controller: 'editInfoCtrl'
        }
      }
    })   
    .state('devops-Home.projects', {
      url: '/projects',
      views: {
        'tab4': {
          templateUrl: 'templates/projects.html',
          controller: 'projectsCtrl'
        }
      }
    })      
    .state('devops-Home.projectAlerts', {
      url: '/viewalerts',
      views : {
        'tab4':{
           url: '/viewalerts',
          templateUrl: 'templates/projectAlerts.html',
          controller: 'projectAlertsCtrl'
        }       
      }      
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');
});