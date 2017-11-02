angular.module('app.controllers')

.controller('relTamanhoEfetivoCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory) {	
	
	$scope.vazio = false;
	if ($rootScope.relTamanhoEfetivo.length == 0) {
		$scope.vazio = true;
	};
	$scope.voltar = function(){
		$state.go('opcoes.relatorios');
	};

}])