// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic' , 'ngCordova', 'ngStorage','ionic-ratings','ionicLazyLoad'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    
    /*
    admob.initAdmob("ca-app-pub-7237311773771454/6957007529","ca-app-pub-7237311773771454/8896242321");//admob id format ca-app-pub-xxxxxxxxxxxxxxxxxxx/xxxxxxxxxx
    
    var admobParam=new  admob.Params();
        //admobParam.extra={'keyword':"admob phonegame"};
        //admobParam.isForChild=true;
        admobParam.isTesting=true;
        admob.showBanner(admob.BannerSize.BANNER,admob.Position.BOTTOM_CENTER,admobParam);
    */
        
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
                templateUrl: 'templates/tabs.html'
              })
            
            .state('tabs.home', {
                url: '/home',
                views: {
                  'home-tab' : {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeController'
                  }
                }
              })
          
              .state('tabs.mycollections', {
                url: '/mycollections',
                views: {
                  'mycollections-tab' : {
                    templateUrl: 'templates/mycollections.html',
                    controller: 'MycollectionController'
                  }
                }
              })
              
              .state('tabs.movieinfo', {
                url: '/mycollections/movieinfo/:mId',
                views: {
                  'mycollections-tab' : {
                    templateUrl: 'templates/movieinfo.html',
                    controller: 'InfoController'
                  }
                }
              })
              
              .state('tabs.movieinfosocial', {
                url: '/socicollections/movieinfo/:mId',
                views: {
                  'socicollections-tab' : {
                    templateUrl: 'templates/movieinfo.html',
                    controller: 'InfoController'
                  }
                }
              })
              
              .state('tabs.add', {
                url: '/mycollections/add',
                views: {
                  'mycollections-tab' : {
                    templateUrl: 'templates/add.html',
                    controller: 'AddController'
                  }
                }
              })
              
              .state('tabs.socicollections', {
                url: '/socicollections',
                views: {
                  'socicollections-tab' : {
                    templateUrl: 'templates/socicollections.html',
                    controller: 'SocialController'
                  }
                }
              })
              
              .state('tabs.viewers', {
                url: '/socicollections/viewers/:mId',
                views: {
                  'socicollections-tab' : {
                    templateUrl: 'templates/viewers.html',
                    controller: 'ViewersController'
                  }
                }
              })
              
              .state('tabs.credits', {
                url: '/credits',
                views: {
                  'credits-tab' : {
                    templateUrl: 'templates/credits.html',
                    controller: 'CreditsController'
                  }
                }
              });
        $urlRouterProvider.otherwise('/tab/home');
    })

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("ViewersController", function($scope,$ionicPopup,$http,$location,$state,$ionicLoading,$localStorage) {
  
     $scope.movId=$state.params.mId;
  
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
  
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("CreditsController", function($scope,$ionicPopup,$http,$location) {
  
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("SocialController", function($scope,$state,$location,$ionicLoading,$http,$localStorage,$ionicPopup) {
    
  $scope.ratingsObject = {
        readOnly: true,
        iconOnColor: 'rgb(255, 185, 15)',  //Optional
        iconOffColor:  'rgb(211, 211, 211)',    //Optional
        callback: function(rating,ratingsObjId) {    //Mandatory
          //$scope.ratingsCallback(rating,ratingsObjId);
        }
      };
      
      $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    };
    
    $scope.refreshView = function() {
      
      window.location.reload(true);
      
    };
    
      $scope.movieInfo = function(movId) {
      
      $location.path("/tab/socicollections/movieinfo/"+movId);
      
    };
    
    $scope.viewersList = function(movId) {
      
      $location.path("/tab/socicollections/viewers/"+movId);
      
    };
  
    $scope.hide = function(){
      $ionicLoading.hide();
    };
  
  $scope.getLibrary = function() {
        
        $scope.show($ionicLoading);
          $http.get("http://api.keyrelations.in/v1/collections/getsociallibrary/"+$localStorage.fbid+"/"+$localStorage.accessToken)
              .then(function(result) {
                
                if (!result.data.hasOwnProperty('error')) {
                  
                  //$location.path("/tab/home");
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

.controller("InfoController", function($scope,$state,$location,$ionicLoading,$http) {
  
    $scope.movId=$state.params.mId;
    
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
                
                if (!result.data.hasOwnProperty('error')) {
                  
                  //$location.path("/tab/home");
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

.controller("MycollectionController", function($scope, $localStorage, $location,$ionicPopup,$http,$ionicLoading,$state) {
  
  $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    };
    
     $scope.refreshView = function() {
      
      window.location.reload(true);
      
    };
  
  $scope.hide = function(){
    $ionicLoading.hide();
  };
  
  $scope.movieInfo = function(movId) {
      
      $location.path("/tab/mycollections/movieinfo/"+movId);
      
    };

  $scope.movDelete = function(movId) {
      
      var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Are you sure to remove this movie?'
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
                console.log(error);
                return false;
            });
          
         //console.log('You are sure');
        } else {
         //console.log('You are not sure');
        }
      });
      
    };
 
  
  $scope.ratingsObject = {
        readOnly: true,
        iconOnColor: 'rgb(255, 185, 15)',  //Optional
        iconOffColor:  'rgb(211, 211, 211)',    //Optional
        callback: function(rating,ratingsObjId) {    //Mandatory
          //$scope.ratingsCallback(rating,ratingsObjId);
        }
      };
  
  $scope.getLibrary = function() {
        
        $scope.show($ionicLoading);
          $http.get("http://api.keyrelations.in/v1/collections/getmylibrary/"+$localStorage.fbid)
              .then(function(result) {
                
                if (!result.data.hasOwnProperty('error')) {
                  
                  //$location.path("/tab/home");
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
  


  
  $scope.addMov = function() {
    
          $location.path("/tab/mycollections/add");
    };
    
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("AddController", function($scope, $localStorage, $location,$ionicPopup,$http,$ionicLoading) {
  
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

.controller("LoginController", function($scope, $cordovaOauth, $localStorage, $location,$ionicPopup,$http,$ionicLoading) {
  
  if($localStorage.hasOwnProperty("accessToken") === true) {
          $location.path("/tab/home");
        }
    
    $localStorage.$reset();
    
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
              console.log(result.access_token); 
              //$location.path("/tab/home");
              $scope.show($ionicLoading);
              $service_url = "http://api.keyrelations.in/v1/collections/validateuser/"+result.access_token;
              //$http.get($service_url)
              $http.get("http://api.keyrelations.in/v1/collections/validateuser/"+result.access_token)
              .then(function(result) {
                
                if (result.data.hasOwnProperty('success')) {
                  $scope.hide($ionicLoading);
                  $location.path("/tab/home");
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
              
          }, function(error) {
              $scope.hide($ionicLoading);
              //alert("There was a problem signing in!  See the console for logs");
              console.log(error);
              $ionicPopup.alert({
                title: 'Alert',
                template: 'Unable to reach facebook server!'
              });
              return false;  
          });
          
 
    };
  
    
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("HomeController", function($scope, $localStorage, $location,$ionicPopup,$http) {
  
 $scope.init = function() {
        if($localStorage.hasOwnProperty("accessToken") === true) {
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
                  template: 'There was a problem getting your profile!'
                });
                console.log(error);
            });
        } else {
            //alert("Not logged in");
            $location.path("/login");
        }
    };

$scope.logout = function() {

          //delete $localStorage.accessToken;
          //delete $localStorage.fbid;
          $localStorage.$reset();
          $location.path("/login");
    };
              

    
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////