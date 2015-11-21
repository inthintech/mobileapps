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
  });
})

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
              .state('tabs.stats', {
                url: '/stats',
                views: {
                  'stats-tab' : {
                    templateUrl: 'templates/stats.html',
                    controller: 'StatsController'
                  }
                }
              })
             
              .state('tabs.traffic', {
                url: '/traffic',
                views: {
                  'traffic-tab' : {
                    templateUrl: 'templates/traffic.html',
                    controller: 'TrafficController'
                  }
                }
              })
               .state('tabs.update', {
                url: '/traffic/:aId',
                views: {
                  'traffic-tab' : {
                    templateUrl: 'templates/update.html',
                    controller: 'UpdateController'
                  }
                }
              });
        $urlRouterProvider.otherwise('/login');
    })


.controller("LoginController", function($scope, $cordovaOauth, $localStorage, $location,$ionicPopup) {
  
  if($localStorage.hasOwnProperty("accessToken") === true) {
          $location.path("/tab/home");
        }
    
 
    $scope.login = function() {

          $cordovaOauth.facebook("1712007135695250", ["public_profile"]).then(function(result) {
              $localStorage.accessToken = result.access_token;
              $location.path("/tab/home");
          }, function(error) {
              //alert("There was a problem signing in!  See the console for logs");
              console.log(error);
              $ionicPopup.alert({
              title: 'Alert',
              template: 'Unable to Login!'
            });
          });
        
    
    };
  
    
})

.controller("TrafficController", function($scope,$ionicPopup,$http,$location,$state) {
  
  var $place_id_num;
  var $locdetails;

  
  $scope.initialize = function() {
    
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 13.0827, lng: 80.2707},
          zoom: 13,
          draggable:false
        });
        
          var input = document.getElementById('pac-input');
      
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);
        var marker = new google.maps.Marker({
          map: map
        });
        autocomplete.addListener('place_changed', function() {
          //infowindow.close();
          var place = autocomplete.getPlace();
          $place_id_num = place.place_id;
          if (!place.geometry) {
            return;
          }
      
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }
      
          // Set the position of the marker using the place ID and location.
          marker.setPlace({
            placeId: place.place_id,
            location: place.geometry.location
          });
          marker.setVisible(true);
          //alert($place_id_num);
        });
  
  //end of initialise function
  };
  
  $scope.checkID = function () {
    
        var isvalid = 0;
        
        if (!$place_id_num) {
          $ionicPopup.alert({
         title: 'Alert',
         template: 'Please select a valid place'
       });
        }
    
    if ($place_id_num) {
      
      $http.get('https://maps.googleapis.com/maps/api/place/details/json?placeid='+$place_id_num+'&key=AIzaSyAoyyJT2ZvV5_BtiXcj3mj7No9mlM0Ym9M')
      
      .success(function(data) {
          
                var isvalid=0;
                $locdetails = data;
                //alert($locdetails.status);
                  
                for ( var i = 0; i < $locdetails.result.address_components.length; i++) {
                
                var obj = $locdetails.result.address_components[i];
         
                for ( var key in obj) {
                    if (key=='long_name'&&obj[key].toString()=='Chennai') {
                       isvalid=1;
                    }
                    
                }
                }
                if (isvalid==0) {
                    //console.log(isvalid);
                    $ionicPopup.alert({
                         title: 'Alert',
                         template: 'Please select a location in Chennai'
                       });  
                }
                else
                {
                      //console.log(isvalid);
                      $location.path("/tab/traffic/"+$place_id_num);
                }   
        });
        
      }
      
    }
    
  
})

.controller("UpdateController", function($scope,$state,$location) {
  
  
  $scope.locId=$state.params.aId;
  
 
    
})

.controller("StatsController", function($scope) {
  
    
})

.controller("HomeController", function($scope, $cordovaOauth, $localStorage, $location,$ionicPopup,$http) {
  
 /*
 $scope.init = function() {
        if($localStorage.hasOwnProperty("accessToken") === true) {
            $http.get("https://graph.facebook.com/v2.2/me", { params:
                      { access_token: $localStorage.accessToken,
                      fields: "name,id,picture",
                      format: "json" }}).then(function(result) {
                $scope.profileData = result.data;
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        } else {
            alert("Not signed in");
            $location.path("/login");
        }
    };*/
  
  if($localStorage.hasOwnProperty("name") === false) {
            $http.get("https://graph.facebook.com/v2.2/me/", { params:
                      { access_token: $localStorage.accessToken,
                      fields: "name,id,picture",
                      format: "json" }}).then(function(result) {
                //$scope.profileData = result.data;
                $localStorage.name = result.data.name;
                $localStorage.id = result.data.id;
                $localStorage.pic = result.data.pic;
                
            }, function(error) {
                //alert("There was a problem getting your profile.  Check the logs for details.");
                //console.log(error);
                $ionicPopup.alert({
                         title: 'Alert',
                         template: 'Unable to retrieve your profile'
                       });
                $location.path("/login");
            });
            
            $localStorage.pic = $scope.profileData.picture.data.url;
        }
  else
    {
       $scope.name =  $localStorage.name;
       $scope.pic =   $localStorage.pic;
    }

    
});
      
 
