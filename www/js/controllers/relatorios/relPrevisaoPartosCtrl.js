angular.module('app.controllers')

.controller('relPrevisaoPartosCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory) {	

	$scope.vazio = false;
	if ($rootScope.relPrevisaoPartos.length == 0) {
		$scope.vazio = true;
	};

	for (var i = 0; i < $rootScope.relPrevisaoPartos.length; i++) {
		var aux = new Date($rootScope.relPrevisaoPartos[i].previsaoParto);
		$rootScope.relPrevisaoPartos[i].previsaoParto = (aux.getDate()) + '/' + (aux.getMonth()+1) + '/' +  
			(aux.getFullYear());
	};

	$scope.voltar = function(){
		$state.go('opcoes.relatorios');
	};

}])