// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'ngStorage'])

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

.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('top'); // other values: top

}])


.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            })
            .state('tabs', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
              })
            
            .state('tabs.group', {
                url: '/group',
                views: {
                  'group-tab' : {
                    templateUrl: 'templates/group.html',
                    controller: 'GroupController'
                  }
                }
              })
;
        $urlRouterProvider.otherwise('/tab/group');
        
    })

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("LoginController", function($ionicPlatform,$localStorage,$scope,$cordovaFacebook,$state,$ionicPopup,$http,$ionicLoading) {
  
   $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    };

  $scope.hide = function(){
        $ionicLoading.hide();
  };
    
  $scope.login = function() {
    
    /*----- QUIT app if no internet connectivity is found------- */
    
    $ionicPlatform.ready(function() {
        if(window.Connection) {
                    if(navigator.connection.type == Connection.NONE) {
                        $ionicPopup.alert({
                            title: "Internet Disconnected",
                            content: "The internet is disconnected on your device."
                        })
                        .then(function(result) {
                            ionic.Platform.exitApp();
                        });
                    }
                }
    });
    
    /* ------------------------------------------------------------- */
    
    $cordovaFacebook.login(["public_profile","user_friends"])
      .then(function(success) {
        
        //console.log(success.authResponse.accessToken);
        //$state.go("tabs.group");
        //console.log('Logged In');
        
        $localStorage.accessToken = success.authResponse.accessToken;
        $scope.show($ionicLoading);
        $http.get("http://api.keyrelations.in/index.php/sharemovie/login/"+result.access_token)
              .then(function(result) {
                
                if (result.data.hasOwnProperty('success')) {
                  $scope.hide($ionicLoading);
                  $state.go("tabs.group");
                }
                else
                {
                  $scope.hide($ionicLoading);
                  $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Bad response from server!'
                  });
                  return false;
                }
                
            }, function(error) {
                $scope.hide($ionicLoading);
                $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Unable to reach app server!'
                });
                //console.log(error);
                return false;
            });    
        
        
      }, function (error) {
        
          $ionicPopup.alert({
                    title: 'Error',
                    template: 'Unable to reach facebook servers!'
          });
      
        });
    
    
  }
  
  
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("GroupController", function($ionicPlatform,$localStorage,$scope,$state,$ionicPopup,$http,$ionicLoading) {
  
  if($localStorage.hasOwnProperty("accessToken") === false)
  {
     $state.go("login");
  }
  
  
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
