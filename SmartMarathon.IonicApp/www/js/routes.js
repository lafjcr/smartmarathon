angular.module('app.routes', [])

.config(function ($stateProvider, $urlRouterProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: 'templates/menu.html',
          controller: 'AppCtrl'
      })
/*
    .state('app.search', {
        url: '/search',
        views: {
            'menuContent': {
                templateUrl: 'templates/search.html'
            }
        }
    })

    .state('app.browse', {
        url: '/browse',
        views: {
            'menuContent': {
                templateUrl: 'templates/browse.html'
            }
        }
    })
      .state('app.playlists', {
          url: '/playlists',
          views: {
              'menuContent': {
                  templateUrl: 'templates/playlists.html',
                  controller: 'PlaylistsCtrl'
              }
          }
      })

    .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
            'menuContent': {
                templateUrl: 'templates/playlist.html',
                controller: 'PlaylistCtrl'
            }
        }
    })
*/
	.state('app.smartMarathon', {
	    url: '/smartMarathon',
	    views: {
	        'menuContent': {
	            templateUrl: 'templates/smartMarathon.html',
	            controller: 'smartMarathonCtrl'
	        }
	    }
	})

	.state('app.gSSI', {
	    url: '/gSSI',
	    views: {
	        'menuContent': {
	            templateUrl: 'templates/gSSI.html',
	            controller: 'gSSICtrl'
	        }
	    }
	})

	.state('app.about', {
	    url: '/about',
	    views: {
	        'menuContent': {
	            templateUrl: 'templates/about.html',
	            controller: 'aboutCtrl'
	        }
	    }
	})

	.state('app.contact', {
	    url: '/contact',
	    views: {
	        'menuContent': {
	            templateUrl: 'templates/contact.html',
	            controller: 'contactCtrl'
	        }
	    }
	});

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/smartMarathon');
});
