// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova', 'ngStorage','ionic-ratings','ionicLazyLoad'])

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
    
  });
})

.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            })
            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html',
                controller: 'MainController'
            })
            .state('info', {
                url: '/info/:mId',
                templateUrl: 'templates/info.html',
                controller: 'InfoController'
            })
            .state('add', {
                url: '/add',
                templateUrl: 'templates/add.html',
                controller: 'AddController'
            })
            .state('view', {
                url: '/view/:mId',
                templateUrl: 'templates/view.html',
                controller: 'ViewController'
              })
            .state('test', {
                url: '/test',
                templateUrl: 'templates/test.html',
                controller: 'TestController'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'templates/settings.html',
                controller: 'SettingsController'
            });
        $urlRouterProvider.otherwise('/home');
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("TestController", function($scope,$ionicPopup,$http,$location) {
  
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("LoginController", function($scope, $cordovaOauth, $localStorage, $location,$ionicPopup,$http,$ionicLoading,$cordovaNetwork) {
  
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
              $scope.show($ionicLoading);
              $http.get("http://api.keyrelations.in/v1/collections/validateuser/"+result.access_token)
              .then(function(result) {            
                if (result.data.hasOwnProperty('success')) {
                  $scope.hide($ionicLoading);
                  $location.path("/home");
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

.controller("MainController", function($scope,$ionicPopup,$http,$location,$localStorage,$ionicLoading,$state) {
  
 $scope.ratingsObjectStatic = {
        readOnly: true,
        iconOnColor: 'rgb(255, 185, 15)',  //Optional
        iconOffColor:  'rgb(211, 211, 211)',    //Optional
        callback: function(rating,ratingsObjId) {    //Mandatory
          //$scope.ratingsCallback(rating,ratingsObjId);
        }
      };
      
  $scope.refreshView = function() {
      window.location.reload(true);
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
      $location.path("/info/"+movId);    
    };
    
    $scope.gotoOptions = function() {  
      $location.path("/settings");    
    };
    
  $scope.viewersList = function(movId) {
      $location.path("/view/"+movId);
  };
    
  $scope.add = function() {  
          $location.path("/add");
    };
  
  $scope.moviesOrder = 'rating';
  $scope.queryRes = {};
  $scope.filterFlag = 0;
  $scope.searchFlag = 0;
    
  $scope.sortByTime = function() {
    $scope.moviesOrder = 'timestamp';
    document.getElementById("sortTime").className = "icon ion-android-time highlight";
    document.getElementById("sortRating").className = "icon ion-android-star nohighlight";
    $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Sorted by Recently added in top!'
                });
  }
  
  $scope.sortByRating = function() {
    $scope.moviesOrder = 'rating';
    document.getElementById("sortTime").className = "icon ion-android-time nohighlight";
    document.getElementById("sortRating").className = "icon ion-android-star highlight";
    $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Sorted by Highest Rated in top!'
                });
  }
  
  $scope.setFilter = function(flag) {
    if (flag==0) {
      document.getElementById("searchFilter").className = "icon ion-search nohighlight";
      document.getElementById("setFilter").className = "icon ion-funnel highlight";
      $scope.filterFlag = 1;
      $scope.queryRes = {status:1};
      $ionicPopup.alert({
        title: 'Alert',
        template: 'Filter applied to see remove your friend\'s movies!'
      });
    }
    else{
      document.getElementById("searchFilter").className = "icon ion-search nohighlight";
      document.getElementById("setFilter").className = "icon ion-funnel nohighlight";
      $scope.filterFlag = 0;
      $scope.queryRes = {};
      $ionicPopup.alert({
        title: 'Alert',
        template: 'Filter removed to see all movies!'
      });  
    }
  }
  
  $scope.searchFilter = function(flag) {
    if (flag==0) {
      document.getElementById("searchFilter").className = "icon ion-search highlight";
      document.getElementById("setFilter").className = "icon ion-funnel nohighlight";
      $scope.searchFlag = 1;
      $scope.queryRes = {status:0};
      $ionicPopup.alert({
        title: 'Alert',
        template: 'Filter applied to see unseen movies!'
      });
    }
    else{
      document.getElementById("searchFilter").className = "icon ion-search nohighlight";
      document.getElementById("setFilter").className = "icon ion-funnel nohighlight";
      $scope.searchFlag = 0;
      $scope.queryRes = {};
      $ionicPopup.alert({
        title: 'Alert',
        template: 'Filter removed to see all movies!'
      });  
    }
  }
  
  $scope.getProfile = function() {
            if($localStorage.hasOwnProperty("accessToken") === false)
            {
              $location.path("/login");
              return false;
            }
            $http.get("https://graph.facebook.com/v2.4/me", { params:
                      { access_token: $localStorage.accessToken,
                      fields: "name,id,picture",
                      format: "json" }})
            
            .then(function(result) {
                
                if (result.data.hasOwnProperty('error'))
                {
                if (result.data.error.code==190) {
                    $location.path("/login");
                    return false;
                  }
                }
                $localStorage.fbid = result.data.id;
                $scope.getLibrary();               
                
            }, function(error) {
                $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Unable to reach Facebook Server!'
                });
                console.log(error);
            });
    };
    
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
                console.log(error);
                $scope.hide($ionicLoading);
                $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Unable to reach app server!'
                });
                //console.log(error);
                return false;
            });
              
    };
    
    $scope.movDelete = function(movId) {
      
      var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Remove movie from your library?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          $scope.show($ionicLoading);
          
          $http.get("http://api.keyrelations.in/v1/collections/removemovie/"+$localStorage.fbid+"/"+movId)
              .then(function(result) {
                
                if (!result.data.hasOwnProperty('error')) {
                  
                  $scope.hide($ionicLoading);
                    var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: result.data.success
                  });
                  alertPopup.then(function(res) {
                    window.location.reload(true);
                    //console.log('Thank you for not eating my delicious ice cream cone');
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
          
         //console.log('You are sure');
        } else {
         //console.log('You are not sure');
        }
      });
      
    };
    
  
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("SettingsController", function($scope,$ionicPopup,$http,$location,$ionicHistory,$localStorage) {
  
  $scope.back = function() {
    $ionicHistory.goBack();
  }
  


$scope.logout = function() {
          //delete $localStorage.accessToken;
          //delete $localStorage.fbid;
          $localStorage.$reset();
          $location.path("/login");
    };
    
     $scope.getProfile = function() {
            
            if($localStorage.hasOwnProperty("accessToken") === false)
            {
              $location.path("/login");
              return false;
            }
            $http.get("https://graph.facebook.com/v2.4/me", { params:
                      { access_token: $localStorage.accessToken,
                      fields: "name,id,picture",
                      format: "json" }})
            
            .then(function(result) {
                
                if (result.data.hasOwnProperty('error'))
                {
                if (result.data.error.code==190) {
                    $location.path("/login");
                    return false;
                  }
                }
                $scope.profileData = result.data;
                $localStorage.fbid = result.data.id;
            }, function(error) {
                $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Unable to reach Facebook Server!'
                });
                //console.log(error);
            });
    };

})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("AddController", function($scope, $localStorage, $location,$ionicPopup,$http,$ionicLoading,$ionicHistory) {
  
  $scope.back = function() {
    $ionicHistory.goBack();
  }
  
    $scope.limit = 100;
  
  $scope.ratingsObject = {
        /*iconOn: 'ion-ios-star',    //Optional
        iconOff: 'ion-ios-star-outline',   //Optional
        iconOnColor: 'rgb(200, 200, 100)',  //Optional
        iconOffColor:  'rgb(200, 100, 100)',    //Optional
        rating:  2, //Optional
        minRating:1,    //Optional
        readOnly: true, //Optional*/
        rating:  0, //Optional
        iconOnColor: 'rgb(255, 185, 15)',  //Optional
        iconOffColor:  'rgb(211, 211, 211)',    //Optional
        callback: function(rating,ratingsObjId) {    //Mandatory
          $scope.ratingsCallback(rating,ratingsObjId);
        }
      };

      $scope.ratingsCallback = function(rating,ratingsObjId) {
        //console.log(rating);
        document.getElementById(ratingsObjId).value=rating;
      };

  
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
          $http.get("http://api.keyrelations.in/v1/collections/getmovielist/"+$scope.movName)
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
                console.log(error);
                return false;
            });    
    };
    
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("ViewController", function($scope,$ionicPopup,$http,$location,$state,$ionicLoading,$localStorage,$ionicHistory) {
  
     $scope.movId=$state.params.mId;
     
     ////////AD///////////////////////////////////////////
     
     /*
     $scope.startSession = function(successCallback, errorCallback) {
    	cordova.exec(successCallback, errorCallback, "RevMobPlugin", "startSession", ['55fe8659b2a347167d4d8bc2']);
  	}
    
 
      
      $scope.startSession(function(){
        
        $ionicPopup.alert({
        title: 'Alert',
        template: 'Revmob Started'
      });
      
      }, function(error){
        console.log(error);
        $ionicPopup.alert({
        title: 'Alert',
        template: 'Revmob Error'
      });
      
      }
      );*/
     
      
      
      
     
    ////////AD////////////////////////////////////////////
    

     
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
                  
                  
                  cordova.exec(function(){   
                    console.log('SessionStarted');
                    
                    //TEST_DISABLED = 0;
                    //TEST_WITH_ADS = 1;
                    //TEST_WITHOUT_ADS = 2;
                    
                    console.log('Setting Testing Mode');
                    cordova.exec(null, null, "RevMobPlugin", "setTestingMode", [1]);
                    console.log('Trying for full screen ad');    
                    cordova.exec(function(){console.log('ShowingFullScreenAd');},function(){console.log('ShowingFullScreenAdError');}, "RevMobPlugin", "showFullscreen", []); 
                  }
                  ,function(error){        
                      console.log(error);       
                  }, "RevMobPlugin", "startSession", ['55fe8659b2a347167d4d8bc2']);
                 
                  
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
  
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("InfoController", function($scope,$state,$location,$ionicLoading,$http,$ionicPopup,$ionicHistory) {
  
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
    
  
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////