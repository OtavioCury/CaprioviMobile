angular.module('app.controllers')

.controller('relNumeroCriasCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory) {	

	$scope.vazio = false;
	if ($rootScope.relNumeroCrias.length == 0) {
		$scope.vazio = true;
	};
	var simples = 0, duplo = 0, triplo = 0, quadruplo = 0;
	$scope.labels = ["Simples","Duplo","Triplo","Quádruplo"];		

	for(var i = 0; i < $rootScope.relNumeroCrias.length; i++){		

		if ($rootScope.relNumeroCrias[i].parto == 'PARTO_SIMPLES') {
			simples++;
		}else if($rootScope.relNumeroCrias[i].parto == 'PARTO_DUPLO'){
			duplo++;
		}else if($rootScope.relNumeroCrias[i].parto == 'PARTO_TRIPLO'){
			triplo++;
		}else if($rootScope.relNumeroCrias[i].parto == 'PARTO_QUADRUPLO'){
			quadruplo++;
		};
	}		

	$scope.data = [simples, duplo, triplo, quadruplo];

	$scope.voltar = function(){
		$state.go('opcoes.relatorios');
	};

}])