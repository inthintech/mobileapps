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

        .state('groups', {
              url: '/groups',
              templateUrl: 'templates/groups.html'
          });
        $urlRouterProvider.otherwise('/groups');
        
    })

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("MainController", function($ionicPlatform,$localStorage,$scope,$cordovaFacebook,$state,$ionicPopup,$http,$ionicLoading) {
  
  $scope.userName = '';
  $scope.userPic = '';
   
  if($localStorage.hasOwnProperty("isLoggedIn") === false)
  {
     $state.go("login");
  }
  
  $scope.getUserInfo = function() {
  
   if($localStorage.hasOwnProperty("isLoggedIn") === true)
  {
     //$state.go("login");
     if ($localStorage.isLoggedIn==1) {
        $scope.userName = $localStorage.name;
        $scope.userPic = 'https://graph.facebook.com/v2.5/'+$localStorage.id+'/picture?&type=normal';
     }
     else{
        $scope.userName = 'Guest';
        $scope.userPic = 'img/default.jpg';
     }
  }
  
  };
   
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
                    else
                    {
                        /* ---------------------Start of API Call------------------------- */
                        
                        $cordovaFacebook.login(["public_profile","user_friends"]).then(
                        
                        function(success) {
                          
                          //console.log(success.authResponse.accessToken);
                          $state.go("home");
                          //console.log('Logged In');
                          
                          $localStorage.accessToken = success.authResponse.accessToken;
                          $scope.show($ionicLoading);
                          $http.get("http://api.keyrelations.in/sharemovie/login/"+success.authResponse.accessToken)
                                .then(function(result) {
                                  
                                  if (!result.data.hasOwnProperty('error')) {
                                    $scope.hide($ionicLoading);
                                    //console.log(result.data.success);
                                    $localStorage.id = result.data.fbid;
                                    $localStorage.name = result.data.name;
                                    $localStorage.image = result.data.image;
                                    $localStorage.isLoggedIn = 1;
                                    //$state.go("tabs.group");
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
                          
                          
                        },
                        
                        function (error) {
                          
                            $ionicPopup.alert({
                                      title: 'Error',
                                      template: 'Unable to reach facebook servers!'
                            });
                        
                          });
                       /* ---------------------End of API Call------------------------- */
                    }
                    
                   /* ---------------------End of Connection Check------------------------- */ 
                }
                
           /* ---------------------End of Sub Function------------------------- */   
      });
    
       /* ---------------------End of Main Function------------------------- */
    }
 
  
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////