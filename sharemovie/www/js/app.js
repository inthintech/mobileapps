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
            
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tab.html'
              })
            
            .state('tab.group', {
                url: '/group',
                views: {
                  'group-tab' : {
                    templateUrl: 'templates/group.html',
                    controller: 'GroupController'
                  }
                }
              })
            
            .state('tab.profile', {
                url: '/profile',
                views: {
                  'profile-tab' : {
                    templateUrl: 'templates/profile.html'
                  }
                }
              })
            
            .state('tab.addgroup', {
                url: '/group/addgroup',
                views: {
                  'group-tab' : {
                    templateUrl: 'templates/addgroup.html',
                    controller: 'GroupController'
                  }
                }
              })
            
            .state('gtab', {
                url: '/gtab',
                abstract: true,
                templateUrl: 'templates/gtab.html',
                controller: 'GroupController'
              })
             
             .state('gtab.member', {
                url: '/member/:gId/:gName',
                views: {
                  'member-tab' : {
                    templateUrl: 'templates/member.html',
                    controller: 'GroupController'
                  }
                }
              })
             
             .state('gtab.movie', {
                url: '/movie/:gId/:gName',
                views: {
                  'movie-tab' : {
                    templateUrl: 'templates/movie.html',
                    controller: 'GroupController'
                  }
                }
              })
             
             .state('gtab.addmovie', {
                url: '/addmovie/:gId/:gName',
                views: {
                  'movie-tab' : {
                    templateUrl: 'templates/addmovie.html',
                    controller: 'GroupController'
                  }
                }
              })
             
             .state('gtab.addmember', {
                url: '/addmember/:gId/:gName',
                views: {
                  'member-tab' : {
                    templateUrl: 'templates/addmember.html',
                    controller: 'GroupController'
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
                    if(navigator.connection.type == Connection.NONE)
                    {
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
                       //console.log("show");
                        
                        var confirmPopup = $ionicPopup.confirm({
                          title: 'Facebook Login',
                          template: 'This app uses facebook login to authenticate. Do you want to proceed?'
                        });
                        confirmPopup.then(function(res) {
                          if(res) {
                            //console.log('You are sure');
                            
                            /* ---------------------Start of API Call------------------------- */
                        
                                        $cordovaFacebook.login(["public_profile","user_friends"]).then(
                                        
                                        function(success) {
                                          
                                          //console.log(success);
                                          //$state.go("home");
                                          //console.log('Logged In');
                                          
                                          $localStorage.accessToken = success.authResponse.accessToken;
                                          
                                          
                                          
                                          //$localStorage.userId = success.authResponse.userID;
                                          
                                          $scope.show($ionicLoading);
                                          
                                          $http.get("http://api.keyrelations.in/sharemovie/login/"+success.authResponse.accessToken)
                                                .then(function(result) {
                                                  
                                                  if (!result.data.hasOwnProperty('error')) {
                                                    $scope.hide($ionicLoading);
                                                    $localStorage.userId = success.authResponse.userID;
                                                    $state.go("tab.group");
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
                                        
                                       
                
                                  }
                              else {
                                //console.log('You are not sure');
                                ionic.Platform.exitApp();
                              }
                              
                            });
                                 
                          
                           /****************** END API CALL ******************/                      
                         }
                      }
                  });
    /****************** END FUNCTION ******************/  
    };

})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("GroupController", function($ionicPlatform,$location,$localStorage,$scope,$cordovaFacebook,$state,$ionicPopup,$http,$ionicLoading) {
  
   $scope.groupIdParam=$state.params.gId;
   $scope.groupNameParam=$state.params.gName;
    $scope.descLimit = 100;
   
   $scope.gotoGroup = function() {
    //$scope.groupIdParam='';
    //$scope.groupNameParam='';
    $state.go("tab.group");
  };
  
  $scope.gotoAddGroup = function() {
    $state.go("tab.addgroup");
  };
  
  $scope.gotoAddMovie = function() {
    $state.go("gtab.addmovie",{gId:$scope.groupIdParam,gName:$scope.groupNameParam});
  };
  
   $scope.gotoAddMember = function() {
    $state.go("gtab.addmember",{gId:$scope.groupIdParam,gName:$scope.groupNameParam});

  };
   
   $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    };
    
    $scope.hide = function(){
        $ionicLoading.hide();
    };
    
    $scope.startHere = function() {
      
      if($localStorage.hasOwnProperty("userId") === false)
      {
         //console.log("Login");
         //$scope.login();
         $state.go("login");
      }
      else
      {
        //console.log("Group");
        $scope.groupIdParam='';
        $scope.groupNameParam='';
        $scope.getGroupData();
      }   
    };
    
  
    $scope.groupName = '';
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
                          else {
                            
                            /****************** START API CALL ******************/
                            
                            $scope.show($ionicLoading);
                            $http.get("http://api.keyrelations.in/sharemovie/getusergroups/"+$localStorage.userId)
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
                          
                           /****************** END API CALL ******************/                      
                         }
                      }
                  });
    /****************** END FUNCTION ******************/  
    };
 
 $scope.newGroupName = '';
 
  $scope.addGroup = function() {
    
        var reg = /[^A-Za-z0-9 ]/;
    
          if ($scope.newGroupName=='') {
            $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Please enter a group name!'
                });
            return false;
          }
          
          if (reg.test($scope.newGroupName)) {
            $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Invalid input!'
                });
            return false;
          }
    
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
                          else {
                            
                            /****************** START API CALL ******************/
                            
                            $scope.show($ionicLoading);
                            $http.get("http://api.keyrelations.in/sharemovie/creategroup/"+$localStorage.userId+"/"+$scope.newGroupName)
                                .then(function(result) {
                                  
                                  if (result.data.hasOwnProperty('success')) {
                  
                                      $scope.hide($ionicLoading);
                                      var alertPopup = $ionicPopup.alert({
                                      title: 'Alert',
                                      template: result.data.success
                                      });
                                      alertPopup.then(function(res) {
                                      $state.go("tab.group");
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
                          
                           /****************** END API CALL ******************/                      
                         }
                      }
                  });
    /****************** END FUNCTION ******************/  
    };
    
    $scope.newMovieName = '';
    
    $scope.searchMovie = function() {
    
       var reg = /[^A-Za-z0-9 ]/;
    
          if ($scope.newMovieName=='') {
            $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Please enter a movie name!'
                });
            return false;
          }
          
          if (reg.test($scope.newMovieName)) {
            $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Invalid input!'
                });
            return false;
          }
    
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
                          else {
                            
                            /****************** START API CALL ******************/
                            
                            $scope.show($ionicLoading);
                            $http.get("http://api.keyrelations.in/sharemovie/searchmovie/"+$localStorage.userId+"/"+$scope.newMovieName)
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
                          
                           /****************** END API CALL ******************/                      
                         }
                      }
                  });
    /****************** END FUNCTION ******************/  
    };
    
    $scope.addMovie = function(id) {
  
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
                          else {
                            
                            /****************** START API CALL ******************/
                            
                            var confirmPopup = $ionicPopup.confirm({
                            title: 'Share Movie',
                            template: 'Are you sure you want to share this movie to group?'
                             });
                               
                             confirmPopup.then(function(res) {
                               if(res) {
                                 //console.log('You are sure');
                                 
                                 $scope.show($ionicLoading);
                               
                                 $http.get("http://api.keyrelations.in/sharemovie/addmovie/"+$localStorage.userId+"/"+document.getElementById("m"+id).value+"/"+document.getElementById("t"+id).value+"/"+document.getElementById("y"+id).value+"/"+document.getElementById("p"+id).value+"/"+$scope.groupIdParam)
                                     .then(function(result) {
                                       
                                       if (!result.data.hasOwnProperty('error')) {
                                         $scope.hide($ionicLoading);
                                           var alertPopup = $ionicPopup.alert({
                                           title: 'Alert',
                                           template: result.data.success
                                           });
                                           alertPopup.then(function(res) {
                                           $state.go("gtab.movie",{gId:$scope.groupIdParam,gName:$scope.groupNameParam});
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
                                 
                               } else {
                                 //console.log('You are not sure');
                               }
                             });
                          
                           /****************** END API CALL ******************/                      
                         }
                      }
                  });
    /****************** END FUNCTION ******************/  
    };
    
    $scope.movieName = '';
    $scope.recentAddedSortValue = false;
    $scope.sortParam = 'votes';
    
    $scope.sortChange = function() {
      
      if ($scope.recentAddedSortValue) {
        $scope.sortParam = 'timestamp';
      }
      else{
        $scope.sortParam = 'votes';
      }
      
    };
    
    $scope.getMovieData = function() {
    
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
                          else {
                            
                            /****************** START API CALL ******************/
                            
                            $scope.show($ionicLoading);
                            $http.get("http://api.keyrelations.in/sharemovie/getgroupmovies/"+$localStorage.userId+"/"+$scope.groupIdParam)
                                .then(function(result) {
                                    if (!result.data.hasOwnProperty('error')) {
                                        $scope.movData = result.data.output;
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
                                  //console.log(error);
                                  $scope.hide($ionicLoading);
                                  $ionicPopup.alert({
                                    title: 'Alert',
                                    template: 'Unable to reach app server!'
                                  });
                                  //console.log(error);
                                  return false;
                              }); 
                          
                           /****************** END API CALL ******************/                      
                         }
                      }
                  });
    /****************** END FUNCTION ******************/  
    };
    
    $scope.memberName = '';
    $scope.getMemberData = function() {
    
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
                          else {
                            
                            /****************** START API CALL ******************/
                            
                            $scope.show($ionicLoading);
                            $http.get("http://api.keyrelations.in/sharemovie/getgroupmembers/"+$localStorage.userId+"/"+$scope.groupIdParam)
                                .then(function(result) {
                                    if (!result.data.hasOwnProperty('error')) {
                                        $scope.memData = result.data.output;
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
                                  //console.log(error);
                                  $scope.hide($ionicLoading);
                                  $ionicPopup.alert({
                                    title: 'Alert',
                                    template: 'Unable to reach app server!'
                                  });
                                  //console.log(error);
                                  return false;
                              }); 
                          
                           /****************** END API CALL ******************/                      
                         }
                      }
                  });
    /****************** END FUNCTION ******************/  
    };
    
    $scope.newMemberName = '';
    $scope.searchMember = function() {
    
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
                          else {
                            
                            /****************** START API CALL ******************/
                            
                            $scope.show($ionicLoading);       
                            $http.get("https://graph.facebook.com/v2.4/me/friends", { params:
                                      { access_token: $localStorage.accessToken,
                                      fields: "name,id,picture",
                                      format: "json" }})
                            
                            .then(function(result) {
                                
                                if (result.data.hasOwnProperty('error'))
                                {
                                if (result.data.error.code==190) {
                                    $state.go("login");
                                    return false;
                                  }
                                }
                                $scope.newMemData = result.data.data;
                                $scope.hide($ionicLoading);  
                            }, function(error) {
                                $ionicPopup.alert({
                                  title: 'Alert',
                                  template: 'There was a problem getting your profile!'
                                });
                                //console.log(error);
                            });
                          
                           /****************** END API CALL ******************/                      
                         }
                      }
                  });
    /****************** END FUNCTION ******************/  
    };
    
    $scope.addMember = function(id) {
  
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
                          else {
                            
                            /****************** START API CALL ******************/
                            
                            var confirmPopup = $ionicPopup.confirm({
                            title: 'Add Member',
                            template: 'Are you sure you want to add this user to group?'
                             });
                               
                             confirmPopup.then(function(res) {
                               if(res) {
                                 //console.log('You are sure');
                                 
                                 $scope.show($ionicLoading);
                               
                                 $http.get("http://api.keyrelations.in/sharemovie/addmember/"+$localStorage.userId+"/"+id+"/"+$scope.groupIdParam)
                                     .then(function(result) {
                                       
                                       if (!result.data.hasOwnProperty('error')) {
                                         $scope.hide($ionicLoading);
                                           var alertPopup = $ionicPopup.alert({
                                           title: 'Alert',
                                           template: result.data.success
                                           });
                                           alertPopup.then(function(res) {
                                           $state.go("gtab.member",{gId:$scope.groupIdParam,gName:$scope.groupNameParam});
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
                                 
                               } else {
                                 //console.log('You are not sure');
                               }
                             });
                          
                           /****************** END API CALL ******************/                      
                         }
                      }
                  });
    /****************** END FUNCTION ******************/  
    };
    
    $scope.voteMovie = function(id) {
  
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
                          else {
                            
                            /****************** START API CALL ******************/
                            
                            var confirmPopup = $ionicPopup.confirm({
                            title: 'Vote Movie',
                            template: 'Are you sure you want to vote for this movie?'
                             });
                               
                             confirmPopup.then(function(res) {
                               if(res) {
                                 //console.log('You are sure');
                                 
                                 $scope.show($ionicLoading);
                               
                                 $http.get("http://api.keyrelations.in/sharemovie/votemovie/"+$localStorage.userId+"/"+id+"/"+$scope.groupIdParam)
                                     .then(function(result) {
                                       
                                       if (!result.data.hasOwnProperty('error')) {
                                         $scope.hide($ionicLoading);
                                           var alertPopup = $ionicPopup.alert({
                                           title: 'Alert',
                                           template: result.data.success
                                           });
                                           alertPopup.then(function(res) {
                                           //$state.go("gtab.movie",{gId:$scope.groupIdParam,gName:$scope.groupNameParam});
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
                                 
                               } else {
                                 //console.log('You are not sure');
                               }
                             });
                          
                           /****************** END API CALL ******************/                      
                         }
                      }
                  });
    /****************** END FUNCTION ******************/  
    };
    
    
    $scope.exitGroup = function(id) {
  
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
                          else {
                            
                            /****************** START API CALL ******************/
                            
                            var confirmPopup = $ionicPopup.confirm({
                            title: 'Share Movie',
                            template: 'Are you sure you want to exit this group?'
                             });
                               
                             confirmPopup.then(function(res) {
                               if(res) {
                                 //console.log('You are sure');
                                 
                                 $scope.show($ionicLoading);
                               
                                 $http.get("http://api.keyrelations.in/sharemovie/exitgroup/"+$localStorage.userId+"/"+id)
                                     .then(function(result) {
                                       
                                       if (!result.data.hasOwnProperty('error')) {
                                         $scope.hide($ionicLoading);
                                           var alertPopup = $ionicPopup.alert({
                                           title: 'Alert',
                                           template: 'You have exited the group successfully'
                                           });
                                           alertPopup.then(function(res) {
                                           //window.location.reload(true);
                                            $scope.groupIdParam='';
                                            $scope.groupNameParam='';
                                           $state.go("tab.group");
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
                                 
                               } else {
                                 //console.log('You are not sure');
                               }
                             });
                          
                           /****************** END API CALL ******************/                      
                         }
                      }
                  });
    /****************** END FUNCTION ******************/  
    };
    
});