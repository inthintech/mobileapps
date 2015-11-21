// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova', 'ngStorage'])

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
    
    // Lock Screen Orientation
    screen.lockOrientation('portrait');
    
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
                templateUrl: 'templates/tabs.html',
                
              })
            
            .state('game', {
                url: '/game',
                abstract: true,
                templateUrl: 'templates/game.html',
                
              })
              
              .state('tabs.profile', {
                url: '/profile',
                views: {
                  'profile-tab' : {
                    templateUrl: 'templates/profile.html',
                    controller: 'MainController'
                  }
                }
              })
                        
               .state('tabs.cteam', {
                url: '/cteam',
                views: {
                  'profile-tab' : {
                    templateUrl: 'templates/cteam.html',
                    controller: 'MainController'
                  }
                }
              })
              
              .state('tabs.play', {
                url: '/play',
                views: {
                  'play-tab' : {
                    templateUrl: 'templates/play.html',
                    controller: 'MainController'
                  }
                }
              })
              
              .state('game.info', {
                url: '/info',
                views: {
                  'info-tab' : {
                    templateUrl: 'templates/info.html',
                    controller: 'GameController'
                  }
                }
              })
              
              .state('game.progress', {
                url: '/progress',
                views: {
                  'progress-tab' : {
                    templateUrl: 'templates/progress.html',
                    controller: 'GameController'
                  }
                }
              })
              
              .state('game.bowl', {
                url: '/bowl',
                views: {
                  'bowl-tab' : {
                    templateUrl: 'templates/bowl.html',
                    controller: 'GameController'
                  }
                }
              })
              
              .state('game.bat', {
                url: '/bat',
                views: {
                  'bat-tab' : {
                    templateUrl: 'templates/bat.html',
                    controller: 'GameController'
                  }
                }
              });
              
        $urlRouterProvider.otherwise('/login');
    })

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("LoginController", function($ionicPlatform,$state,$scope, $cordovaOauth, $localStorage, $location,$ionicPopup,$http,$ionicLoading,$cordovaNetwork) {
  
  
    
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
  
  //check if access token is available in device
  
   if($localStorage.hasOwnProperty("accessToken") === true)
            {
              //$location.path("/tab/profile");
              $state.go("tabs.profile");
            }
  
  $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    };

  $scope.hide = function(){
        $ionicLoading.hide();
  };
  
  $scope.login = function() {
                    
          $cordovaOauth.facebook("132324913778608",["public_profile","user_friends"])
          
          .then(function(result) {
              $localStorage.accessToken = result.access_token;
              //console.log($localStorage.accessToken);
              $scope.show($ionicLoading);
              $http.get("http://api.keyrelations.in/v1/captaincool/validateuser/"+result.access_token)
              .then(function(result) {            
                if (result.data.hasOwnProperty('success')) {
                  $localStorage.fbid = result.data.success;
                  $scope.hide($ionicLoading);
                  $location.path("/tab/profile");
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
                return false;
            });          
              
          }, function(error) {
              $scope.hide($ionicLoading);
              $ionicPopup.alert({
                title: 'Alert',
                template: 'Unable to reach facebook server!'
              });
              return false;  
          });
          
 
    };
  
    
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("MainController", function($ionicPlatform,$scope,$ionicPopup,$http,$state,$location,$ionicLoading,$localStorage,$cordovaNetwork) {
  
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
  
  $scope.stateChanged = function (status) {
   if(status){ //If it is checked
       $scope.selectedCount++;
   }
   else{
      if ($scope.selectedCount>0) {
        $scope.selectedCount--;
      }
      
   }  
  };
  
   $scope.updateTeam = function () {
      if ($scope.selectedCount!=11) {
       $ionicPopup.alert({
          title: "Alert",
          content: "Please select 11 players."
        })
      }
      else{
        var checkboxes = document.getElementsByClassName('pselect');
        var selectedPlayers = '';
        // loop over them all
        for (var i=0; i<checkboxes.length; i++) {
           // And stick the checked ones onto an array...
           if (checkboxes[i].checked) {
              if (selectedPlayers=='') {
                selectedPlayers = selectedPlayers + checkboxes[i].id;
              }
              else {
                selectedPlayers = selectedPlayers + '/' + checkboxes[i].id;
              }
              
           }
        }
        //alert(selectedPlayers);
        $scope.show($ionicLoading);
            $http.get("http://api.keyrelations.in/v1/captaincool/updateteam/"+$localStorage.fbid+"/"+selectedPlayers)
              .then(function(result) {
                
                if (!result.data.hasOwnProperty('error')) {
                  //$scope.statsData = result.data.output;
                  $scope.hide($ionicLoading);
                   $ionicPopup.alert({
                        title: "Alert",
                        content: "Team updated successfully."
                    })
                    .then(function(result) {
                        //$state.go("tabs.profile");
                        window.location.reload(true);
                    });
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
  
  $scope.selectedCount = 0;
  
    $scope.refreshView = function() {
      window.location.reload(true);
      //$state.go($state.current, {}, {reload: true});
    };
  
  $scope.changeTeam = function() {
    
    //$location.path("/tab/cteam/");
    $state.go("tabs.cteam");
    
  };
  
  $scope.myTeam = function() {
    
    //$location.path("/tab/team/");
    $state.go("tabs.profile");
    
  };
  
  $scope.startGameCPU = function() {
    
    //$location.path("/tab/team/");
    $state.go("game.bat");
    
  };
  
   $scope.getProfile = function() {
            
            if($localStorage.hasOwnProperty("accessToken") === false)
            {
              $state.go("login");
              return false;
            }
            $scope.show($ionicLoading);
            $http.get("https://graph.facebook.com/v2.4/me", { params:
                      { access_token: $localStorage.accessToken,
                      fields: "name,picture",
                      format: "json" }})
            
            .then(function(result) {
                
                if (result.data.hasOwnProperty('error'))
                {
                if (result.data.error.code==190) {
                    $ionicPopup.alert({
                          title: "Alert",
                          content: "Token expired. Please login!"
                      })
                      .then(function(result) {
                          $location.path("/login");
                      });
                    
                    return false;
                  }
                }
                $scope.profileData = result.data;
                //$scope.hide($ionicLoading);
            }, function(error) {
               $scope.hide($ionicLoading);
                $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Unable to reach Facebook Server!'
                });
                //console.log(error);
            });
            
            
            //$scope.show($ionicLoading);
            $http.get("http://api.keyrelations.in/v1/captaincool/getmystats/"+$localStorage.fbid)
              .then(function(result) {
                
                if (!result.data.hasOwnProperty('error')) {
                  $scope.statsData = result.data.output;
                  //$scope.hide($ionicLoading);
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
              
             //$scope.show($ionicLoading);
              $http.get("http://api.keyrelations.in/v1/captaincool/getmyteam/"+$localStorage.fbid)
              .then(function(result) {
                
                if (!result.data.hasOwnProperty('error')) {
                  $scope.teamData = result.data.output;
                  $scope.hide($ionicLoading);
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
              
            
    };
    
  $scope.getMyTeam = function() {
            
            
            $scope.show($ionicLoading);
            $http.get("http://api.keyrelations.in/v1/captaincool/getmyteam/"+$localStorage.fbid)
              .then(function(result) {
                
                if (!result.data.hasOwnProperty('error')) {
                  $scope.teamData = result.data.output;
                  $scope.hide($ionicLoading);
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
              
    };
  
  
  $scope.getPlayers = function() {
            
            
            $scope.show($ionicLoading);  
            $http.get("http://api.keyrelations.in/v1/captaincool/getplayers/"+$localStorage.fbid)
              .then(function(result) {
                
                if (!result.data.hasOwnProperty('error')) {
                  $scope.playerData = result.data.output;
                  $scope.hide($ionicLoading);
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
            
    };
  
  
  /*
  $scope.getPlayers = function() {
            
            $scope.show($ionicLoading);
            $http.get("https://graph.facebook.com/v2.4/me/taggable_friends", { params:
                      { access_token: $localStorage.accessToken,
                      limit: "500",
                      format: "json" }})
            
            .then(function(result) {
                
                if (result.data.hasOwnProperty('error'))
                {
                if (result.data.error.code==190) {
                    $ionicPopup.alert({
                          title: "Alert",
                          content: "Token expired. Please login!"
                      })
                      .then(function(result) {
                          $location.path("/login");
                      });
                    
                    return false;
                  }
                }
                $scope.playerData = result.data.data;
                //alert($scope.playerData.length);
                $scope.hide($ionicLoading);
                if ($scope.playerData.length<10) {
                  $ionicPopup.alert({
                          title: "Alert",
                          content: "Sorry! You need atleast 10 friends to play."
                      })
                      .then(function(result) {
                          $state.go("tabs.profile");
                      });
                    
                    return false;
                }
            }, function(error) {
               $scope.hide($ionicLoading);
                $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Unable to reach Facebook Server!'
                });
                //console.log(error);
            });
            
  };*/
    
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("GameController", function($ionicPlatform,$scope,$ionicPopup,$http,$state,$location,$ionicLoading,$localStorage,$cordovaNetwork) {
  
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
  
  //console.log('Hi');
  
}); 