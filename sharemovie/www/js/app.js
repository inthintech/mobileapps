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
        .state('test', {
                url: '/test',
                templateUrl: 'templates/test.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            })
            .state('tabs', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html',
                controller: 'tabController'
              })
            
             .state('gtabs', {
                url: '/gtab',
                abstract: true,
                templateUrl: 'templates/gtabs.html',
                controller: 'gtabController'
              })
             
             .state('gtabs.member', {
                url: '/member/:gId/:gName',
                views: {
                  'member-tab' : {
                    templateUrl: 'templates/member.html',
                    controller: 'MemberController'
                  }
                }
              })
             
             .state('gtabs.movie', {
                url: '/movie/:gId/:gName',
                views: {
                  'movie-tab' : {
                    templateUrl: 'templates/movie.html',
                    controller: 'MovieController'
                  }
                }
              })
             
             .state('gtabs.addmovie', {
                url: '/movie/addmovie/:gId',
                views: {
                  'movie-tab' : {
                    templateUrl: 'templates/addmovie.html',
                    controller: 'AddMovieController'
                  }
                }
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
            
            .state('tabs.addgroup', {
                url: '/group/addgroup/',
                views: {
                  'group-tab' : {
                    templateUrl: 'templates/addgroup.html',
                    controller: 'GroupController'
                  }
                }
              })
            
            .state('tabs.profile', {
                url: '/profile',
                views: {
                  'profile-tab' : {
                    templateUrl: 'templates/profile.html',
                    controller: 'ProfileController'
                  }
                }
              });
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
        $http.get("http://api.keyrelations.in/sharemovie/login/"+success.authResponse.accessToken)
              .then(function(result) {
                
                if (result.data.hasOwnProperty('success')) {
                  $scope.hide($ionicLoading);
                  //console.log(result.data.success);
                  $localStorage.userId = result.data.success;
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
  
 // console.log("test");
 
 
 //window.location.reload(true);

  $scope.getGroupData = function() {
    
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
        
        $scope.show($ionicLoading);
          $http.get("http://api.keyrelations.in/sharemovie/getmygroups/"+$localStorage.userId)
              .then(function(result) {
                
                  $scope.grpData = result.data.output;
                  $scope.hide($ionicLoading);                 
                
            }, function(error) {
                //console.log(error);
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
  if($localStorage.hasOwnProperty("accessToken") === false)
  {
     $state.go("login");
  }
  */
  
  $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    };

  $scope.hide = function(){
        $ionicLoading.hide();
  };
  
  
  $scope.gotoGroup = function() {
    
    $state.go("tabs.group");
    
  };
  
  $scope.gotoAddGroup = function() {
    
    $state.go("tabs.addgroup");
    
  };
  
  
  $scope.grpName ='';
  
  $scope.addGroup = function() {
    
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
    
          var reg = /[^A-Za-z0-9 ]/;
    
          if ($scope.grpName=='') {
            $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Please enter a group name!'
                });
            return false;
          }
          
          if (reg.test($scope.grpName)) {
            $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Invalid input!'
                });
            return false;
          }
          
          $scope.show($ionicLoading);
          $http.get("http://api.keyrelations.in/sharemovie/creategroup/"+$localStorage.userId+"/"+$scope.grpName)
              .then(function(result) {
                
                if (result.data.hasOwnProperty('success')) {

                    $scope.hide($ionicLoading);
                    var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Group created successfully'
                    });
                    alertPopup.then(function(res) {
                    $state.go("tabs.group");
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
    };

  
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("tabController", function($scope,$state) {
  
 $scope.gotoAddGroup = function() {
    
    $state.go("tabs.addgroup");
    
  };
  
  
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("gtabController", function($scope,$state) {
  
  $scope.groupId=$state.params.gId;
  $scope.groupName=$state.params.gName;
  
   $scope.gotoGroup = function() {
    
    $state.go("tabs.group");
    
  };
  
  
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("ProfileController", function($ionicPlatform,$localStorage,$scope,$state,$ionicPopup,$http,$ionicLoading) {
  

  
  
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("MemberController", function($ionicPlatform,$localStorage,$scope,$state,$ionicPopup,$http,$ionicLoading) {

  
  $scope.groupId=$state.params.gId;
  $scope.groupName=$state.params.gName;
  

})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("AddMovieController", function($ionicPlatform,$localStorage,$scope,$state,$ionicPopup,$http,$ionicLoading) {

  
  $scope.groupId=$state.params.gId;
  //$scope.groupName=$state.params.gName;
  
  $scope.limit = 100;
  
  $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    };
    
  $scope.expand = function() {
 
    };

  $scope.hide = function(){
        $ionicLoading.hide();
  };
  $scope.hideAdd = true;
  $scope.hideResult = true;
  
  $scope.movName ='';
  
  $scope.addMov = function(id) {
        
        $scope.show($ionicLoading);
        
        $http.get("http://api.keyrelations.in/v1/collections/addmovie/"+$localStorage.fbid+"/"+document.getElementById("m"+id).value+"/"+document.getElementById("t"+id).value+"/"+document.getElementById("r"+id).value+"/"+document.getElementById(id).value)
              .then(function(result) {
                
                if (!result.data.hasOwnProperty('error')) {
                  $scope.hide($ionicLoading);
                    $ionicPopup.alert({
                    title: 'Alert',
                    template: result.data.success
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
    };
  
  $scope.searchMov = function() {
    
          var reg = /[^A-Za-z0-9 ]/;
    
          if ($scope.movName=='') {
            $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Please enter a movie name!'
                });
            return false;
          }
          
          if (reg.test($scope.movName)) {
            $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Invalid input!'
                });
            return false;
          }
          
          $scope.show($ionicLoading);
          $http.get("http://api.keyrelations.in/sharemovie/getmovielist/"+$scope.movName)
              .then(function(result) {
                
                if (!result.data.hasOwnProperty('error')) {
                  
                  //$location.path("/tab/home");
                  $scope.movieData = result.data.output;
                  $scope.hideResult = false;
                  $scope.hide($ionicLoading);
                  if ($scope.movieData[0]==undefined) {
                    $ionicPopup.alert({
                    title: 'Alert',
                    template: 'No matches found.'
                  });
                  }
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
  

})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("MovieController", function($ionicPlatform,$localStorage,$scope,$state,$ionicPopup,$http,$ionicLoading) {

 
  
  $scope.groupId=$state.params.gId;
  $scope.groupName=$state.params.gName;
  
  $scope.gotoAddMovie = function() {
    
    $state.go("gtabs.addmovie",{gId:$scope.groupId});
    
  };
  
  

});
