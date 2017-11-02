angular.module('app.controllers')

.controller('relControleParasitarioCtrl', ['$scope', '$stateParams', '$ionicLoading', 'CaprioviService', '$state', '$rootScope'
, '$ionicPopup', 'CaprioviFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, CaprioviService, $state, $rootScope, $ionicPopup, CaprioviFactory) {	

	$scope.vazio = false;
	if ($rootScope.relControleParasitario.length == 0) {
		$scope.vazio = true;
	};
	$scope.labels = [];		
	$scope.data = [];

	for(var i = 0; i < $rootScope.relControleParasitario.length; i++){		

		var date = new Date($rootScope.relControleParasitario[i].dataVernifugacao);
		var ano = date.getFullYear();		

		var presente = false;				

		for(var j = 0; j < $scope.labels.length; j++){		
			if ($scope.labels[j] == ano) {
				presente = true;						
			};			
		}

		if (presente == false) {
			$scope.labels.push(ano);
			var quantidade = 1;
			for(var k = i+1; k < $rootScope.relControleParasitario.length; k++){
				if (k < $rootScope.relControleParasitario.length) {
					var dateAux = new Date($rootScope.relControleParasitario[k].dataVernifugacao);
					var anoAux = dateAux.getFullYear();
					if (ano == anoAux) {
						quantidade++;
					};
				};
			}
			$scope.data.push(quantidade);			
		}

	}		

	$scope.voltar = function(){
		$state.go('opcoes.relatorios');
	};

}])