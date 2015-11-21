// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html',
                controller: 'MainController'
              })
            .state('images', {
                url: '/images',
                templateUrl: 'templates/images.html',
                controller: 'MainController'
              });
        $urlRouterProvider.otherwise('/home');
    })

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("MainController", function($scope,$state,$cordovaImagePicker) {
  
  $scope.getStarted = function (){
    
    $state.go("images");
    
  };
  
  $scope.currentImage ="img/ionic.png";
  
  
  $scope.getImage = function (){
    
            var options = {
              maximumImagesCount: 1,
              width: 500,
              height: 300,
              quality: 100
            };
  
  $cordovaImagePicker.getPictures(options)
    .then(function (results) {
      for (var i = 0; i < results.length; i++) {
        //console.log('Image URI: ' + results[i]);
        $scope.currentImage = results[i];
      }
    }, function(error) {
      // error getting photos
    });
    
  };
  
  
 
    
});