//Bootstraping angular
$(document).ready(function(e) {
    angular.bootstrap(document,['controlApp']);
});

var app = angular.module("controlApp",['ngRoute']);

//Define Routteing
var views = './partials/';


app.config(['$routeProvider', function($routeProvider){

    // Application Request Routing
    $routeProvider.when('/', {
        templateUrl	:	views+'login.html',
        controller	:	'loginCtrl'
    })
	    .when('/admin', {
	        templateUrl	:	views+'admin.html',
	        controller	:	'productCtrl'
	    })
        .when('/product', {
            templateUrl :   views+'product.html',
            controller  :   'productCtrl'
        })
        .when('/cart', {
            templateUrl :   views+'cart.html',
            controller  :   'productCtrl'
        });
    
}]);