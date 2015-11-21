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
    
    // Lock Screen Orientation
    //screen.lockOrientation('portrait');
    
  });
})

.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('top'); // other values: top

}])

.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tabs', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
              })
            
            .state('tabs.about', {
                url: '/about',
                views: {
                  'about-tab' : {
                    templateUrl: 'templates/about.html'
                  }
                }
              })
          
              .state('tabs.services', {
                url: '/services',
                views: {
                  'services-tab' : {
                    templateUrl: 'templates/services.html'
                  }
                }
              })
              
              .state('tabs.offers', {
                url: '/offers',
                views: {
                  'offers-tab' : {
                    templateUrl: 'templates/offers.html'
                  }
                }
              })
              
              .state('tabs.appointment', {
                url: '/appointment',
                views: {
                  'appointment-tab' : {
                    templateUrl: 'templates/appointment.html',
                    controller: 'ServiceController'
                  }
                }
              })
              
              .state('tabs.contact', {
                url: '/contact',
                views: {
                  'contact-tab' : {
                    templateUrl: 'templates/contact.html'
                  }
                }
              });
                      
        $urlRouterProvider.otherwise('/tab/about');
    })

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("ServiceController", function($scope) {
  
  
});



