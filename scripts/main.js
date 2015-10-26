angular.module('myFormApp', ['ui.router', 'ngTouch', 'ngAnimate', 'ngCookies'])

	.run(function($rootScope){
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		$rootScope.stateName = toState.name;
	})
		})

	.config(['$stateProvider', 
		'$urlRouterProvider', 
		'$locationProvider',
	 	function($stateProvider, 
				$urlRouterProvider, 
				$locationProvider){

	 		$locationProvider.html5Mode({
	 			enabled: true,
	 			requireBase: false,
	 			rewriteLinks: false
	 			 		});

	 		$stateProvider
	 			.state('welcome', {
	 				url: '/',
	 				templateUrl: 'welcome.html',
	 				controller: ['$cookies', function($cookies){
	 					$cookies.putObject('mars_user', undefined);
	 				}],
	 				controllerAs: 'welcome'
                 })
	 			.state('register', {
	 				url: '/register',
	 				templateUrl: 'newlogin.html',
	 				controller: 'RegisterFormCtrl',
	 			//stops user from going back to checkin page
	 			resolve: {
				user: ['$cookies', function($cookies){
				if($cookies.getObject('mars_user')) {
					$state.go('encounters');
				}
			}]
		}
			})

	 			.state('encounters', {
	 				url: '/encounters',
	 				templateUrl: 'newencounters.html'
	 			})
	 			.state('report', {
	 				url: '/report',
	 				templateUrl: 'newreport.html',
	 				controller: 'ReportFormCtrl'
	 			})
	}])


	.controller('RegisterFormCtrl', ['$scope', '$state', '$cookies', '$http', function($scope, $state, $cookies, $http){

	$scope.showValidation = false;

		var API_URL_GET_JOBS = "https://red-wdp-api.herokuapp.com/api/mars/jobs";
		var API_URL_CREATE_COLONIST = "https://red-wdp-api.herokuapp.com/api/mars/colonists";
		$scope.colonist = {};
	// 	$scope.jobs = [
	// 	'Janitor',
	// 	'Alien hunter',
	// 	'Dust farmer',
	// 	'Battery technician',
	// 	'Yoga teacher'
	// ];

	$http.get(API_URL_GET_JOBS).then(function(response){
		//debugger;
		$scope.jobs = response.data.jobs;
	});

	$scope.submitRegistration = function(e, form) {
		e.preventDefault();
		console.log(form);

		if ($scope.checkinForm.$invalid) {
			$scope.showValidation = true;
		} else {
			//debugger;

			$http({
				method: 'POST',
				url: API_URL_CREATE_COLONIST,
				data: { colonist: $scope.colonist }

			}).then(function(response){
				$cookies.putObject('mars_user', response.data.colonist);
				$state.go('encounters');

				debugger;
			})
		}
	}
	}])

	.controller('ReportFormCtrl', ['$scope', '$state', function($scope, $state){

			$scope.showValidation = false;

	// 	$scope.aliens = [
	// 	'Lizard Man',
	// 	'Giant Slug',
	// 	'Rouge Android',
	// 	'Octospider',
	// 	'Spiderpus'
	// ];

		$scope.submitReport = function (e, form) {
			e.preventDefault ();
			console.log(form);

			if ($scope.checkinForm.$invalid) {
			$scope.showValidation = true;
		}
		 else {
			alert("Thank you for reporting");
		}
		}
	}]);