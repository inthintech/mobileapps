// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova', 'ngStorage','ionicLazyLoad'])

.run(function($ionicPlatform,$ionicPopup) {
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
    //console.log('OnDeviceReadyStart');
    cordova.exec(null,null,'AirpushPlugin','setAppId',287274);
    cordova.exec(null,null,'AirpushPlugin','setApiKey','1442904318238682649');
    //console.log('OnDeviceReadyEnd');
    
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
            
            .state('tabs.suggest', {
                url: '/suggest',
                views: {
                  'suggest-tab' : {
                    templateUrl: 'templates/suggest.html',
                    controller: 'SuggestController'
                  }
                }
              })
          
              .state('tabs.drive', {
                url: '/drive',
                views: {
                  'drive-tab' : {
                    templateUrl: 'templates/drive.html',
                    controller: 'DriveController'
                  }
                }
              })
              
              .state('tabs.movieinfo', {
                url: '/drive/movieinfo/:mId',
                views: {
                  'drive-tab' : {
                    templateUrl: 'templates/info.html',
                    controller: 'InfoController'
                  }
                }
              })
              
              .state('tabs.viewinfo', {
                url: '/drive/viewinfo/:mId',
                views: {
                  'drive-tab' : {
                    templateUrl: 'templates/view.html',
                    controller: 'ViewController'
                  }
                }
              })
              
              .state('tabs.settings', {
                url: '/settings',
                views: {
                  'settings-tab' : {
                    templateUrl: 'templates/settings.html',
                    controller: 'SettingsController'
                  }
                }
              });
        $urlRouterProvider.otherwise('/login');
    })

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.factory('MyService', function ($localStorage) {

    /*
    var data = {
        sortVal: '',filterVal:{}
    };

    return {
        getSortVal: function () {
            return data.sortVal;
        },
        setSortVal: function (value) {
            data.sortVal = value;
        },
        getFilterVal: function () {
            return data.filterVal;
        },
        setFilterVal: function (value) {
            data.filterVal = value;
        }
    };
    */
    
    var data = {};
    
    
    data.sortVal = '';
    data.filterVal = false;
    
    if($localStorage.hasOwnProperty("sortValue") === true)
    {
      data.sortVal = $localStorage.sortValue;
    }
    else
    {
      data.sortVal = 'count';
    }
    
    if($localStorage.hasOwnProperty("filterValue") === true)
    {
      data.filterVal = $localStorage.filterValue;
    }
    else
    {
      data.filterVal = false;
    }
    
    /*
    data.getSortVal=function () {
            return data.sortVal;
    };
    data.setSortVal=function (value) {
            data.sortVal = value;
    };
    data.getFilterVal=function () {
            return data.filterVal;
    };
    data.setFilterVal=function (value) {
            data.filterVal = value;
    };
    */
    
    return data;
    
})



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("LoginController", function($ionicPlatform,$scope, $cordovaOauth, $localStorage, $location,$ionicPopup,$http,$ionicLoading,$cordovaNetwork) {
    
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
              $location.path("/tab/suggest");
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
                    
          $cordovaOauth.facebook("939757979416996",["public_profile","user_friends"])
          
          .then(function(result) {
              $localStorage.accessToken = result.access_token;
              console.log($localStorage.accessToken);
              $scope.show($ionicLoading);
              $http.get("http://api.keyrelations.in/v1/collections/validateuser/"+result.access_token)
              .then(function(result) {            
                if (result.data.hasOwnProperty('success')) {
                  $localStorage.fbid = result.data.success;
                  $scope.hide($ionicLoading);
                  $location.path("/tab/suggest");
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

.controller("SuggestController", function($ionicPlatform,$scope, $localStorage, $location,$ionicPopup,$http,$state,$ionicLoading) {
  
   
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
   
  
  $scope.refreshView = function() {
      window.location.reload(true);
      //$state.go($state.current, {}, {reload: true});
    };
    
  
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
  
  $scope.movName ={};
  
  $scope.addMov = function(id) {
    
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Suggest this movie to your friends?'
        });
        
        confirmPopup.then(function(res) {
        if(res) {
          //console.log('You are sure');
          $scope.show($ionicLoading);
          //changing the default value of rating to 0 as we are not using it.
        $http.get("http://api.keyrelations.in/v1/collections/addmovie/"+$localStorage.fbid+"/"+document.getElementById("m"+id).value+"/"+document.getElementById("t"+id).value+"/"+document.getElementById("r"+id).value+"/0")
              .then(function(result) {
                
                if (!result.data.hasOwnProperty('error')) {
                  $scope.hide($ionicLoading);
                  if (result.data.success=='1') {
                    $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Movie suggested.'
                  });
                  }
                  else {
                    $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Movie already suggested.'
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
        } else {
         //console.log('You are not sure');
        }
      });
        
        
    };
  
  $scope.searchMov = function() {
    
          var reg = /[^A-Za-z0-9 ]/;
    
          if ($scope.movName.name=='') {
            $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Please enter a movie name!'
                });
            return false;
          }
          
          if (reg.test($scope.movName.name)) {
            $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Invalid input!'
                });
            return false;
          }
          
          $scope.show($ionicLoading);
          $http.get("http://api.keyrelations.in/v1/collections/getmovielist/"+$scope.movName.name)
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
                  else
                  {
                    //cordova.exec(null,null,'AirpushPlugin','airpushSmartWallAd','interstitial');
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
                console.log(error);
                return false;
            });    
    };
    
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("DriveController", function($ionicPlatform,$scope,MyService,$ionicPopup,$http,$location,$localStorage,$ionicLoading,$state) {
  
  
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
  
  //console.log('DriveCtrlStart');
  //cordova.exec(null,null,'AirpushPlugin','ShowBottom','');
  //console.log('DriveCtrlEnd');
  
  //cordova.exec(null,null,'AirpushPlugin','airpushSmartWallAd','interstitial');
  
  //cordova.exec(null,null,'AirpushPlugin','ShowTop','');
  
  //$scope.moviesOrder = MyService.sortVal;
  //$scope.queryRes = MyService.filterVal;
  
  cordova.exec(null,null,'AirpushPlugin','setPlacementId',0);
  cordova.exec(null,null,'AirpushPlugin','call360','');
  
  $scope.refreshView = function() {
      //window.location.reload(true);
      $state.go($state.current, {}, {reload: true});
    };
    
  $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    };
  
  $scope.hide = function(){
        $ionicLoading.hide();
  };
  
  $scope.getMovieInfo = function(movId) {  
      $location.path("/tab/drive/movieinfo/"+movId);    
    };
    
  $scope.viewersList = function(movId) {
      $location.path("/tab/drive/viewinfo/"+movId);
  };
    
  
  $scope.moviesOrder = MyService.sortVal;
  if (MyService.filterVal) {
    $scope.queryRes = {status:0}
  }
  else {
    $scope.queryRes = {}
  }
 
  
  //console.log($scope.moviesOrder);
  //console.log($scope.queryRes);
 
    $scope.getLibrary = function() {
        
        $scope.show($ionicLoading);
          $http.get("http://api.keyrelations.in/v1/collections/getsociallibrary/"+$localStorage.fbid+"/"+$localStorage.accessToken)
              .then(function(result) {
                
                if (!result.data.hasOwnProperty('error')) {
                  $scope.movieData = result.data.output;
                  $scope.hide($ionicLoading);
                  
                  if ($scope.movieData[0]==undefined) {
                    $ionicPopup.alert({
                    title: 'Alert',
                    template: 'No movies found.'
                  });
                  }
                }
                else
                {
                   if (result.data.error.code==190) {
                    $ionicPopup.alert({
                          title: "Alert",
                          content: "Token expied. Please login!"
                      })
                      .then(function(result) {
                          $location.path("/login");
                      });
                    
                    return false;
                  }
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

.controller("SettingsController", function($ionicPlatform,$scope,MyService,$ionicPopup,$http,$state,$location,$ionicLoading,$localStorage) {
  
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
  

  $scope.refreshView = function() {
      window.location.reload(true);
      //$state.go($state.current, {}, {reload: true});
    };
    
  
$scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    };
  
  $scope.hide = function(){
        $ionicLoading.hide();
  };
  
$scope.logout = function() {
          delete $localStorage.accessToken;
          delete $localStorage.fbid;
          $localStorage.$reset();
          $location.path("/login");
    };

  if($localStorage.hasOwnProperty("sortValue") === true)
  {
    $scope.sort = $localStorage.sortValue;
  }
  else
  {
    //default
    $scope.sort = 'count';
  }
  
  
  $scope.sortChange = function(value) {
    $localStorage.sortValue = value;
    MyService.sortVal = value;
    //MyService.setSortVal(value);
    //console.log(MyService.sortVal);
  }
  
  
  if($localStorage.hasOwnProperty("filterValue") === true)
  {
    $scope.filter = $localStorage.filterValue;
  }
  else
  {
    //default
    $scope.filter = false;
  }
  
  
  $scope.filterChange = function(value) {
      $localStorage.filterValue = value;
      MyService.filterVal = value;   
  }

    
     $scope.getProfile = function() {
            
            if($localStorage.hasOwnProperty("accessToken") === false)
            {
              $location.path("/login");
              return false;
            }
             $scope.show($ionicLoading);
            $http.get("https://graph.facebook.com/v2.4/me", { params:
                      { access_token: $localStorage.accessToken,
                      fields: "name,id,picture",
                      format: "json" }})
            
            .then(function(result) {
                
                if (result.data.hasOwnProperty('error'))
                {
                if (result.data.error.code==190) {
                    $ionicPopup.alert({
                          title: "Alert",
                          content: "Token expied. Please login!"
                      })
                      .then(function(result) {
                          $location.path("/login");
                      });
                    
                    return false;
                  }
                }
                $scope.profileData = result.data;
                 $scope.hide($ionicLoading);
            }, function(error) {
               $scope.hide($ionicLoading);
                $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Unable to reach Facebook Server!'
                });
                //console.log(error);
            });
    };

})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("InfoController", function($ionicPlatform,$scope,$state,$location,$ionicLoading,$http,$ionicPopup,$ionicHistory) {
  
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
  
  //cordova.exec(null,null,'AirpushPlugin','airpushSmartWallAd','interstitial');
  
  $scope.movId=$state.params.mId;
  
  $scope.back = function() {
    $ionicHistory.goBack();
  }
  
    $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    };
  
  $scope.hide = function(){
        $ionicLoading.hide();
  };
  
  $scope.getInfo = function() {
        
        $scope.show($ionicLoading);
          $http.get("http://api.keyrelations.in/v1/collections/getmovieinfo/"+$scope.movId)
              .then(function(result) {
                
                if (!result.data.hasOwnProperty('error'))
                {
                  $scope.hide($ionicLoading);
                  $scope.infoData = result.data.output;
                  if ($scope.infoData[0]==undefined) {
                    $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Info not available!'
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
                console.log(error);
                return false;
            });
              
    };
    
  
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("ViewController", function($ionicPlatform,$scope,$ionicPopup,$http,$location,$state,$ionicLoading,$localStorage,$ionicHistory) {
  
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
    
    cordova.exec(null,null,'AirpushPlugin','airpushSmartWallAd','smartwall');
  
     $scope.movId=$state.params.mId;
 
    $scope.back = function() {
      $ionicHistory.goBack();
    }
  
       $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    };
    
    $scope.hide = function(){
      $ionicLoading.hide();
    };
    
    $scope.getViewers = function() {
        
        $scope.show($ionicLoading);
          $http.get("http://api.keyrelations.in/v1/collections/getviewlist/"+$localStorage.fbid+"/"+$scope.movId+"/"+$localStorage.accessToken)
              .then(function(result) {
                
                if (!result.data.hasOwnProperty('error')) {
                  
                  //$location.path("/tab/home");
                  $scope.socialData = result.data.output;
                  $scope.hide($ionicLoading);
                 }
                else
                {
                  if (result.data.error.code==190) {
                    $location.path("/login");
                    return false;
                  }
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
                console.log(error);
                return false;
            });
              
    };
  
});
